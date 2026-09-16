<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'city' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
        ]);

        $cart = Cart::with('items.product')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.',
            ], 422);
        }

        foreach ($cart->items as $item) {
            if (!$item->product) {
                return response()->json([
                    'message' => 'One of the products in your cart no longer exists.',
                ], 422);
            }

            if (!$item->product->status) {
                return response()->json([
                    'message' => "{$item->product->name} is no longer available.",
                ], 422);
            }

            if ($item->quantity > $item->product->stock) {
                return response()->json([
                    'message' => "Not enough stock for {$item->product->name}.",
                ], 422);
            }
        }

        $order = DB::transaction(function () use ($user, $cart, $validated) {

            /*
            |--------------------------------------------------------------------------
            | Create address
            |--------------------------------------------------------------------------
            */

            $address = Address::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'city' => $validated['city'],
                'address' => $validated['address'],
            ]);

            /*
            |--------------------------------------------------------------------------
            | Calculate subtotal
            |--------------------------------------------------------------------------
            */

            $subtotal = 0;

            foreach ($cart->items as $item) {
                $product = $item->product;

                $price = $product->discount_price !== null
                    ? $product->discount_price
                    : $product->price;

                $subtotal += $price * $item->quantity;
            }

            /*
            |--------------------------------------------------------------------------
            | Delivery
            |--------------------------------------------------------------------------
            */

            $shippingFee = 0;

            /*
            |--------------------------------------------------------------------------
            | Create order
            |--------------------------------------------------------------------------
            */

            $order = Order::create([
                'user_id' => $user->id,
                'address_id' => $address->id,
                'status' => 'PENDING',
                'payment_method' => 'COD',
                'subtotal' => $subtotal,
                'shipping_fee' => $shippingFee,
                'total' => $subtotal + $shippingFee,
            ]);

            /*
            |--------------------------------------------------------------------------
            | Create order items
            |--------------------------------------------------------------------------
            */

            foreach ($cart->items as $item) {
                $product = $item->product;

                $price = $product->discount_price !== null
                    ? $product->discount_price
                    : $product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $price,
                    'quantity' => $item->quantity,
                ]);

                /*
                |--------------------------------------------------------------------------
                | Reduce stock
                |--------------------------------------------------------------------------
                */

                $product->decrement('stock', $item->quantity);
            }

            /*
            |--------------------------------------------------------------------------
            | Clear cart
            |--------------------------------------------------------------------------
            */

            $cart->items()->delete();

            return $order;
        });

        $order->load([
            'address',
            'items.product',
        ]);

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    public function index(Request $request)
    {
        $orders = Order::with([
            'address',
            'items.product',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    public function adminIndex(Request $request)
{
    $orders = Order::with([
        'user:id,name,email',
        'address',
        'items.product',
    ])
        ->latest()
        ->get();

    return response()->json([
        'orders' => $orders,
    ]);
}

public function adminShow(Order $order)
{
    $order->load([
        'user:id,name,email',
        'address',
        'items.product',
    ]);

    return response()->json([
        'order' => $order,
    ]);
}

public function updateStatus(Request $request, Order $order)
{
    $validated = $request->validate([
        'status' => [
            'required',
            'in:PENDING,CONFIRMED,SHIPPED,DELIVERED,CANCELLED',
        ],
    ]);

    $order->update([
        'status' => $validated['status'],
    ]);

    $order->load([
        'user:id,name,email',
        'address',
        'items.product',
    ]);

    return response()->json([
        'message' => 'Order status updated successfully.',
        'order' => $order,
    ]);
}

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $order->load([
            'address',
            'items.product',
        ]);

        return response()->json([
            'order' => $order,
        ]);
    }
}
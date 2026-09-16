<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Get current user's cart.
     */
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate([
            'user_id' => $request->user()->id,
        ]);

        $cart->load([
            'items.product.category',
            'items.product.images',
        ]);

        return response()->json([
            'cart' => $cart,
        ]);
    }


    /**
     * Add product to cart.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],
            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        $product = Product::findOrFail(
            $validated['product_id']
        );

        if (!$product->status) {
            return response()->json([
                'message' => 'This product is unavailable.',
            ], 422);
        }

        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available.',
            ], 422);
        }

        $cart = Cart::firstOrCreate([
            'user_id' => $request->user()->id,
        ]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($item) {

            $newQuantity =
                $item->quantity +
                $validated['quantity'];

            if ($newQuantity > $product->stock) {
                return response()->json([
                    'message' =>
                        'You cannot add more than the available stock.',
                ], 422);
            }

            $item->update([
                'quantity' => $newQuantity,
            ]);

        } else {

            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
            ]);
        }

        $cart->load([
            'items.product.category',
            'items.product.images',
        ]);

        return response()->json([
            'message' => 'Product added to cart.',
            'cart' => $cart,
        ], 201);
    }


    /**
     * Update cart item quantity.
     */
    public function update(
        Request $request,
        CartItem $cartItem
    ) {
        $validated = $request->validate([
            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        if (
            $cartItem->cart->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $product = $cartItem->product;

        if ($validated['quantity'] > $product->stock) {
            return response()->json([
                'message' =>
                    'Quantity exceeds available stock.',
            ], 422);
        }

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        $cart = $cartItem->cart;

        $cart->load([
            'items.product.category',
            'items.product.images',
        ]);

        return response()->json([
            'message' => 'Cart updated.',
            'cart' => $cart,
        ]);
    }


    /**
     * Remove item from cart.
     */
    public function destroy(
        Request $request,
        CartItem $cartItem
    ) {
        if (
            $cartItem->cart->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $cart = $cartItem->cart;

        $cartItem->delete();

        $cart->load([
            'items.product.category',
            'items.product.images',
        ]);

        return response()->json([
            'message' => 'Product removed from cart.',
            'cart' => $cart,
        ]);
    }
}

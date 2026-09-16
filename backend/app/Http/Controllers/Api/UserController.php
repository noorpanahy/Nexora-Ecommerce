<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display all customers.
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->where('role', 'CUSTOMER')
            ->withCount('orders');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query
            ->latest()
            ->get();

        return response()->json([
            'customers' => $customers,
        ]);
    }

    /**
     * Display a single customer with statistics and orders.
     */
    public function show(User $user)
    {
        if ($user->role !== 'CUSTOMER') {
            return response()->json([
                'message' => 'Only customers can be managed here.',
            ], 422);
        }

        $user->loadCount('orders');

        $orders = $user->orders()
            ->latest()
            ->get();

        $completedOrders = $user->orders()
            ->where('status', 'DELIVERED')
            ->count();

        $cancelledOrders = $user->orders()
            ->where('status', 'CANCELLED')
            ->count();

        $totalSpending = $user->orders()
            ->where('status', '!=', 'CANCELLED')
            ->sum('total');

        return response()->json([
            'customer' => $user,

            'statistics' => [
                'total_orders' => $user->orders_count,
                'completed_orders' => $completedOrders,
                'cancelled_orders' => $cancelledOrders,
                'total_spending' => $totalSpending,
            ],

            'orders' => $orders,
        ]);
    }

    /**
     * Create a customer.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $customer = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'CUSTOMER',
        ]);

        $customer->loadCount('orders');

        return response()->json([
            'message' => 'Customer created successfully.',
            'customer' => $customer,
        ], 201);
    }

    /**
     * Update a customer.
     */
    public function update(Request $request, User $user)
    {
        if ($user->role !== 'CUSTOMER') {
            return response()->json([
                'message' => 'Only customers can be managed here.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user),
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        $user->loadCount('orders');

        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $user,
        ]);
    }

    /**
     * Delete a customer.
     */
    public function destroy(User $user)
    {
        if ($user->role !== 'CUSTOMER') {
            return response()->json([
                'message' => 'Administrators cannot be deleted from customer management.',
            ], 422);
        }

        if ($user->orders()->exists()) {
            return response()->json([
                'message' => 'This customer cannot be deleted because they have existing orders.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.',
        ]);
    }
}

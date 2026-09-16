<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | Basic Counts
        |--------------------------------------------------------------------------
        */

        $totalCustomers = User::where('role', 'CUSTOMER')->count();

        $totalProducts = Product::count();

        $totalOrders = Order::count();


        /*
        |--------------------------------------------------------------------------
        | Revenue
        |--------------------------------------------------------------------------
        |
        | Cancelled orders are excluded from revenue.
        |
        */

        $revenueQuery = Order::query()
            ->where('status', '!=', 'CANCELLED');

        $totalRevenue = (float) $revenueQuery->sum('total');


        /*
        |--------------------------------------------------------------------------
        | Today's Revenue
        |--------------------------------------------------------------------------
        */

        $todayRevenue = (float) Order::query()
            ->whereDate('created_at', Carbon::today())
            ->where('status', '!=', 'CANCELLED')
            ->sum('total');


        /*
        |--------------------------------------------------------------------------
        | Today's Orders
        |--------------------------------------------------------------------------
        */

        $todayOrders = Order::query()
            ->whereDate('created_at', Carbon::today())
            ->count();

            $activeOrders = Order::query()
    ->where('status', '!=', 'CANCELLED')
    ->count();

$cancelledOrders = Order::query()
    ->where('status', 'CANCELLED')
    ->count();

        /*
        |--------------------------------------------------------------------------
        | Order Status Statistics
        |--------------------------------------------------------------------------
        */

        $orderStatuses = [
            'PENDING',
            'IN_PROGRESS',
            'READY',
            'DELIVERED',
            'CANCELLED',
        ];

        $statusStatistics = [];

        foreach ($orderStatuses as $status) {
            $statusStatistics[$status] = Order::where(
                'status',
                $status
            )->count();
        }


        /*
        |--------------------------------------------------------------------------
        | Revenue - Last 6 Months
        |--------------------------------------------------------------------------
        */

        $monthlyRevenue = [];

        for ($i = 5; $i >= 0; $i--) {

            $date = Carbon::now()
                ->subMonths($i)
                ->startOfMonth();

            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $revenue = Order::query()
                ->whereBetween('created_at', [
                    $startOfMonth,
                    $endOfMonth,
                ])
                ->where('status', '!=', 'CANCELLED')
                ->sum('total');

            $orders = Order::query()
                ->whereBetween('created_at', [
                    $startOfMonth,
                    $endOfMonth,
                ])
                ->count();

            $monthlyRevenue[] = [
                'month' => $date->format('M'),
                'year' => $date->format('Y'),
                'revenue' => (float) $revenue,
                'orders' => $orders,
            ];
        }




        /*
        |--------------------------------------------------------------------------
        | Top Selling Products
        |--------------------------------------------------------------------------
        |
        | Uses order_items.quantity to determine how many units
        | of each product were sold.
        |
        */

        $topProducts = DB::table('order_items')
            ->join(
                'products',
                'products.id',
                '=',
                'order_items.product_id'
            )
            ->join(
                'orders',
                'orders.id',
                '=',
                'order_items.order_id'
            )
            ->where('orders.status', '!=', 'CANCELLED')
            ->select(
                'products.id',
                'products.name',
                DB::raw(
                    'SUM(order_items.quantity) as total_quantity'
                ),
                DB::raw(
                    'SUM(order_items.quantity * order_items.price) as total_sales'
                )
            )
            ->groupBy(
                'products.id',
                'products.name'
            )
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Recent Orders
        |--------------------------------------------------------------------------
        */

        $recentOrders = Order::query()
            ->with([
                'user:id,name,email',
            ])
            ->latest()
            ->limit(5)
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'statistics' => [
    'total_revenue' => $totalRevenue,
    'today_revenue' => $todayRevenue,

    'total_orders' => $totalOrders,
    'active_orders' => $activeOrders,
    'cancelled_orders' => $cancelledOrders,

    'today_orders' => $todayOrders,

    'total_customers' => $totalCustomers,
    'total_products' => $totalProducts,
],

            'order_statuses' => $statusStatistics,

            'monthly_revenue' => $monthlyRevenue,

            'top_products' => $topProducts,

            'recent_orders' => $recentOrders,
        ]);
    }
}
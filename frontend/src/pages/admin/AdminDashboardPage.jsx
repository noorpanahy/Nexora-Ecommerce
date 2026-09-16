import { useEffect, useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Line,
  LineChart,
} from "recharts";
import api from "../../services/api";

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      try {
        const response = await api.get("/admin/dashboard");

        if (cancelled) {
          return;
        }

        setDashboard(response.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatMoney(value) {
    return Number(value || 0).toFixed(2);
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString();
  }

  function getStatusClass(status) {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-400/10 text-emerald-400";

      case "CANCELLED":
        return "bg-red-400/10 text-red-400";

      case "READY":
        return "bg-blue-400/10 text-blue-400";

      case "IN_PROGRESS":
        return "bg-yellow-400/10 text-yellow-400";

      case "PENDING":
        return "bg-orange-400/10 text-orange-400";

      default:
        return "bg-zinc-800 text-zinc-400";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-10 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />

              <p className="mt-4 text-sm text-zinc-500">
                Loading dashboard...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 px-8 py-10 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">

            <p className="font-semibold text-red-400">
              Dashboard Error
            </p>

            <p className="mt-2 text-sm text-red-400/80">
              {error}
            </p>

          </div>

        </div>

      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const statistics = dashboard.statistics || {};

  const orderStatuses =
    dashboard.order_statuses || {};

  const monthlyRevenue =
    dashboard.monthly_revenue || [];

  const topProducts =
    dashboard.top_products || [];

  const recentOrders =
    dashboard.recent_orders || [];

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Overview
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Monitor your store performance and sales.
          </p>

        </div>


        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Revenue */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 xl:col-span-2">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Total Revenue
            </p>

            <p className="mt-3 text-3xl font-black">
              ${formatMoney(statistics.total_revenue)}
            </p>

            <p className="mt-2 text-xs text-emerald-400">
              Excluding cancelled orders
            </p>

          </div>


          {/* Today's Revenue */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 xl:col-span-2">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Today's Revenue
            </p>

            <p className="mt-3 text-3xl font-black">
              ${formatMoney(statistics.today_revenue)}
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              {statistics.today_orders || 0} orders today
            </p>

          </div>


          {/* Customers */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Customers
            </p>

            <p className="mt-3 text-3xl font-black">
              {statistics.total_customers || 0}
            </p>

          </div>


          {/* Products */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Products
            </p>

            <p className="mt-3 text-3xl font-black">
              {statistics.total_products || 0}
            </p>

          </div>

        </div>


        {/* =====================================================
            CHARTS
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Revenue Chart */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 lg:col-span-2">

            <div className="mb-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Performance
              </p>

              <h2 className="mt-2 text-xl font-black">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-zinc-600">
                Revenue from the last six months.
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={monthlyRevenue}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#52525b"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#52525b"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `$${value}`
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `$${formatMoney(value)}`,
                      "Revenue",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#34d399",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* Order Status */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Orders
            </p>

            <h2 className="mt-2 text-xl font-black">
              Order Status
            </h2>

            <div className="mt-6 space-y-5">

              {[
                {
                  label: "Pending",
                  key: "PENDING",
                  className: "bg-orange-400",
                },
                {
                  label: "In Progress",
                  key: "IN_PROGRESS",
                  className: "bg-yellow-400",
                },
                {
                  label: "Ready",
                  key: "READY",
                  className: "bg-blue-400",
                },
                {
                  label: "Delivered",
                  key: "DELIVERED",
                  className: "bg-emerald-400",
                },
                {
                  label: "Cancelled",
                  key: "CANCELLED",
                  className: "bg-red-400",
                },
              ].map((item) => {

                const count =
                  orderStatuses[item.key] || 0;

                return (
                  <div key={item.key}>

                    <div className="mb-2 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <span
                          className={`h-2 w-2 rounded-full ${item.className}`}
                        />

                        <span className="text-sm text-zinc-400">
                          {item.label}
                        </span>

                      </div>

                      <span className="text-sm font-bold text-white">
                        {count}
                      </span>

                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">

                      <div
                        className={`h-full rounded-full ${item.className}`}
                        style={{
                          width: `${
                            statistics.total_orders > 0
                              ? Math.min(
                                  (count /
                                    statistics.total_orders) *
                                    100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>


        {/* =====================================================
            TOP PRODUCTS
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-zinc-950">

            <div className="border-b border-white/10 p-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Products
              </p>

              <h2 className="mt-2 text-xl font-black">
                Top Selling Products
              </h2>

            </div>


            {topProducts.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-600">
                No sales data available yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">

                {topProducts.map((product, index) => (

                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-5"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-black text-zinc-500">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {product.total_quantity} units sold
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-bold text-emerald-400">
                        $
                        {formatMoney(
                          product.total_sales
                        )}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-wider text-zinc-700">
                        Sales
                      </p>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>


          {/* Recent Orders */}
          <div className="rounded-2xl border border-white/10 bg-zinc-950">

            <div className="border-b border-white/10 p-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
                Activity
              </p>

              <h2 className="mt-2 text-xl font-black">
                Recent Orders
              </h2>

            </div>


            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-sm text-zinc-600">
                No orders yet.
              </div>
            ) : (
              <div className="divide-y divide-white/5">

                {recentOrders.map((order) => (

                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-5"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-zinc-400">
                      #{order.id}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-white">
                        {order.user?.name ||
                          "Guest Customer"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatDate(order.created_at)}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm font-bold">
                        ${formatMoney(order.total)}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-[9px] font-bold ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

        </div>


        {/* =====================================================
            MONTHLY DATA TABLE
        ====================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">

          <div className="border-b border-white/10 p-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
              Reports
            </p>

            <h2 className="mt-2 text-xl font-black">
              Monthly Performance
            </h2>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px] text-left">

              <thead className="border-b border-white/10 bg-white/[0.02]">

                <tr>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Month
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Revenue
                  </th>

                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    Average Order
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-white/5">

                {monthlyRevenue.map((month) => {

                  const average =
                    month.orders > 0
                      ? Number(month.revenue) /
                        Number(month.orders)
                      : 0;

                  return (
                    <tr
                      key={`${month.year}-${month.month}`}
                      className="transition hover:bg-white/[0.02]"
                    >

                      <td className="px-6 py-5">

                        <p className="font-semibold">
                          {month.month}{" "}
                          <span className="text-zinc-600">
                            {month.year}
                          </span>
                        </p>

                      </td>

                      <td className="px-6 py-5 text-sm text-zinc-400">
                        {month.orders}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-emerald-400">
                        ${formatMoney(month.revenue)}
                      </td>

                      <td className="px-6 py-5 text-right text-sm text-zinc-400">
                        ${formatMoney(average)}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboardPage;
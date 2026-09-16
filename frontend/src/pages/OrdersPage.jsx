import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get("/orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusStyle(status) {
    switch (status) {
      case "PENDING":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-400";

      case "CONFIRMED":
        return "border-blue-400/20 bg-blue-400/10 text-blue-400";

      case "SHIPPED":
        return "border-purple-400/20 bg-purple-400/10 text-purple-400";

      case "DELIVERED":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";

      case "CANCELLED":
        return "border-red-400/20 bg-red-400/10 text-red-400";

      default:
        return "border-white/10 bg-white/5 text-zinc-400";
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
            My Orders
          </h1>

          <p className="mt-3 text-zinc-500">
            View and track your previous orders.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && orders.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 px-6 py-16 text-center">
            <div className="mb-6 text-6xl">📦</div>

            <h2 className="text-2xl font-bold text-white">
              No orders yet
            </h2>

            <p className="mt-3 text-zinc-500">
              Your orders will appear here after you make a purchase.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 transition hover:border-white/20"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                {/* Order information */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-white">
                      Order #{order.id}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    Placed on{" "}
                    {formatDate(order.created_at)}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {order.items?.length || 0} item
                    {(order.items?.length || 0) !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                {/* Total */}
                <div className="md:text-right">
                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Total
                  </p>

                  <p className="mt-1 text-2xl font-black text-emerald-400">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>

                {/* View */}
                <Link
                  to={`/orders/${order.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/40 hover:text-emerald-400"
                >
                  View Order →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
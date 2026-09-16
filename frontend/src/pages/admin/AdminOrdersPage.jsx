import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get("/admin/orders");

        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  async function updateStatus(orderId, status) {
    try {
      setUpdatingId(orderId);

      const response = await api.put(
        `/admin/orders/${orderId}/status`,
        {
          status,
        }
      );

      setOrders((previous) =>
        previous.map((order) =>
          order.id === orderId
            ? response.data.order
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        String(order.id)
          .toLowerCase()
          .includes(searchValue) ||
        order.user?.name
          ?.toLowerCase()
          .includes(searchValue) ||
        order.user?.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  function statusClass(status) {
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
    <div className="min-h-screen bg-zinc-950 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            Orders
          </h1>

          <p className="mt-3 text-zinc-500">
            Manage customer orders and update their status.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4 md:flex-row">
          <input
            type="text"
            placeholder="Search order, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-16 text-center">
            <p className="text-lg font-semibold text-white">
              No orders found
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Order
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Items
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Total
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="font-semibold text-white hover:text-emerald-400"
                        >
                          #{order.id}
                        </Link>

                        <p className="mt-1 text-xs text-zinc-600">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium text-white">
                          {order.user?.name}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {order.user?.email}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-zinc-400">
                        {order.items?.reduce(
                          (total, item) =>
                            total + Number(item.quantity),
                          0
                        )}
                      </td>

                      <td className="px-6 py-5 font-semibold text-emerald-400">
                        ${Number(order.total).toFixed(2)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/50 disabled:opacity-50"
                        >
                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="CONFIRMED">
                            Confirmed
                          </option>

                          <option value="SHIPPED">
                            Shipped
                          </option>

                          <option value="DELIVERED">
                            Delivered
                          </option>

                          <option value="CANCELLED">
                            Cancelled
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Count */}
        <p className="mt-5 text-sm text-zinc-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
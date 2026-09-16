import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminCustomerDetailsPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  const [statistics, setStatistics] = useState({
    total_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    total_spending: 0,
  });

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCustomer() {
      try {
        const response = await api.get(
          `/admin/customers/${id}`
        );

        if (cancelled) {
          return;
        }

        setCustomer(response.data.customer);

        setStatistics(
          response.data.statistics || {
            total_orders: 0,
            completed_orders: 0,
            cancelled_orders: 0,
            total_spending: 0,
          }
        );

        setOrders(response.data.orders || []);
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load customer."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCustomer();

    return () => {
      cancelled = true;
    };
  }, [id]);

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
        <p className="text-zinc-500">
          Loading customer...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 px-8 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-400">
            {error}
          </div>

          <Link
            to="/admin/customers"
            className="mt-5 inline-block text-sm text-zinc-500 hover:text-white"
          >
            ← Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-8 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          to="/admin/customers"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to Customers
        </Link>


        {/* Customer Header */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-2xl font-black text-zinc-950">
                {customer.name
                  ?.charAt(0)
                  ?.toUpperCase() || "C"}
              </div>

              <div>
                <h1 className="text-2xl font-black">
                  {customer.name}
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  {customer.email}
                </p>

                <p className="mt-1 text-xs text-zinc-700">
                  Customer #{customer.id}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Joined {formatDate(customer.created_at)}
                </p>
              </div>

            </div>

            <Link
              to={`/admin/customers/${customer.id}/edit`}
              className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-semibold text-zinc-300 transition hover:border-emerald-400/30 hover:text-emerald-400"
            >
              Edit Customer
            </Link>

          </div>
        </div>


        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Total Orders
            </p>

            <p className="mt-3 text-3xl font-black">
              {statistics.total_orders}
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Completed
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-400">
              {statistics.completed_orders}
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Cancelled
            </p>

            <p className="mt-3 text-3xl font-black text-red-400">
              {statistics.cancelled_orders}
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Total Spending
            </p>

            <p className="mt-3 text-3xl font-black">
              ${formatMoney(statistics.total_spending)}
            </p>
          </div>

        </div>


        {/* Order History */}
        <div className="mt-10">

          <div className="mb-5">
            <h2 className="text-xl font-black">
              Order History
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              All orders placed by this customer.
            </p>
          </div>


          <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">

            {orders.length === 0 ? (
              <div className="p-12 text-center">

                <p className="font-semibold text-zinc-300">
                  No orders yet
                </p>

                <p className="mt-2 text-sm text-zinc-600">
                  This customer has not placed any orders.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="border-b border-white/10 bg-white/[0.02]">
                    <tr>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Order
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Total
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-600">
                        Action
                      </th>

                    </tr>
                  </thead>


                  <tbody className="divide-y divide-white/5">

                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-white/[0.02]"
                      >

                        <td className="px-6 py-5">
                          <span className="font-semibold">
                            #{order.id}
                          </span>
                        </td>


                        <td className="px-6 py-5 text-sm text-zinc-500">
                          {formatDate(order.created_at)}
                        </td>


                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>


                        <td className="px-6 py-5 font-semibold">
                          ${formatMoney(order.total)}
                        </td>


                        <td className="px-6 py-5 text-right">

                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="text-sm font-semibold text-zinc-400 transition hover:text-emerald-400"
                          >
                            View Order →
                          </Link>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminCustomerDetailsPage;
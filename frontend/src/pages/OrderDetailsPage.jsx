import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import api from "../services/api";

function OrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  
  // Check if we are in the admin panel based on the URL path
  const isAdmin = location.pathname.startsWith("/admin");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        // Dynamically choose the correct backend route
        const endpoint = isAdmin 
          ? `/admin/orders/${id}` 
          : `/orders/${id}`;

        const response = await api.get(endpoint);

        if (!ignore) {
          setOrder(response.data.order || response.data);
        }
      } catch (error) {
        console.error("Failed to load order:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load order."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadOrder();
    }

    return () => {
      ignore = true;
    };
  }, [id, isAdmin]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950 px-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Order not found
          </h1>

          <p className="mt-3 text-zinc-500">
            {error || "We couldn't find this order."}
          </p>

          <Link
            to={isAdmin ? "/admin/orders" : "/products"}
            className="mt-8 inline-flex rounded-xl bg-indigo-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-indigo-300"
          >
            {isAdmin ? "Back to Admin Orders" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8">

          <div className="text-center">
            <div className="text-6xl">📦</div>

            <h1 className="mt-6 text-3xl font-black text-white">
              {isAdmin ? `Admin View: Order #${order.id}` : "Order placed successfully"}
            </h1>

            <p className="mt-2 text-zinc-500">
              Order status: <span className="text-indigo-400 font-semibold">{order.status || 'Processed'}</span>
            </p>
          </div>

          {/* Delivery Info */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-lg font-bold text-white">
              Delivery information
            </h2>

            <div className="mt-3 space-y-1 text-sm text-zinc-400">
              <p>{order.address?.name}</p>
              <p>{order.address?.phone}</p>
              <p>{order.address?.city}</p>
              <p>{order.address?.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-lg font-bold text-white">
              Items
            </h2>

            <div className="mt-4 space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-white/5 pb-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-white">
                      {item.product_name}
                    </p>
                    <p className="text-zinc-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold text-indigo-400">
                    \${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 border-t border-white/10 pt-6 space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span>\${Number(order.subtotal || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm text-zinc-400">
              <span>Shipping</span>
              <span>\${Number(order.shipping_fee || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-indigo-400">
                \${Number(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            to={isAdmin ? "/admin/orders" : "/products"}
            className="mt-8 block rounded-xl bg-indigo-400 px-6 py-4 text-center font-bold text-zinc-950 transition hover:bg-indigo-300"
          >
            {isAdmin ? "Back to Admin Orders" : "Continue Shopping"}
          </Link>

        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

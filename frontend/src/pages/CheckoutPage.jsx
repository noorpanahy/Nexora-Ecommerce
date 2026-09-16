import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import api from "../services/api";

function CheckoutPage() {
  const { cart, cartSubtotal, loading, clearCart } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  const shippingFee = 0;
  const total = cartSubtotal + shippingFee;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setPlacingOrder(true);

    try {
      const response = await api.post("/orders", form);

      clearCart();

      navigate(`/orders/${response.data.order.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950 px-6">
        <div className="text-center">
          <div className="mb-6 text-6xl">🛒</div>

          <h1 className="text-3xl font-bold text-white">
            Your cart is empty
          </h1>

          <p className="mt-3 text-zinc-500">
            Add some products before checking out.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
            Complete your order
          </h1>

          <p className="mt-3 text-zinc-500">
            Enter your delivery information and confirm your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* Left */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 sm:p-8"
            >
              <h2 className="text-xl font-bold text-white">
                Delivery information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Where should we deliver your order?
              </p>

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+93 700 000 000"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* City */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Full delivery address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Street, neighborhood, building, house number..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white">
                  Payment method
                </h2>

                <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-xl text-zinc-950">
                      $
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        Pay when your order arrives.
                      </p>
                    </div>

                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                    Placing order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right */}
          <aside>
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-zinc-900/70 p-6">

              <h2 className="text-xl font-bold text-white">
                Order summary
              </h2>

              <div className="mt-6 space-y-4">
                {cart.items.map((item) => {
                  const product = item.product;

                  const price =
                    product.discount_price !== null &&
                    product.discount_price !== undefined
                      ? Number(product.discount_price)
                      : Number(product.price);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-white/5 pb-4"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-800">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-zinc-600">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">
                          {product.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          Qty: {item.quantity}
                        </p>

                        <p className="mt-1 font-semibold text-emerald-400">
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    Subtotal
                  </span>

                  <span className="text-white">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    Delivery
                  </span>

                  <span className="text-emerald-400">
                    Free
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total
                    </span>

                    <span className="text-2xl font-black text-emerald-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
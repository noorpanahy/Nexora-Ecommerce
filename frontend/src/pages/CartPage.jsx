import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

const API_URL = "http://127.0.0.1:8000";

function getImageUrl(image) {
  if (!image) {
    return null;
  }

  const source =
    image.url || image.image;

  if (!source) {
    return null;
  }

  if (source.startsWith("http")) {
    return source;
  }

  if (source.startsWith("/")) {
    return `${API_URL}${source}`;
  }

  return `${API_URL}/${source}`;
}

function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartItem,
    removeFromCart,
    loading,
  } = useCart();

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950 text-white">
        Loading cart...
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950 px-6 text-white">

        <div className="max-w-md text-center">

          <div className="text-7xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            You haven't added anything to your cart yet.
          </p>

          <Link
          to="/products"
          className="mt-8 inline-flex rounded-full bg-white px-7 py-4 text-sm font-bold !text-black transition hover:scale-105"
          >
  Start Shopping
</Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}

      <section className="border-b border-white/5 bg-zinc-900/40">

        <div className="page-container py-16">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600">
            Your shopping bag
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight">
            Cart
          </h1>

          <p className="mt-4 text-zinc-500">
            {cartCount}{" "}
            {cartCount === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>

        </div>

      </section>


      {/* Cart */}

      <section className="page-container py-12">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Items */}

          <div className="space-y-4">

            {items.map((item) => {

              const product = item.product;

              const image = getImageUrl(
                product.images?.[0]
              );

              const price =
                product.discount_price !== null &&
                product.discount_price !== undefined
                  ? Number(product.discount_price)
                  : Number(product.price);

              const itemTotal =
                price *
                Number(item.quantity);

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-zinc-900/60 p-4 sm:p-5"
                >

                  <div className="flex gap-5">

                    {/* Image */}

                    <Link
                      to={`/products/${product.id}`}
                      className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800 sm:h-36 sm:w-36"
                    >

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">
                          🛍️
                        </div>
                      )}

                    </Link>


                    {/* Details */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex justify-between gap-4">

                        <div>

                          {product.category?.name && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                              {product.category.name}
                            </p>
                          )}

                          <Link
                            to={`/products/${product.id}`}
                            className="mt-2 block text-lg font-bold transition hover:text-zinc-400"
                          >
                            {product.name}
                          </Link>

                        </div>


                        {/* Remove */}

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-xs text-zinc-600 transition hover:text-red-400"
                        >
                          Remove
                        </button>

                      </div>


                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4">

                        {/* Quantity */}

                        <div className="flex h-10 items-center rounded-xl border border-white/10 bg-zinc-950">

                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              updateCartItem(
                                item.id,
                                Number(item.quantity) - 1
                              )
                            }
                            className="flex h-full w-9 items-center justify-center text-zinc-500 hover:text-white disabled:opacity-30"
                          >
                            −
                          </button>

                          <span className="w-8 text-center text-xs font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            disabled={
                              Number(item.quantity) >=
                              Number(product.stock)
                            }
                            onClick={() =>
                              updateCartItem(
                                item.id,
                                Number(item.quantity) + 1
                              )
                            }
                            className="flex h-full w-9 items-center justify-center text-zinc-500 hover:text-white disabled:opacity-30"
                          >
                            +
                          </button>

                        </div>


                        {/* Price */}

                        <p className="text-lg font-bold">
                          ${itemTotal.toFixed(2)}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>


          {/* Summary */}

          <div className="h-fit rounded-3xl border border-white/10 bg-zinc-900/60 p-6 lg:sticky lg:top-28">

            <h2 className="text-xl font-bold">
              Order summary
            </h2>


            <div className="mt-7 space-y-4 text-sm">

              <div className="flex justify-between text-zinc-500">
                <span>
                  Subtotal
                </span>

                <span className="font-semibold text-white">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>


              <div className="flex justify-between text-zinc-500">
                <span>
                  Shipping
                </span>

                <span className="font-semibold text-white">
                  Calculated at checkout
                </span>
              </div>

            </div>


            <div className="my-6 border-t border-white/10" />


            <div className="flex items-center justify-between">

              <span className="font-bold">
                Total
              </span>

              <span className="text-2xl font-black">
                ${cartSubtotal.toFixed(2)}
              </span>

            </div>


            <button
              type="button"
              disabled
              className="mt-7 w-full rounded-2xl bg-white py-4 text-sm font-bold text-black opacity-50"
            ><Link
  to="/checkout"
  className="flex w-full items-center justify-center rounded-xl bg-emerald-400 px-6 py-4 font-bold text-zinc-950 transition hover:bg-emerald-300"
>
  Proceed to Checkout
</Link>
            </button>


            <Link
              to="/products"
              className="mt-4 block text-center text-sm text-zinc-500 transition hover:text-white"
            >
              ← Continue shopping
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default CartPage;
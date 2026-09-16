import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function getImageUrl(product) {
  const image =
    product?.images?.[0]?.url ||
    product?.images?.[0]?.image ||
    null;

  if (!image) {
    return null;
  }

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
}

function ProductCard({ product }) {
  const imageUrl = getImageUrl(product);

  const hasDiscount =
    product.discount_price !== null &&
    product.discount_price !== undefined &&
    Number(product.discount_price) < Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discount_price)) /
          Number(product.price)) *
          100
      )
    : 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-zinc-900">
        
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-zinc-800">
          
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              🛍️
            </div>
          )}

          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-black shadow-lg">
              -{discountPercent}%
            </div>
          )}

          {/* Quick View */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-5 pt-12 transition duration-500 group-hover:translate-y-0">
            <div className="rounded-xl bg-white py-3 text-center text-sm font-bold text-black">
              View Product
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-5">
          
          {/* Category */}
          {product.category?.name && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold text-white transition group-hover:text-zinc-300">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-white">
                  ${Number(product.discount_price).toFixed(2)}
                </span>

                <span className="text-sm text-zinc-500 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-white">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            {Number(product.stock) > 0 ? (
              <span className="text-xs font-medium text-zinc-500">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-xs font-semibold text-red-400">
                Out of stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
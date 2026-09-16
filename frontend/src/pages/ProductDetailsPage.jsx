import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";
import { useCart } from "../context/useCart";

const API_URL = "http://127.0.0.1:8000";


function getImageUrl(image) {
  if (!image) {
    return null;
  }

  const url =
    image.url ||
    image.image ||
    image.image_url ||
    null;

  if (!url) {
    return null;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  if (url.startsWith("/storage/")) {
    return `${API_URL}${url}`;
  }

  if (url.startsWith("/")) {
    return `${API_URL}${url}`;
  }

  return `${API_URL}/storage/${url}`;
}

function ProductDetailsPage() {
  const { id } = useParams();

  // ==========================================
  // CART
  // ==========================================

  const { addToCart } = useCart();

  // ==========================================
  // STATE
  // ==========================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

       const response = await api.get(`/products/${id}`);

console.log("PRODUCT API RESPONSE:", response.data);

const data =
  response.data?.product ||
  response.data?.data?.product ||
  response.data?.data ||
  response.data;

console.log("PRODUCT:", data);

        if (!ignore) {
  setProduct(data);
  setSelectedImageIndex(0);
}
      } catch (error) {
        console.error("Failed to load product:", error);

        if (!ignore) {
          setProduct(null);

          setError(
            error.response?.data?.message ||
              "Failed to load product."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // ==========================================
  // QUANTITY
  // ==========================================

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    if (!product) {
      return;
    }

    const stock = Number(product.stock ?? 0);

    setQuantity((current) =>
      Math.min(stock || 1, current + 1)
    );
  }

  // ==========================================
  // ADD TO CART
  // ==========================================

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    const stock = Number(product.stock ?? 0);
    const isOutOfStock = stock <= 0;

    if (isOutOfStock) {
      return;
    }

    try {
      await addToCart(
        product.id,
        quantity
      );

      // Optimistically reflect the reduced availability
      setProduct((prev) => ({
        ...prev,
        stock: Number(prev.stock ?? 0) - quantity,
      }));

      const addedQuantity = quantity;

      setQuantity(1);

      alert(
        `${addedQuantity} × ${product.name} added to cart.`
      );
    } catch (error) {
      console.error(
        "Failed to add product:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add product to cart.";

      alert(message);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="page-container py-24">
          <Loading />
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="page-container py-24">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-zinc-900/60 px-6 py-20 text-center">

            <div className="text-6xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Product not found
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
              {error ||
                "We couldn't find the product you're looking for."}
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition hover:scale-105"
            >
              Back to Products
            </Link>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const stock = Number(product.stock ?? 0);

  const isOutOfStock = stock <= 0;

  const price = Number(product.price ?? 0);

  const discountPrice =
    product.discount_price !== null &&
    product.discount_price !== undefined
      ? Number(product.discount_price)
      : null;

  const hasDiscount =
    discountPrice !== null &&
    discountPrice < price;

  const currentPrice = hasDiscount
    ? discountPrice
    : price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((price - discountPrice) / price) * 100
      )
    : 0;

const productImages = Array.isArray(product.images)
  ? product.images
  : [];

const selectedImage = productImages[selectedImageIndex] || null;

const image = getImageUrl(selectedImage);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* =====================================
          HEADER
      ====================================== */}

      <section className="border-b border-white/5 bg-zinc-900/40">

        <div className="page-container py-8">

          <div className="flex items-center gap-3 text-sm text-zinc-500">

            <Link
              to="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/products"
              className="transition hover:text-white"
            >
              Products
            </Link>

            <span>/</span>

            <span className="truncate text-zinc-300">
              {product.name}
            </span>

          </div>

        </div>

      </section>

      {/* =====================================
          PRODUCT DETAILS
      ====================================== */}

      <section className="page-container py-12 pb-24">

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* =================================
              PRODUCT IMAGE
          ================================== */}

  {/* =================================
    PRODUCT IMAGE GALLERY
================================== */}

<div>
  {/* MAIN IMAGE */}
  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/60">
    <div className="aspect-square">
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-8xl">
          🛍️
        </div>
      )}
    </div>
  </div>

  {/* THUMBNAILS */}
  {productImages.length > 1 && (
    <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
      {productImages.map((item, index) => {
        const thumbnailUrl = getImageUrl(item);

        const isSelected =
          index === selectedImageIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setSelectedImageIndex(index)
            }
            className={`relative overflow-hidden rounded-xl border transition ${
              isSelected
                ? "border-white ring-2 ring-white/20"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={`${product.name} ${index + 1}`}
                className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-zinc-900 text-xl">
                🛍️
              </div>
            )}

            {/* Primary badge */}
            {item.is_primary && (
              <span className="absolute bottom-1 left-1 rounded-full bg-emerald-400 px-2 py-0.5 text-[9px] font-bold uppercase text-zinc-950">
                Primary
              </span>
            )}
          </button>
        );
      })}
    </div>
  )}
</div>

          {/* =================================
              PRODUCT INFORMATION
          ================================== */}

          <div className="lg:pt-6">

            {/* CATEGORY */}

            {product.category?.name && (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600">
                {product.category.name}
              </p>
            )}

            {/* PRODUCT NAME */}

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {/* SKU */}

            {product.sku && (
              <p className="mt-3 text-sm text-zinc-600">
                SKU: {product.sku}
              </p>
            )}

            {/* =================================
                PRICE
            ================================== */}

            <div className="mt-8 flex flex-wrap items-center gap-4">

              <span className="text-3xl font-black">
                ${currentPrice.toFixed(2)}
              </span>

              {hasDiscount && (
                <>
                  <span className="text-lg text-zinc-600 line-through">
                    ${price.toFixed(2)}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}

            </div>

            {/* =================================
                DESCRIPTION
            ================================== */}

            {product.description && (
              <div className="mt-8 border-t border-white/10 pt-8">

                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Description
                </h2>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {product.description}
                </p>

              </div>
            )}

            {/* =================================
                STOCK
            ================================== */}

            <div className="mt-8">

              {isOutOfStock ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4">

                  <p className="text-sm font-semibold text-red-400">
                    Out of stock
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    This product is currently unavailable.
                  </p>

                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-zinc-400">
                    {stock}{" "}
                    {stock === 1
                      ? "item"
                      : "items"}{" "}
                    available
                  </span>

                </div>
              )}

            </div>

            {/* =================================
                QUANTITY + ADD TO CART
            ================================== */}

            {!isOutOfStock && (
              <div className="mt-8">

                <div className="flex flex-col gap-4 sm:flex-row">

                  {/* QUANTITY */}

                  <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-zinc-900">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-full w-14 items-center justify-center text-xl text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>

                    <div className="flex w-12 justify-center text-sm font-bold">
                      {quantity}
                    </div>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="flex h-full w-14 items-center justify-center text-xl text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>

                  </div>

                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="h-14 flex-1 rounded-2xl bg-white px-8 text-sm font-black text-black transition hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>

                </div>

              </div>
            )}

            {/* =================================
                BACK TO PRODUCTS
            ================================== */}

            <div className="mt-8">

              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition hover:text-white"
              >
                ← Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ProductDetailsPage;
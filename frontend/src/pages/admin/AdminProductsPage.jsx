import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

async function loadProducts(ignore) {
  try {
    setError("");

    const response = await api.get("/products");

    console.log("PRODUCT API RESPONSE:", response.data);

    const data = response.data;

    const productList =
      data?.products ||
      data?.data?.products ||
      data?.data ||
      [];

    if (!ignore.current) {
      setProducts(
        Array.isArray(productList)
          ? productList
          : []
      );

      setLoading(false);
    }
  } catch (error) {
    console.error("Failed to load products:", error);

    if (!ignore.current) {
      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );

      setLoading(false);
    }
  }
}

useEffect(() => {
  const ignore = {
    current: false,
  };

  const load = async () => {
    await loadProducts(ignore);
  };

  load();

  return () => {
    ignore.current = true;
  };
}, []);

  

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !search ||
        product.name
          ?.toLowerCase()
          .includes(searchValue) ||
        product.sku
          ?.toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        !category ||
        String(product.category_id) ===
          String(category);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/admin/products/${product.id}`
      );

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  }

  function formatPrice(value) {
    return `$${Number(value || 0).toFixed(2)}`;
  }

  function getImage(product) {
    const image =
      product.images?.[0]?.url ||
      product.images?.[0]?.image;

    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    return `http://127.0.0.1:8000/${image}`;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-6 backdrop-blur md:px-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              Products
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage your store products and inventory.
            </p>
          </div>

          <Link
            to="/admin/products/create"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-center text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
          >
            + Add Product
          </Link>
        </div>
      </header>

      <div className="p-6 md:p-10">
        {/* FILTERS */}
        <div className="mb-6 grid gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 md:grid-cols-[1fr_220px]">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
          >
            <option value="">
              All categories
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* PRODUCTS */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
          {loading ? (
            <div className="p-12 text-center text-sm text-zinc-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-400">
                No products found.
              </p>

              <p className="mt-2 text-sm text-zinc-600">
                Try changing your search or category.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-zinc-600">
                    <th className="px-6 py-4">
                      Product
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Price
                    </th>

                    <th className="px-6 py-4">
                      Stock
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map(
                    (product) => {
                      const image =
                        getImage(product);

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                        >
                          {/* PRODUCT */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 overflow-hidden rounded-xl bg-zinc-900">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-zinc-700">
                                    No image
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-zinc-600">
                                  SKU:{" "}
                                  {product.sku}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CATEGORY */}
                          <td className="px-6 py-4 text-sm text-zinc-400">
                            {product.category
                              ?.name || "-"}
                          </td>

                          {/* PRICE */}
                          <td className="px-6 py-4">
                            {product.discount_price !==
                              null &&
                            product.discount_price !==
                              undefined ? (
                              <div>
                                <p className="font-semibold text-emerald-400">
                                  {formatPrice(
                                    product.discount_price
                                  )}
                                </p>

                                <p className="text-xs text-zinc-600 line-through">
                                  {formatPrice(
                                    product.price
                                  )}
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold text-white">
                                {formatPrice(
                                  product.price
                                )}
                              </p>
                            )}
                          </td>

                          {/* STOCK */}
                          <td className="px-6 py-4">
                            <span
                              className={
                                Number(
                                  product.stock
                                ) <= 5
                                  ? "text-sm font-semibold text-red-400"
                                  : "text-sm text-zinc-400"
                              }
                            >
                              {product.stock}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-4">
                            {
                              product.status
                             ? (
                              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-500">
                                Inactive
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/admin/products/${product.id}/edit`}
                                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
                              >
                                Edit
                              </Link>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                className="rounded-lg border border-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* COUNT */}
        {!loading && (
          <p className="mt-4 text-sm text-zinc-600">
            Showing {filteredProducts.length} of{" "}
            {products.length} products
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminProductsPage;
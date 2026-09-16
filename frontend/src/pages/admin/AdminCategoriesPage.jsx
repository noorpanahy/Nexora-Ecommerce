import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setError("");

        const response = await api.get("/categories");

        if (cancelled) {
          return;
        }

        const data = response.data;

        const categoryList =
          data?.categories ||
          data?.data?.categories ||
          data?.data ||
          [];

        setCategories(
          Array.isArray(categoryList)
            ? categoryList
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load categories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCategories = categories.filter(
    (category) => {
      const searchValue =
        search.trim().toLowerCase();

      if (!searchValue) {
        return true;
      }

      return (
        category.name
          ?.toLowerCase()
          .includes(searchValue) ||
        category.slug
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(category.id);
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/categories/${category.id}`
      );

      setCategories((current) =>
        current.filter(
          (item) => item.id !== category.id
        )
      );

      setSuccess(
        "Category deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">

      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-8 backdrop-blur md:px-10">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              Categories
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Manage your store categories.
            </p>
          </div>

          <Link
            to="/admin/categories/create"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
          >
            + Add Category
          </Link>

        </div>
      </header>

      <div className="p-6 md:p-10">

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        )}

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950 p-5">

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search categories..."
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
          />

        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="border-b border-white/10 text-left">

                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Category
                  </th>

                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Slug
                  </th>

                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Products
                  </th>

                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Status
                  </th>

                  <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => {

                    const productCount =
                      Array.isArray(
                        category.products
                      )
                        ? category.products.length
                        : category.products_count ??
                          0;

                    return (
                      <tr
                        key={category.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-white">
                            {category.name}
                          </p>

                          {category.description && (
                            <p className="mt-1 max-w-md truncate text-xs text-zinc-600">
                              {category.description}
                            </p>
                          )}

                        </td>

                        <td className="px-6 py-5 text-sm text-zinc-500">
                          {category.slug}
                        </td>

                        <td className="px-6 py-5 text-sm text-zinc-400">
                          {productCount}
                        </td>

                        <td className="px-6 py-5">

                          {category.status ? (
                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-500">
                              Inactive
                            </span>
                          )}

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/admin/categories/${category.id}/edit`}
                              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  category
                                )
                              }
                              disabled={
                                deleting ===
                                category.id
                              }
                              className="rounded-xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deleting ===
                              category.id
                                ? "Deleting..."
                                : "Delete"}
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

          {filteredCategories.length === 0 && (
            <div className="px-6 py-16 text-center">

              <p className="text-sm text-zinc-500">
                No categories found.
              </p>

            </div>
          )}

        </div>

        <p className="mt-4 text-sm text-zinc-600">
          Showing {filteredCategories.length} of{" "}
          {categories.length} categories
        </p>

      </div>
    </div>
  );
}

export default AdminCategoriesPage;
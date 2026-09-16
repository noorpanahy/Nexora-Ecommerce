import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminCategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategory() {
      try {
        setError("");

        const response = await api.get(
          `/admin/categories/${id}`
        );

        if (cancelled) {
          return;
        }

        const category =
          response.data?.category ||
          response.data?.data?.category ||
          response.data?.data ||
          null;

        if (!category) {
          setError("Category not found.");
          return;
        }

        setForm({
          name: category.name || "",
          description:
            category.description || "",
          status:
            category.status ?? true,
        });
      } catch (error) {
        console.error(
          "Failed to load category:",
          error
        );

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load category."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.put(
        `/admin/categories/${id}`,
        {
          name: form.name,
          description:
            form.description || null,
          status: form.status,
        }
      );

      navigate("/admin/categories");
    } catch (error) {
      console.error(
        "Failed to update category:",
        error
      );

      const validationErrors =
        error.response?.data?.errors;

      if (validationErrors) {
        const firstError =
          Object.values(validationErrors).flat()[0];

        setError(
          firstError ||
            "Please check the form."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to update category."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading category...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">

      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/70 px-6 py-8 backdrop-blur md:px-10">

        <div>
          <Link
            to="/admin/categories"
            className="text-sm text-zinc-500 transition hover:text-emerald-400"
          >
            ← Back to Categories
          </Link>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Edit Category
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Update category information and status.
          </p>
        </div>

      </header>

      <div className="mx-auto max-w-3xl p-6 md:p-10">

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">

            <h2 className="text-lg font-bold text-white">
              Category Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update the category details.
            </p>

            <div className="mt-6 space-y-5">

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />

              </div>

              {/* Slug information */}
              <div className="rounded-xl border border-white/5 bg-zinc-900 p-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Slug
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  The slug is generated automatically from the category name.
                </p>

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />

              </div>

              {/* Status */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 p-4">

                <input
                  type="checkbox"
                  name="status"
                  checked={
                    form.status ? true : false
                  }
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-900 text-emerald-400 focus:ring-emerald-400"
                />

                <div>

                  <p className="text-sm font-semibold text-white">
                    Category is active
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Inactive categories should not be used for new products.
                  </p>

                </div>

              </label>

            </div>

          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              to="/admin/categories"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminCategoryEditPage;
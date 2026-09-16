import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminCategoryCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

      await api.post("/admin/categories", {
        name: form.name,
        description:
          form.description || null,
        status: form.status,
      });

      navigate("/admin/categories");
    } catch (error) {
      console.error(
        "Failed to create category:",
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
            "Failed to create category."
        );
      }
    } finally {
      setSaving(false);
    }
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
            Create Category
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Add a new product category to your store.
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

          {/* Basic Information */}
          <section className="rounded-2xl border border-white/10 bg-zinc-950 p-6">

            <h2 className="text-lg font-bold text-white">
              Category Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Enter the information for your new category.
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
                  placeholder="Example: Electronics"
                  required
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400/50"
                />
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
                  placeholder="Describe this category..."
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
                    Active categories can be used by products.
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
                ? "Creating..."
                : "Create Category"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminCategoryCreatePage;
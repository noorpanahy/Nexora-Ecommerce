import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminCustomerCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await api.post("/admin/customers", form);

      navigate("/admin/customers");
    } catch (error) {
      console.error(error);

      const errors = error.response?.data?.errors;

      if (errors) {
        setError(
          Object.values(errors)
            .flat()
            .join(" ")
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create customer."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-8 py-10 text-white">
      <div className="mx-auto max-w-3xl">

        <Link
          to="/admin/customers"
          className="text-sm text-zinc-500 hover:text-white"
        >
          ← Back to Customers
        </Link>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            Customers
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Add Customer
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create a new customer account.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-white/10 bg-zinc-950 p-6"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Customer name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Repeat password"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-6">

            <Link
              to="/admin/customers"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Customer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminCustomerCreatePage;
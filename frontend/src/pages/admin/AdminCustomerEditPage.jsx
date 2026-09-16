import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminCustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCustomer() {
      try {
        const response = await api.get(
          `/admin/customers/${id}`
        );

        if (cancelled) {
          return;
        }

        const customer = response.data.customer;

        setForm({
          name: customer.name || "",
          email: customer.email || "",
          password: "",
          password_confirmation: "",
        });
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Failed to load customer."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCustomer();

    return () => {
      cancelled = true;
    };
  }, [id]);

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

      await api.put(`/admin/customers/${id}`, form);

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
            "Failed to update customer."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-10 text-white">
        <p className="text-zinc-500">
          Loading customer...
        </p>
      </div>
    );
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
            Edit Customer
          </h1>
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
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              New Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Leave empty to keep current password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirm New Password
            </label>

            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none focus:border-emerald-400"
              placeholder="Leave empty to keep current password"
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
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminCustomerEditPage;
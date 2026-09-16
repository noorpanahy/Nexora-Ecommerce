import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function fetchCustomers(searchValue = "") {
    try {
      setError("");

      const response = await api.get("/admin/customers", {
        params: searchValue.trim()
          ? {
              search: searchValue.trim(),
            }
          : {},
      });

      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Failed to load customers:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
     Promise.resolve().then(() => {
     fetchCustomers();
   });
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();

    setLoading(true);
    fetchCustomers(search);
  }

  function handleClearSearch() {
    setSearch("");
    setLoading(true);
    fetchCustomers("");
  }

  async function handleDelete(customer) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(customer.id);
      setError("");

      await api.delete(`/admin/customers/${customer.id}`);

      setCustomers((currentCustomers) =>
        currentCustomers.filter(
          (item) => item.id !== customer.id
        )
      );
    } catch (error) {
      console.error("Failed to delete customer:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete customer.";

      setError(message);

      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString();
  }

  function getInitial(name) {
    if (!name) {
      return "C";
    }

    return name.charAt(0).toUpperCase();
  }

  return (
    <div className="min-h-screen bg-zinc-900 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
              Management
            </p>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Customers
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Manage customer accounts, view their orders,
              update information, and remove unused accounts.
            </p>
          </div>

          <Link
            to="/admin/customers/create"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
          >
            <span className="mr-2 text-lg">+</span>
            Add Customer
          </Link>

        </div>


        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Customers
            </p>

            <p className="mt-2 text-2xl font-black">
              {customers.length}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Currently displayed
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Search
            </p>

            <p className="mt-2 truncate text-lg font-bold text-zinc-300">
              {search.trim() || "All customers"}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Name or email
            </p>
          </div>

        </div>


        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950 p-4">

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 md:flex-row"
          >

            <div className="relative flex-1">

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search customers by name or email..."
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400"
              />

            </div>


            <div className="flex gap-2">

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>


              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  Clear
                </button>
              )}

            </div>

          </form>

        </div>


        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">

            <div>
              <p className="text-sm font-semibold text-red-400">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-400/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Close
            </button>

          </div>
        )}


        {/* =====================================================
            CUSTOMER TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">

          {/* Loading */}
          {loading ? (
            <div className="p-12 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />

              <p className="mt-4 text-sm text-zinc-500">
                Loading customers...
              </p>

            </div>
          ) : customers.length === 0 ? (

            /* Empty */
            <div className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-2xl">
                👤
              </div>

              <h2 className="mt-5 text-lg font-bold">
                No customers found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                {search.trim()
                  ? "No customers match your search. Try another name or email."
                  : "There are no customers yet. Create your first customer account."}
              </p>

              {search.trim() ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/admin/customers/create"
                  className="mt-5 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
                >
                  Add Customer
                </Link>
              )}

            </div>
          ) : (

            /* Table */
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                      Email
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                      Orders
                    </th>

                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/5">

                  {customers.map((customer) => (

                    <tr
                      key={customer.id}
                      className="group transition hover:bg-white/[0.02]"
                    >

                      {/* Customer */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-zinc-950">
                            {getInitial(customer.name)}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-white">
                              {customer.name}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              Customer #{customer.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Email */}
                      <td className="px-6 py-5">

                        <p className="text-sm text-zinc-400">
                          {customer.email}
                        </p>

                      </td>


                      {/* Orders */}
                      <td className="px-6 py-5">

                        <span className="inline-flex min-w-[36px] items-center justify-center rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300">
                          {customer.orders_count || 0}
                        </span>

                      </td>


                      {/* Joined */}
                      <td className="px-6 py-5">

                        <p className="text-sm text-zinc-500">
                          {formatDate(customer.created_at)}
                        </p>

                      </td>


                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          {/* View */}
                          <Link
                            to={`/admin/customers/${customer.id}`}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-blue-400/30 hover:bg-blue-400/5 hover:text-blue-400"
                          >
                            View
                          </Link>


                          {/* Edit */}
                          <Link
                            to={`/admin/customers/${customer.id}/edit`}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-emerald-400/30 hover:bg-emerald-400/5 hover:text-emerald-400"
                          >
                            Edit
                          </Link>


                          {/* Delete */}
                          <button
                            type="button"
                            disabled={
                              deletingId === customer.id
                            }
                            onClick={() =>
                              handleDelete(customer)
                            }
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId === customer.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        {!loading && customers.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">

            <p>
              Showing {customers.length} customer
              {customers.length !== 1 ? "s" : ""}
            </p>

            <p>
              Customer Management
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminCustomersPage;
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const navItems = [
    {
      label: "Dashboard",
      to: "/admin",
      end: true,
    },
    {
      label: "Orders",
      to: "/admin/orders",
    },
    {
      label: "Products",
      to: "/admin/products",
    },
     {
    label: "Categories",
    to: "/admin/categories",
  },
    { label: "Customers", to: "/admin/customers" },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-white/10 bg-zinc-950">

      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
        <Link
          to="/"
          className="text-xl font-black tracking-tight text-white"
        >
          FLEX<span className="text-emerald-400">.</span>
        </Link>

        <span className="ml-auto rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
          Management
        </p>

        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-400 text-zinc-950"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Store link */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            Store
          </p>

          <Link
            to="/"
            className="block rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            View Store
          </Link>
        </div>
      </nav>

      {/* Bottom User Area */}
      <div className="shrink-0 border-t border-white/10 p-4">

        {/* User */}
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-lg font-bold text-zinc-950">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Admin"}
            </p>

            <p className="truncate text-xs text-zinc-500">
              Administrator
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          {/* Logo Mark */}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-all duration-300 group-hover:rotate-3 group-hover:bg-emerald-300">
            <span className="text-lg font-black">
              N
            </span>
          </div>

          {/* Brand */}

          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-[0.22em] text-white">
              NEXORA
            </div>

            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-600">
              Premium Store
            </div>
          </div>
        </Link>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <nav className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            Shop
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-white"
                }`
              }
            >
              My Orders
            </NavLink>
          )}

          {/* Admin */}

          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-300"
                    : "text-emerald-400 hover:text-emerald-300"
                }`
              }
            >
              Admin
            </NavLink>
          )}

          {/* Cart */}

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative text-sm font-medium transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-zinc-400 hover:text-white"
              }`
            }
          >
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-zinc-950">
                {cartCount}
              </span>
            )}
          </NavLink>

        </nav>

        {/* =====================================================
            AUTHENTICATION
        ===================================================== */}

        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <>
              {/* User */}

              <div className="hidden items-center gap-3 sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 font-bold text-zinc-950">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="max-w-32 leading-tight">
                  <p className="truncate text-sm font-medium text-white">
                    {user?.name}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    {user?.role || "CUSTOMER"}
                  </p>
                </div>

              </div>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:border-red-400/30 hover:bg-red-400/[0.05] hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}

              <Link
                to="/login"
                className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Login
              </Link>

              {/* Register */}

              <Link
                to="/register"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold !text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;
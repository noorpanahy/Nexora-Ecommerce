import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function LoginPage() {
  const { login } = useAuth();
  const { loadCart } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      await loadCart();

      navigate("/products");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        const firstError = Object.values(errors)[0]?.[0];

        setError(firstError || "Invalid login information.");
      } else {
        setError("Unable to login. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-zinc-950">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-emerald-400/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/40 backdrop-blur-xl md:grid-cols-2">

          {/* Left side */}
          <div className="hidden flex-col justify-between border-r border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 p-12 md:flex">
            <div>
              <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400 text-xl font-black text-zinc-950">
                P
              </div>

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
                Welcome back
              </p>

              <h1 className="max-w-md text-5xl font-black leading-tight tracking-tight text-white">
                Your next
                <span className="block text-emerald-400">
                  favorite thing
                </span>
                is waiting.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
                Sign in to continue shopping, manage your cart, and keep
                everything you love in one place.
              </p>
            </div>

            <div>
              <div className="mb-4 h-px w-full bg-white/10" />

              <p className="text-sm text-zinc-500">
                PANAHY<span className="text-emerald-400">.</span> Store
              </p>
            </div>
          </div>

          {/* Login form */}
          <div className="p-8 sm:p-10 md:p-12">
            <div className="mx-auto max-w-md">
              {/* Mobile logo */}
              <div className="mb-8 flex items-center gap-3 md:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-black text-zinc-950">
                  P
                </div>

                <span className="text-xl font-black text-white">
                  PANAHY<span className="text-emerald-400">.</span>
                </span>
              </div>

              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-emerald-400">
                  Account
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Sign in
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Enter your details to access your account.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-zinc-500 transition hover:text-emerald-400"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                  />
                </div>

                {/* Remember */}
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-zinc-900 accent-emerald-400"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-zinc-500"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3.5 font-semibold text-zinc-950 transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Register */}
              <div className="mt-8 text-center">
                <p className="text-sm text-zinc-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-emerald-400 transition hover:text-emerald-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              {/* Development notice */}
              <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-center text-xs leading-5 text-zinc-600">
                  Your login is securely handled through the Laravel API
                  using Sanctum authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.passwordConfirmation
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        form.name,
        form.email,
        form.password,
        form.passwordConfirmation
      );

      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);

      const responseErrors = error.response?.data?.errors;

      if (responseErrors) {
        const firstError = Object.values(responseErrors)[0]?.[0];

        setError(firstError || "Registration failed.");
      } else {
        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl md:grid-cols-2">
        {/* Left side */}
        <div className="hidden min-h-[650px] flex-col justify-between bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950 p-10 md:flex">
          <div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Join Panahy
            </span>

            <h1 className="mt-8 max-w-md text-5xl font-black leading-tight">
              Create your account.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
              Create an account to manage your cart, place orders, and
              track your purchases.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">01</p>
              <p className="mt-2 text-sm text-zinc-400">
                Create account
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">02</p>
              <p className="mt-2 text-sm text-zinc-400">
                Start shopping
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center p-8 sm:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Register
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Enter your details to get started.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

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
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="passwordConfirmation"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Confirm password
                </label>

                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={form.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-400 px-5 py-3.5 font-bold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
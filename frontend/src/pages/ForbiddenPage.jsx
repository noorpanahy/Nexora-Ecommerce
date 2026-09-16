import { Link } from "react-router-dom";

function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-lg text-center">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-emerald-400">
          Access denied
        </p>

        <h1 className="text-7xl font-black tracking-tight">
          403
        </h1>

        <h2 className="mt-4 text-2xl font-bold">
          You don't have permission
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
          Your account does not have administrator
          permissions to access this section.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Back to store
          </Link>

          <Link
            to="/login"
            className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-emerald-300"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForbiddenPage;
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function AdminRoute() {
  const {
    loading,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const location = useLocation();

  // Wait until authentication check is complete
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-400" />

          <p className="text-sm text-zinc-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // User is not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // User is logged in but is not an admin
  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  // Admin
  return <Outlet />;
}

export default AdminRoute;
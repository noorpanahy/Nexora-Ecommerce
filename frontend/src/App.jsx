import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AdminRoute from "./routes/AdminRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ForbiddenPage from "./pages/ForbiddenPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductCreatePage from "./pages/admin/AdminProductCreatePage";
import AdminProductEditPage from "./pages/admin/AdminProductEditPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminCategoryCreatePage from "./pages/admin/AdminCategoryCreatePage";
import AdminCategoryEditPage from "./pages/admin/AdminCategoryEditPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminCustomerCreatePage from "./pages/admin/AdminCustomerCreatePage";
import AdminCustomerEditPage from "./pages/admin/AdminCustomerEditPage";
import AdminCustomerDetailsPage from "./pages/admin/AdminCustomerDetailsPage";

// Public/customer-facing routes
const storeRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/products/:id", element: <ProductDetailsPage /> },
  { path: "/403", element: <ForbiddenPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/orders", element: <OrdersPage /> },
  { path: "/orders/:id", element: <OrderDetailsPage /> },
];

// Admin routes (relative to /admin)
const adminRoutes = [
  { index: true, element: <AdminDashboardPage /> },
  { path: "orders", element: <AdminOrdersPage /> },
  { path: "products", element: <AdminProductsPage /> },
  { path: "products/create", element: <AdminProductCreatePage /> },
  { path: "products/:id/edit", element: <AdminProductEditPage /> },
  { path: "categories", element: <AdminCategoriesPage /> },
  { path: "categories/create", element: <AdminCategoryCreatePage /> },
  { path: "categories/:id/edit", element: <AdminCategoryEditPage /> },
  { path: "customers", element: <AdminCustomersPage /> },
  { path: "customers/create", element: <AdminCustomerCreatePage /> },
  { path: "customers/:id", element: <AdminCustomerDetailsPage /> },
  { path: "customers/:id/edit", element: <AdminCustomerEditPage /> },
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Store */}
            <Route element={<MainLayout />}>
              {storeRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>

            {/* Admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                {adminRoutes.map(({ path, index, element }) =>
                  index ? (
                    <Route key="index" index element={element} />
                  ) : (
                    <Route key={path} path={path} element={element} />
                  )
                )}
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
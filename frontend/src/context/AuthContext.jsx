import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export default AuthContext;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  useEffect(() => {
    Promise.resolve().then(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      async function checkAuthentication() {
        try {
          const response = await api.get("/user");

          setUser(response.data.user);
        } catch (error) {
          console.error(
            "Authentication check failed:",
            error
          );

          localStorage.removeItem("token");
          setUser(null);
        } finally {
          setLoading(false);
        }
      }

      checkAuthentication();
    });
  }, []);

  async function login(email, password) {
    const response = await api.post("/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  }

  async function register(
    name,
    email,
    password,
    passwordConfirmation
  ) {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    setUser(user);

    return response.data;
  }

  async function logout() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }

  const value = {
    user,
    loading,

    isAuthenticated: Boolean(user),

    isAdmin: user?.role === "ADMIN",

    isCustomer: user?.role === "CUSTOMER",

    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
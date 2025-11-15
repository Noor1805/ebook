import React, { createContext, useContext, useEffect, useState } from "react";

// Create a new Context
const AuthContext = createContext();

// Custom hook to use Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store logged-in user info
  const [loading, setLoading] = useState(true); // track auth checking status
  const [isAuthenticated, setIsAuthenticated] = useState(false); // login state

  // Run when the component mounts — check if user already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if the user is already logged in
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr);

        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = ({ userData, token }) => {
    // Save data in localStorage so user stays logged in even after refresh
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Update React state
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/'
  };

  const updateUser = (updateUserData) => {
    const newUserData = {...user, ...updateUserData};
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  // Values that will be shared across the entire app
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

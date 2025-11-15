import { useState } from "react";
import { Lock, Mail, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);

      const { token } = response.data;

      // GET PROFILE
      const profileResponse = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      login(profileResponse.data, token);
      navigate("/dashboard");

      toast.success("Login successful!");
    } catch (error) {
      localStorage.clear();
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-300 via-purple-200 to-white p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-400/50">
            <BookOpen className="text-white w-7 h-7" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* BEAUTIFIED SIGN IN BUTTON */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full text-lg py-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-gray-600 mt-6 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-violet-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

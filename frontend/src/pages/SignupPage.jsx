import { useState } from "react";
import { Mail, Lock, User, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-300 via-violet-200 to-white p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-400/50">
            <BookOpen className="text-white w-7 h-7" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Your Name"
            name="name"
            type="text"
            icon={User}
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full text-lg py-3 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02]"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-gray-600 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

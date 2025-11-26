import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { User, Mail } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
      });

      updateUser(response.data.user);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Could not update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-40 text-purple-600">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* PAGE WRAPPER */}
      <div className="max-w-3xl mx-auto py-10 px-4">

        {/* TOP HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-700">
            Your Profile
          </h1>
          <p className="text-purple-500 mt-2">
            Manage your account details.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="
          bg-white/90 backdrop-blur-lg
          rounded-3xl shadow-xl border border-purple-100
          p-8 space-y-8
        ">
          
          {/* USER AVATAR */}
          <div className="flex items-center gap-5">
            <div
              className="
                w-20 h-20 rounded-full bg-linear-to-br 
                from-purple-400 to-purple-600 
                flex items-center justify-center text-white text-3xl font-bold shadow-md
              "
            >
              {formData.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-purple-700">{formData.name}</h2>
              <p className="text-purple-500 text-sm">{formData.email}</p>
            </div>
          </div>

          <hr className="border-purple-100" />

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              placeholder="Enter your full name"
            />

            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              disabled
              icon={Mail}
            />

            <Button
              type="submit"
              className="w-full font-medium bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition shadow-md"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Save Changes
            </Button>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

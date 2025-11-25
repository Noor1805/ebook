import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, LogOut, Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropDown.jsx";
export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <header>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-linear-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>

            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              AI eBook Creator
            </span>
          </a>

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 font-medium text-gray-600 hover:text-violet-600 rounded-lg hover:bg-violet-50/50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Auth Buttons & Profile */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name || ""}
                email={user?.email || ""}
                userRole={user?.role || ""}
                onLogout={() => console.log("Logout")}
              />
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-5 py-2 rounded-md bg-linear-to-r from-violet-400 to-purple-500 text-white text-sm font-medium hover:from-violet-700 hover:to-purple-400 shadow-lg shadow-violet-500 hover:shadow-violet-500/30 transition-all hover:scale-105"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white shadow-md border border-gray-100 p-4 animate-in slide-in-from-top duration-200 space-y-4">
          <nav className="px-4 py-4 flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-1.5 text-sm hover:bg-violet-50 font-medium text-gray-700 hover:text-violet-600  transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="flex space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-8 h-8 bg-linear-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={() => logout()}
                  className="w-full px-4 py-2.5 text-sm text-red-700 font-medium flex items-center space-x-2 hover:bg-red-50 rounded-md transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <a
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="w-full text-center px-4 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-violet-400 hover:from-violet-600 hover:to-purple-700 transition-all duration-200"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

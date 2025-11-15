import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, Sparkle, BookOpen, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero.png";


export default function Hero() {
  const { isAuthenticated } = useAuth();
 

  return (
    <div className="relative bg-linear-to-br from-violet-50 via-white to-purple-50 overflow-hidden">

        <div className="absolute top-10 left-10 w-64 h-64 bg-violet-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-30 right-20 w-3xl h-96 bg-violet-300 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-11 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ✅ Missing wrapper div added here */}
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Sparkle className="w-5 h-5 text-violet-600" />
              <span className="text-gray-700 font-medium">
                AI Powered Publishing
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Create Stunning{" "}
              <span className="text-violet-600">Ebooks in Minutes</span>
            </h1>

            <p className="text-gray-600">
              From idea to published ebook, our AI-powered platform helps you
              write, design, and export professional-quality books effortlessly.
            </p>

            <div className="flex items-center space-x-4">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center space-x-2 bg-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-700 transition-all"
              >
                <span>Start Creating for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center space-x-2 text-violet-600 font-medium hover:underline"
              >
                <span>Watch Demo</span>
              </a>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-500">Books Created</div>
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>

              <div className="w-px h-8 bg-gray-300"></div>

              <div>
                <div className="text-2xl font-bold text-gray-900">10min</div>
                <div className="text-sm text-gray-500">Avg. Creation</div>
              </div>
            </div>
          </div>
          {/* ✅ first column ends */}

          {/* second column (image + floating cards) */}
          <div className="relative">
            <div className="relative">
              <img
                src={HERO_IMG}
                alt="AI Ebook Creator Dashboard"
                className="w-full rounded-xl shadow-lg"
              />

              <div className="absolute top-6 left-6 bg-white/90 rounded-lg shadow-md p-3 flex items-center space-x-3">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Processing
                  </div>
                  <div className="text-xs text-gray-500">AI Generation</div>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-white/90 rounded-lg shadow-md p-3 flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-violet-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Completed
                  </div>
                  <div className="text-xs text-gray-500">247 Pages</div>
                </div>
              </div>
            </div>
          </div>
          {/* ✅ second column ends */}
        </div>
      </div>
    </div>
  );
}


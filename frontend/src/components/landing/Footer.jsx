import React from "react";
import { Facebook, Instagram, Github, Linkedin } from "lucide-react";
import { BookOpen } from "lucide-react";


export default function Footer() {
  return (
    <footer className="relative bg-linear-to-bl from-white to-violet-300 border-t border-gray-200 pt-14 pb-8 overflow-hidden">

      {/* Soft Glow */}
      <div className="absolute -top-20 right-10 w-48 h-48 bg-violet-300 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2"><div className="w-10 h-10 rounded-2xl bg-violet-700 flex items-center justify-center">
  <BookOpen className="w-5 h-5 text-white" />
</div>

  <h3 className="text-xl font-semibold text-gray-900">
    eBook Creator
  </h3>
</div>

<p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-xs">
  AI-powered platform to write, design, and publish your ebooks effortlessly.
</p>


            {/* Social Icons */}
            <div className="flex space-x-3 mt-5">
              <a className="p-2 bg-white rounded-full border hover:bg-violet-100 transition">
                <Facebook className="w-4 h-4 text-violet-600" />
              </a>
              <a className="p-2 bg-white rounded-full border hover:bg-violet-100 transition">
                <Instagram className="w-4 h-4 text-violet-600" />
              </a>
              <a className="p-2 bg-white rounded-full border hover:bg-violet-100 transition">
                <Github className="w-4 h-4 text-violet-600" />
              </a>
              <a className="p-2 bg-white rounded-full border hover:bg-violet-100 transition">
                <Linkedin className="w-4 h-4 text-violet-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-violet-600 text-sm">Features</a></li>
              <li><a href="#testomonial" className="text-gray-600 hover:text-violet-600 text-sm">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-violet-600 text-sm">Pricing</a></li>
              <li><a href="/dashboard" className="text-gray-600 hover:text-violet-600 text-sm">Dashboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Support</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm hover:text-violet-600 cursor-pointer">Help Center</li>
              <li className="text-gray-600 text-sm hover:text-violet-600 cursor-pointer">Terms & Conditions</li>
              <li className="text-gray-600 text-sm hover:text-violet-600 cursor-pointer">Privacy Policy</li>
              <li className="text-gray-600 text-sm hover:text-violet-600 cursor-pointer">
                support@ebook.ai
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom small line */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AI eBook Creator — All rights reserved.
        </div>
      </div>
    </footer>
  );
}


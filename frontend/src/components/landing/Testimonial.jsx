import React from "react";
import { TESTIMONIALS } from "../../utils/data";
import { Quote, Star } from "lucide-react";

export default function ProfilePage() {
  return (
    <div
      id="testomonial"
      className="relative py-24 lg:py-32 bg-linear-to-br from-violet-200 to-white overflow-hidden"
    >
      {/* Decorative Circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-300 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-40"></div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-20 space-y-4">

          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-violet-200 shadow-md">
            <Star className="w-4 h-4  text-violet-600" fill="#7c3aed" />
            <span className="text-sm font-semibold text-violet-700">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Loved By Creators
            <span className="block text-violet-600">Everywhere</span>
          </h2>

          <p className="max-w-2xl mx-auto text-gray-600 text-base">
            Don't just take our word for it. Here's what our users have to say about their experience.
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {TESTIMONIALS.map((t, index) => (
          <div
            key={index}
            className="relative bg-white/80 backdrop-blur-xl border border-gray-200 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Floating Quote Icon */}
            <div className="absolute -top-4 -left-4 bg-violet-600 text-white p-3 rounded-2xl shadow-lg">
              <Quote className="w-5 h-5" />
            </div>

            {/* Rating */}
            <div className="flex space-x-1 mb-4 mt-2">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-violet-500" fill="#7c3aed" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 italic leading-relaxed mb-6">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 shadow">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">{t.author}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto mt-20 px-6 lg:px-8 flex justify-between text-center relative z-10">
        <div>
          <div className="text-3xl font-bold text-gray-900">50K+</div>
          <div className="text-gray-700 font-semibold text-sm">Books Created</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-gray-900">4.9/5</div>
          <div className="text-gray-700 font-semibold text-sm">User Rating</div>
        </div>

        <div>
          <div className="text-3xl font-bold text-gray-900">100K+</div>
          <div className="text-gray-700 font-semibold text-sm">Ebook Creator</div>
        </div>
      </div>
    </div>
  );
}


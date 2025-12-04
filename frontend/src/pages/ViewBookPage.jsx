import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import { ArrowLeft, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

export default function ViewBookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.7);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );
        setBook(response.data.book);
      } catch (error) {
        toast.error("Unable to load book.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  if (isLoading || !book) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-50">
        <p className="text-purple-600 text-lg">Loading book...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* HEADER */}
      <header className="sticky top-0 bg-white shadow-sm border-b border-purple-100 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-semibold text-purple-700">
              {book.title}
            </h1>
          </div>

          <div></div>
        </div>
      </header>

      {/* COVER SECTION */}
      <div className="max-w-4xl mx-auto p-6">
        {book.coverImage && (
          <div className="flex justify-center mb-8">
            <img
              src={`${BASE_URL}${book.coverImage}`}
              alt="Cover"
              className="w-60 h-80 object-cover rounded-lg shadow-md border border-purple-200"
            />
          </div>
        )}

        {/* TITLE + SUBTITLE + AUTHOR */}
        <h1 className="text-4xl font-bold text-purple-800 text-center mb-2">
          {book.title}
        </h1>

        {book.subtitle && (
          <p className="text-lg text-purple-500 text-center italic -mt-1 mb-2">
            {book.subtitle}
          </p>
        )}

        <p className="text-center text-purple-700 font-medium mb-10">
          By {book.author}
        </p>

        {/* READING CONTROLS */}
        <div className="bg-white border border-purple-200 p-4 rounded-xl shadow-sm flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-purple-700 font-medium">Font Size:</span>
            <button
              onClick={() => setFontSize((f) => Math.max(14, f - 1))}
              className="px-3 py-1 bg-purple-100 rounded-md text-purple-700"
            >
              -
            </button>
            <span className="px-2">{fontSize}px</span>
            <button
              onClick={() => setFontSize((f) => Math.min(28, f + 1))}
              className="px-3 py-1 bg-purple-100 rounded-md text-purple-700"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-purple-700 font-medium">Line Height:</span>
            <button
              onClick={() => setLineHeight((l) => Math.max(1.3, l - 0.1))}
              className="px-3 py-1 bg-purple-100 rounded-md text-purple-700"
            >
              -
            </button>
            <span className="px-2">{lineHeight.toFixed(1)}</span>
            <button
              onClick={() => setLineHeight((l) => Math.min(2, l + 0.1))}
              className="px-3 py-1 bg-purple-100 rounded-md text-purple-700"
            >
              +
            </button>
          </div>
        </div>

        {/* CHAPTER CONTENT */}
        <div className="bg-white shadow-sm border border-purple-100 p-8 rounded-2xl">
          {book.chapters.map((chapter, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="text-3xl font-semibold text-purple-800 mb-4">
                {chapter.title}
              </h2>

              <div
                className="text-gray-800"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  fontFamily: 'Charter, Georgia, "Times New Roman", serif',
                }}
              >
                {chapter.content
                  .split("\n")
                  .map((p, idx) =>
                    p.trim() === "" ? (
                      <div key={idx} className="h-4"></div>
                    ) : (
                      <p key={idx} className="mb-4">
                        {p}
                      </p>
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


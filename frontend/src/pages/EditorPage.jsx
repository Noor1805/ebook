import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ChapterEditorTab from "../components/editor/ChapterEditorTab";
import ChapterSidebar from "../components/editor/ChapterSidebar";
import BookDetailsTab from "../components/editor/BookDetailsTab";
import {
  Sparkles,
  FileDown,
  Save,
  Menu,
  X,
  Edit,
  NotebookText,
  ChevronDown,
  FileText,
} from "lucide-react";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

import Dropdown, { DropdownItem } from "../components/ui/Dropdown";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );

        if (!response.data.book) {
          toast.error("Invalid book response.");
          navigate("/dashboard");
          return;
        }

        setBook(response.data.book);
      } catch (error) {
        toast.error("Failed to fetch book data.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  // ===============================
// Missing Handler Functions FIXED
// ===============================

// Chapter text change
const handleChapterChange = (updatedText) => {
  setBook((prev) => {
    const newChapters = [...prev.chapters];
    newChapters[selectedChapterIndex].content = updatedText;
    return { ...prev, chapters: newChapters };
  });
};

// Generate chapter content
const handleGenerateChapterContent = async (index) => {
  try {
    setIsGenerating(index);
    // 👇 Yahan aapka backend AI API call jayega later
    toast.success("Generating chapter…");
  } catch (err) {
    toast.error("Failed to generate content");
  } finally {
    setIsGenerating(false);
  }
};

// Book metadata change (title, description etc)
const handleBookChange = (e) => {
  const { name, value } = e.target;
  setBook((prev) => ({ ...prev, [name]: value }));
};

// Cover image upload
const handleCoverImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Backend upload API (later)
    toast.success("Cover image uploaded");
  } catch (err) {
    toast.error("Failed to upload cover");
  }
};

// Save changes (mock)
const handleSaveChanges = async () => {
  try {
    setIsSaving(true);
    toast.success("Saved successfully!");
  } finally {
    setIsSaving(false);
  }
};

// Required state for generator
const [isGenerating, setIsGenerating] = useState(false);


  if (isLoading || !book) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-50">
        <p className="text-purple-600 text-lg">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex bg-purple-50 min-h-screen">

      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-purple-300/30 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="relative flex-1 max-w-xs rounded-r-xl bg-white shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="h-10 w-10 flex items-center justify-center bg-purple-300 rounded-full shadow-sm"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-purple-700" />
              </button>
            </div>

            <ChapterSidebar
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onSelectChapter={(i) => {
                setSelectedChapterIndex(i);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex md:shrink-0 sticky top-0 h-screen border-r border-purple-100 bg-white shadow-sm">
        <ChapterSidebar
          book={book}
          selectedChapterIndex={selectedChapterIndex}
          onSelectChapter={(i) => setSelectedChapterIndex(i)}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-purple-100 p-3 shadow-sm">

          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* Mobile Hamburger */}
              <button
                className="md:hidden p-2 text-purple-500 hover:text-purple-700"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Tabs */}
              <div className="hidden sm:flex bg-purple-100 rounded-lg p-1 space-x-1">
                <button
                  className={`px-4 py-2 rounded-md text-sm transition 
                  ${
                    activeTab === "editor"
                      ? "bg-white shadow text-purple-700"
                      : "text-purple-600 hover:bg-purple-200"
                  }`}
                  onClick={() => setActiveTab("editor")}
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Editor
                </button>

                <button
                  className={`px-4 py-2 rounded-md text-sm transition 
                  ${
                    activeTab === "metadata"
                      ? "bg-white shadow text-purple-700"
                      : "text-purple-600 hover:bg-purple-200"
                  }`}
                  onClick={() => setActiveTab("metadata")}
                >
                  <NotebookText className="w-4 h-4 inline mr-2" />
                  Book Details
                </button>
              </div>
            </div>

            {/* RIGHT ACTION BUTTONS */}
            <div className="flex items-center gap-3">

              {/* EXPORT MENU */}
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 bg-purple-200 px-4 py-2 text-purple-700 rounded-lg hover:bg-purple-300 transition">
                    <FileDown className="w-4 h-4" />
                    <span>Export</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                }
              >
                <DropdownItem>
                  <FileDown className="w-4 h-4 mr-2 text-purple-600" />
                  Export as PDF
                </DropdownItem>

                <DropdownItem>
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  Export as Doc
                </DropdownItem>
              </Dropdown>

              {/* SAVE BUTTON */}
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </header>
        
        <div className="w-full">
          {activeTab === "editor" ? (
            <ChapterEditorTab
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onChapterChange={handleChapterChange}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
            />
          ) : (
            <BookDetailsTab book={book} onBookChange={handleBookChange} onCoverUpload={handleCoverImageUpload} isUploading={isUploading} fileInputRef={fileInputRef} />
          )}
        </div>
        
      </main>
    </div>
  );
};

export default EditorPage;


// src/pages/EditorPage.jsx  (replace your existing EditorPage file with this)
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
  const [aiStyle, setAiStyle] = useState("default");

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );

        if (!response?.data?.book) {
          toast.error("Invalid book response.");
          navigate("/dashboard");
          return;
        }

        // Ensure chapters array exists and has titles
        const fetched = { ...response.data.book };
        if (!Array.isArray(fetched.chapters)) fetched.chapters = [{ title: "Chapter 1", content: "" }];
        fetched.chapters = normalizeChapterTitles(fetched.chapters);

        setBook(fetched);
        setSelectedChapterIndex(0);
      } catch (error) {
        toast.error("Failed to fetch book data.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  // -------------------------
  // Helper: normalize titles
  // - only renumber if title is exactly "Chapter <n>" (auto-generated)
  // - preserve custom titles
  // -------------------------
  const normalizeChapterTitles = (chapters = []) => {
    return chapters.map((ch, i) => {
      // protect against non-object entries
      const item = typeof ch === "object" && ch !== null ? { ...ch } : { title: String(ch || ""), content: "" };

      const raw = (item.title ?? "").toString().trim();
      // treat empty as auto-generated too
      if (!raw) {
        return { ...item, title: `Chapter ${i + 1}` };
      }
      // EXACT match "Chapter <number>" (case-insensitive) -> renumber to index
      const m = raw.match(/^chapter\s*(\d+)$/i);
      if (m) {
        return { ...item, title: `Chapter ${i + 1}` };
      }
      // custom title -> keep as-is
      return item;
    });
  };

  // -------------------------
  // Chapter change (title/content)
  // Accepts: event-like object { target: { name, value } }
  // -------------------------
  const handleChapterChange = (payload) => {
    let name, value;
    if (payload && payload.target && "name" in payload.target) {
      ({ name, value } = payload.target);
    } else if (payload && typeof payload === "object" && "name" in payload && "value" in payload) {
      ({ name, value } = payload);
    } else {
      console.warn("handleChapterChange: unexpected payload", payload);
      return;
    }

    setBook((prev) => {
      if (!prev || !Array.isArray(prev.chapters)) return prev;
      const chapters = prev.chapters.map((c, idx) => ({ ...c })); // shallow clone
      const idx = selectedChapterIndex;
      const chapter = { ...(chapters[idx] || {}) };
      chapter[name] = value;
      chapters[idx] = chapter;
      // Only normalize titles (renumber auto-titles) — this won't wipe custom titles
      const normalized = normalizeChapterTitles(chapters);
      return { ...prev, chapters: normalized };
    });
  };

  // -------------------------
  // Add chapter
  // -------------------------
  const handleAddChapter = () => {
    setBook((prev) => {
      const prevChapters = Array.isArray(prev?.chapters) ? [...prev.chapters] : [];
      const newChapter = { title: `Chapter ${prevChapters.length + 1}`, content: "" };
      const updated = [...prevChapters, newChapter];
      const normalized = normalizeChapterTitles(updated);
      // set selection to newly created
      setSelectedChapterIndex(normalized.length - 1);
      return { ...prev, chapters: normalized };
    });
  };

  // -------------------------
  // Delete chapter
  // -------------------------
  const handleDeleteChapter = (index) => {
    if (!book || !Array.isArray(book.chapters)) return;
    if (book.chapters.length === 1) {
      toast.error("A book must have at least one chapter.");
      return;
    }

    setBook((prev) => {
      const prevChapters = [...prev.chapters];
      prevChapters.splice(index, 1);
      const normalized = normalizeChapterTitles(prevChapters);

      // adjust selection in a safe (functional) way
      setSelectedChapterIndex((prevSelected) => {
        if (prevSelected === index) {
          return Math.min(index, normalized.length - 1);
        }
        if (prevSelected > index) {
          return prevSelected - 1;
        }
        return prevSelected;
      });

      return { ...prev, chapters: normalized };
    });
  };

  // -------------------------
  // Reorder chapters (if/when you add drag)
  // -------------------------
  const handleReorderChapters = (oldIndex, newIndex) => {
    if (!book || !Array.isArray(book.chapters)) return;
    const chapters = [...book.chapters];
    const [moved] = chapters.splice(oldIndex, 1);
    chapters.splice(newIndex, 0, moved);
    const normalized = normalizeChapterTitles(chapters);
    setBook((prev) => ({ ...prev, chapters: normalized }));
    setSelectedChapterIndex(newIndex);
  };

  const handleGenerateChapterContent = async (index) => {
  const chapter = book.chapters[index];
  if (!chapter || !chapter.title) {
    toast.error("Chapter title is required.");
    return;
  }

  setIsGenerating(index);

  try {
    const response = await axiosInstance.post(
      API_PATHS.AI.GENERATE_CHAPTER_CONTENT,
      {
        chapterTitle: chapter.title,
        chapterDescription: chapter.description || "",
        style: aiStyle || "default",
      }
    );

    const updatedChapters = [...book.chapters];
    updatedChapters[index].content = response.data.content;

    const updatedBook = { ...book, chapters: updatedChapters };
    setBook(updatedBook);

    toast.success(`Content for "${chapter.title}" generated!`);

    await handleSaveChanges(); // correct usage
  } catch (error) {
    console.error("Generate chapter error:", error);
    toast.error("Failed to generate chapter content.");
  } finally {
    setIsGenerating(false);
  }
};


  // -------------------------
  // Cover upload (mock preview)
  // -------------------------
  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("coverImage", file);
    setIsUploading(true);
    
    try {
      const response = await axiosInstance.put(
        `${API_PATHS.BOOKS.UPLOAD_COVER}/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBook(response.data);
      toast.success("Cover image uploaded successfully");

    } catch (error) {
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------
  // Book metadata change
  // -------------------------
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // Save (mock)
  // -------------------------
  const handleSaveChanges = async () => {
  setIsSaving(true);
  try {
    const bookToSave = {
      title: book.title,
      description: book.description,
      coverImage: book.coverImage,
      chapters: book.chapters,
    };

    await axiosInstance.put(
      `${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`,
      bookToSave
    );

    toast.success("Changes saved successfully");
  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save changes");
  } finally {
    setIsSaving(false);
  }
};


  const handleExportPDF = async () => {
  toast.loading("Generating PDF...");
  try {
    const response = await axiosInstance.get(
      `${API_PATHS.EXPORT.PDF}/${bookId}/pdf`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${book.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.dismiss();
    toast.success("PDF export started!");
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to export PDF.");
  }
};

const handleExportDOC = async () => {
  toast.loading("Generating Document...");
  try {
    const response = await axiosInstance.get(
      `${API_PATHS.EXPORT.DOC}/${bookId}/docx`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${book.title}.docx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.dismiss();
    toast.success("Document export started!");
  } catch (error) {
    toast.dismiss();
    toast.error("Failed to export document.");
  }
};



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
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
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
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onGenerateChapterContent={handleGenerateChapterContent}
          isGenerating={isGenerating}
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
                  className={`px-4 py-2 rounded-md text-sm transition ${
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
                  className={`px-4 py-2 rounded-md text-sm transition ${
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
              <button
                onClick={handleSaveChanges}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
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
            <BookDetailsTab
              book={book}
              onBookChange={handleBookChange}
              onCoverUpload={handleCoverImageUpload}
              isUploading={isUploading}
              fileInputRef={fileInputRef}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EditorPage;


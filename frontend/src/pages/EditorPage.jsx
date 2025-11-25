import { useEffect, useState, useRef, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ChapterSidebar from "../components/editor/ChapterSidebar";  


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

import { arrayMove } from "@dnd-kit/sortable";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import InputField from "../components/ui/InputField";
import SelectField from "../components/ui/SelectField";


  const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ========================
  //   AI Modal State
  // ========================
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [isGenerating, setIsGenerating] = useState(false);

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

      // ⭐ IMPORTANT FIX
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



  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleChapterChange = () => {

  };

  const handleAddChapter = () => {

  };

  const handleDeleteChapter = (index) => {

  };

  const handleReorderChapters = (oldIndex, newIndex) => {

  };

  const handleSaveChanges = async(bookToSave = book, showToast = true) => {

  };

  const handleCoverImageUpload = async(e) => {

  };

  const handleGenerateOutline = async() => {

  };

  const handleGenerateChapterContent = async(index) => {

  };

  const handleExportBook = async() => {

  };

  const handleExportPDF = async() => {

  };

  const handleExportDoc = async() => {

  };

  if (isLoading || !book) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}



  return (
  <>
    <div className="flex bg-slate-500 font-sans relative min-h-screen">

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 bg-opacity-75"
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                type="button"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sr-only">Close Sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Correct Component */}
            <ChapterSidebar
              book={book}
              selectedChapterIndex={selectedChapterIndex}
              onSelectChapter={(index) => {
                setSelectedChapterIndex(index);
                setIsSidebarOpen(false);
              }}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onGenerateChapterContent={handleGenerateChapterContent}
              isGenerating={isGenerating}
              onReorderChapters={handleReorderChapters}
            />
          </div>

          {/* Spacer */}
          <div aria-hidden="true" className="flex shrink-0 w-14"></div>
        </div>
      )}

      {/* MAIN EDITOR HERE */}
      <div className="flex-1 p-5 text-white">
        <h1 className="text-xl font-bold">Editor Page</h1>
      </div>

    </div>
  </>
);

  }
  


export default EditorPage
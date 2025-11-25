import { useRef, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  BookOpen,
  Hash,
  Lightbulb,
  Palette,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [bookTitle, setBookTitle] = useState("");
  const [numChapters, setNumChapters] = useState(5);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("Informative");
  const [chapters, setChapters] = useState([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isFinalizingBook, setIsFinalizingBook] = useState(false);
  const chaptersContainerRef = useRef(null);

  const resetModal = () => {
    setStep(1);
    setBookTitle("");
    setNumChapters(5);
    setAiTopic("");
    setAiStyle("Informative");
    setChapters([]);
    setIsGeneratingOutline(false);
    setIsFinalizingBook(false);
  };

  const handleGenerateOutline = async () => {
    if (!bookTitle || !numChapters) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsGeneratingOutline(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: bookTitle, // title → topic
        description: aiTopic, // same
        style: aiStyle,
        numChapters: numChapters,
      });

      setChapters(response.data.outline);
      setStep(2);
      toast.success("Outline generated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate outline."
      );
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...chapters];
    updatedChapters[index][field] = value;
    setChapters(updatedChapters);
  };

  const handleDeleteChapter = (index) => {
    const updated = [...chapters];
    updated.splice(index, 1);
    setChapters(updated);
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      { title: `Chapter ${chapters.length + 1}`, description: "" },
    ]);
  };

  const handleFinalizeBook = async () => {
    if (!bookTitle || chapters.length === 0) {
      toast.error("Please complete all steps before finalizing.");
      return;
    }

    setIsFinalizingBook(true);

    try {
      const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
        title: bookTitle,
        author: user.name || "Unknown Author",
        UserId: user._id, // ⭐ REQUIRED FIX
        chapters: chapters,
      });

      toast.success("eBook created successfully!");
      onBookCreated(response.data._id);
      resetModal();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to finalize book.");
    } finally {
      setIsFinalizingBook(false);
    }
  };

  useEffect(() => {
    if (step === 2 && chaptersContainerRef.current) {
      const scrollableDev = chaptersContainerRef.current;
      scrollableDev.scrollTo({
        top: scrollableDev.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chapters.length, step]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetModal();
        onClose();
      }}
      title="Create New eBook"
    >
      {step === 1 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 font-semibold text-sm">
              1
            </div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-gray-400 font-semibold text-sm">
              2
            </div>
          </div>

          <InputField
            label="eBook Title"
            icon={BookOpen}
            placeholder="Enter the title of your eBook"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />

          <InputField
            icon={Hash}
            label="Number of Chapters"
            type="number"
            placeholder="Enter number of chapters"
            value={numChapters}
            onChange={(e) => setNumChapters(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
          />

          <InputField
            icon={Lightbulb}
            label="Topic (optional)"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            placeholder="Enter the topic for your eBook"
          />

          <SelectField
            icon={Palette}
            label="Writting Style"
            value={aiStyle}
            onChange={(e) => setAiStyle(e.target.value)}
            options={[
              "Informative",
              "Conversational",
              "Humorous",
              "Storytelling",
              "Inspirational",
              "Technical",
            ]}
            placeholder="Enter the topic for your eBook"
          />

          <div className="flex justify-end pt-4">
            <Button
              className="bg-violet-600 p-2 rounded-lg text-white"
              onClick={handleGenerateOutline}
              isLoading={isGeneratingOutline}
              icon={Sparkles}
            >
              Generate Outline with AI
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {/* Step Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">
              1
            </div>
            <div className="flex-1 h-0.5 bg-violet-600"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">
              2
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Chapters
            </h3>
            <span className="text-sm text-gray-500">
              {chapters.length} chapters
            </span>
          </div>

          {/* Chapters List */}
          <div
            ref={chaptersContainerRef}
            className="space-y-4 max-h-96 overflow-y-auto pr-1"
          >
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <BookOpen className="w-10 h-10 text-gray-500 mb-3" />
                <p className="text-gray-600 text-sm">
                  No chapters yet. Add one to get started.
                </p>
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Chapter Number */}
                  <div className="text-center text-xs text-gray-400 mb-2">
                    Chapter {index + 1}
                  </div>

                  {/* Title Centered */}
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) =>
                      handleChapterChange(index, "title", e.target.value)
                    }
                    className="w-full text-center text-xl font-semibold text-gray-900 border-none outline-none bg-transparent"
                    placeholder="Chapter Title"
                  />

                  {/* Description */}
                  <textarea
                    value={chapter.description}
                    onChange={(e) =>
                      handleChapterChange(index, "description", e.target.value)
                    }
                    placeholder="Write the chapter story here..."
                    className="w-full mt-4 border border-gray-300 rounded-lg px-3 py-2 text-sm 
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition resize-none"
                    rows={5}
                  />

                  {/* Delete Button */}
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center gap-3 justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>
              Back
            </Button>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleAddChapter}
                icon={Plus}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-700 hover:text-white"
              >
                Add Chapter
              </Button>

              <Button
                className="p-2 rounded-lg bg-violet-500 text-white"
                onClick={handleFinalizeBook}
                isLoading={isFinalizingBook}
              >
                Create eBook
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateBookModal;

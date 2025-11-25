import { useNavigate } from "react-router-dom";

import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from "lucide-react";
import Button from "../ui/Button";

// ------------------------------
// SIDEBAR MAIN COMPONENT
// ------------------------------
export default function ChapterSidebar({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
  onReorderChapters,
}) {
  const navigate = useNavigate();

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>

        <h2 className="text-base font-semibold text-slate-800 mt-4 truncate">
          {book.title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {book.chapters.map((chapter, index) => (
            <div
              key={chapter._id || `new-${index}`}
              className="group flex items-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
              onClick={() => onSelectChapter(index)}
            >
              <button
                className={`flex-1 flex items-center p-3 text-sm rounded-l-lg text-left transition-colors
                ${selectedChapterIndex === index ? "bg-slate-200 font-medium" : "hover:bg-slate-100"}
              `}
              >
                <GripVertical className="w-4 h-4 mr-2 text-slate-400" />
                <span className="truncate">{chapter.title}</span>
              </button>

              <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 pr-2">
                <Button
                  variant="ghost"
                  size="small"
                  className="py-2 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateChapterContent(index);
                  }}
                  isLoading={isGenerating === index}
                >
                  {isGenerating !== index && (
                    <Sparkles className="w-4 h-4 text-violet-800" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  className="py-2 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChapter(index);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <Button variant="secondary" onClick={onAddChapter} className="w-full" icon={Plus}>
          New Chapter
        </Button>
      </div>
    </aside>
  );
}

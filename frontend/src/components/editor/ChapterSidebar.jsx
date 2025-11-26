import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from "lucide-react";
import Button from "../ui/Button";

export default function ChapterSidebar({
  book,
  selectedChapterIndex,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onGenerateChapterContent,
  isGenerating,
}) {
  const navigate = useNavigate();

  if (!book) return null;

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Button>

        <h2 className="text-base uppercase font-semibold text-slate-800 mt-4 truncate">
          {book.title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {Array.isArray(book.chapters) &&
            book.chapters.map((chapter, index) => (
              <div
                key={chapter._id || `new-${index}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 border border-slate-200"
              >
                <div
                  className={`flex items-center cursor-pointer ${
                    selectedChapterIndex === index
                      ? "bg-slate-200 rounded-lg"
                      : "hover:bg-slate-100 rounded-lg"
                  } p-2`}
                  onClick={() => onSelectChapter(index)}
                >
                  <GripVertical className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="truncate  text-sm font-medium text-slate-700">
                    {chapter.title}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 opacity-90">
                  <Button
                    variant="ghost"
                    size="small"
                    className="py-2 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateChapterContent(index);
                    }}
                    isLoading={isGenerating === index}
                    title="Generate Chapter"
                  >
                    {isGenerating !== index && (
                      <Sparkles className="w-4 h-4 text-violet-700" />
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
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <Button
          variant="secondary"
          onClick={onAddChapter}
          className="w-full"
          icon={Plus}
        >
          New Chapter
        </Button>
      </div>
    </aside>
  );
}

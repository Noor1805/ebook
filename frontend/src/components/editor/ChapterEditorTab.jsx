import { useMemo, useState } from "react";
import { Sparkles, Type, Maximize2, Eye } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SimpleMDEditor from "./SimpleMDEditor";

const ChapterEditorTab = ({
  book = {
    title: "Untitled",
    chapters: [{ title: "New Chapter", content: "" }],
  },
  selectedChapterIndex = 0,
  onChapterChange = () => {},
  onGenerateChapterContent = () => {},
  isGenerating,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatMarkdown = (content) => {
    return content
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-bold mb-4 mt-6">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>'
      )
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(
        /^\> (.*$)/gm,
        '<blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-700">$1</blockquote>'
      )
      .replace(/^\- (.*$)/gm, '<li class="ml-4 mb-1 list-disc">$1</li>')
      .replace(
        /(<li class="ml-4 mb-1 list-disc">.*<\/li>)/gs,
        '<ul class="my-4 ml-4">$1</ul>'
      )
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      .replace(
        /(<li class="ml-4 mb-1 list-decimal">.*<\/li>)/gs,
        '<ol class="my-4 ml-4">$1</ol>'
      )
      .split("\n\n")
      .map((p) => {
        p = p.trim();
        if (!p) return "";
        if (p.startsWith("<")) return p;
        return `<p class="mb-4 leading-relaxed">${p}</p>`;
      })
      .join("");
  };

  const mdeOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    };
  }, []);

  if (selectedChapterIndex === null || !book.chapters[selectedChapterIndex]) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-xs mx-auto">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Type className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-purple-600 text-lg font-medium">
            Select a chapter to start editing
          </p>
          <p className="text-purple-400 text-sm mt-1">
            Choose a chapter from the sidebar to begin
          </p>
        </div>
      </div>
    );
  }

  const currentChapter = book.chapters[selectedChapterIndex];

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 bg-white z-50" : "flex-1"
      } flex flex-col p-4 md:p-6 overflow-y-auto`}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-purple-700">
            Chapter Editor
          </h1>
          <p className="text-sm text-purple-500">
            Editing:{" "}
            {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          {/* EDIT BTN */}
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-2 text-sm rounded-md transition 
              ${
                !isPreviewMode
                  ? "bg-purple-600 text-white"
                  : "text-purple-600 hover:bg-purple-100"
              }`}
          >
            Edit
          </button>

          {/* PREVIEW BTN */}
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-2 text-sm rounded-md transition 
              ${
                isPreviewMode
                  ? "bg-purple-600 text-white"
                  : "text-purple-600 hover:bg-purple-100"
              }`}
          >
            Preview
          </button>

          {/* FULLSCREEN */}
          <button
            className="p-2 rounded-md hover:bg-purple-100"
            title="Toggle Fullscreen"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-5 h-5 text-purple-600" />
          </button>

          {/* AI GENERATE WITH LOADER */}
          <button
            onClick={() => onGenerateChapterContent(selectedChapterIndex)}
            disabled={isGenerating === selectedChapterIndex}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating === selectedChapterIndex ? (
              <>
                <span className="loader"></span>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* TITLE INPUT */}
      <div className="mb-6">
        <InputField
          label="Chapter Title"
          value={currentChapter.title}
          onChange={onChapterChange}
          className="border-purple-300 focus:border-purple-500"
          placeholder="Enter chapter title"
        />
      </div>

      {/* EDITOR OR PREVIEW */}
      <div className="w-full mt-4">
        {isPreviewMode ? (
          <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm transition-all">

            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <span className="text-purple-700 font-semibold">Preview Mode</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {currentChapter.title || "Untitled Chapter"}
            </h1>

            <div
              className="prose prose-purple max-w-none text-gray-800"
              style={{
                fontFamily:
                  'Charter, Georgia, "Times New Roman", serif',
                lineHeight: 1.8,
                fontSize: "1.05rem",
              }}
              dangerouslySetInnerHTML={{
                __html: currentChapter.content
                  ? formatMarkdown(currentChapter.content)
                  : '<p class="text-gray-400 italic text-lg">No content yet. Start writing to see the preview.</p>',
              }}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-md transition-all">
            <SimpleMDEditor
              value={currentChapter.content || ""}
              onChange={(value) =>
                onChapterChange({
                  target: { name: "content", value },
                })
              }
              options={mdeOptions}
            />
          </div>
        )}
      </div>

      {/* STATUS BAR */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-purple-50 rounded-lg border border-purple-100 shadow-sm">

        <div className="flex gap-6 text-sm text-gray-700 font-medium">
          <span className="flex items-center gap-1">
            Words:
            <span className="text-purple-700 font-semibold">
              {currentChapter.content
                ? currentChapter.content
                    .split(/\s+/)
                    .filter((w) => w.length).length
                : 0}
            </span>
          </span>

          <span className="flex items-center gap-1">
            Characters:
            <span className="text-purple-700 font-semibold">
              {currentChapter.content ? currentChapter.content.length : 0}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 text-sm">Auto-Saved</span>
        </div>
      </div>
    </div>
  );
};

export default ChapterEditorTab;

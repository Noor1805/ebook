import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Type } from "lucide-react";

const SimpleMDEditor = ({ value, onChange, options }) => {
  return (
    <div
      className="w-full bg-white rounded-xl border border-purple-200 shadow-md p-4"
      data-color-mode="light"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-100">
        <Type className="w-5 h-5 text-purple-600" />
        <span className="text-purple-700 font-semibold text-sm tracking-wide">
          Markdown Editor
        </span>
      </div>

      {/* Editor Box */}
      <div className="rounded-lg overflow-hidden shadow-inner bg-purple-50/40">
        <MDEditor
          value={value}
          onChange={onChange}
          height={400}
          preview="live"
          options={options}
          className="rounded-lg"
          commands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            commands.title,
            commands.divider,
            commands.link,
            commands.image,
            commands.code,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
        />
      </div>
    </div>
  );
};

export default SimpleMDEditor;

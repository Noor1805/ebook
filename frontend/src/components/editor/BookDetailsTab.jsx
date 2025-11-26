import React from "react";

const BookDetailsTab = ({
  book,
  onBookChange = () => {},
  onCoverUpload = () => {},
  isUploading = false,
  fileInputRef = null,
}) => {
  if (!book) return null;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-purple-100 shadow-sm">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">
          Book Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              name="title"
              value={book.title || ""}
              onChange={onBookChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Author
            </label>
            <input
              name="author"
              value={book.author || ""}
              onChange={onBookChange}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={book.description || ""}
              onChange={onBookChange}
              className="w-full border rounded-md p-2 min-h-[110px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Cover Image
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onCoverUpload}
                className="text-sm"
              />
              {isUploading ? (
                <span className="text-sm text-purple-600">Uploading...</span>
              ) : (
                book.coverImagePreview && (
                  <img
                    src={book.coverImagePreview}
                    alt="cover preview"
                    className="w-20 h-14 object-cover rounded-md border"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsTab;

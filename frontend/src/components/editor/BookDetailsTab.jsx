import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { UploadCloud } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookDetailsTab = ({
  book,
  onBookChange,
  onCoverUpload,
  isUploading,
  fileInputRef
}) => {

  // FIXED: correct image URL builder
  const coverImageUrl = book.coverImage?.startsWith("http")
  ? book.coverImage
  : `${BASE_URL}${book.coverImage}`.replace(/\\/g, "/");

  

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ============ BOOK DETAILS ============ */}
      <div>
        <h3 className="text-xl font-semibold text-purple-700 mb-4">
          Book Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Title"
            name="title"
            value={book.title}
            onChange={onBookChange}
          />

          <InputField
            label="Author"
            name="author"
            value={book.author}
            onChange={onBookChange}
          />

          <InputField
            label="Subtitle"
            name="subtitle"
            value={book.subtitle || ""}
            onChange={onBookChange}
          />
        </div>
      </div>

      {/* ============ COVER UPLOAD SECTION ============ */}
      <div>
        <h3 className="text-xl font-semibold text-purple-700 mb-4">
          Cover Image
        </h3>

        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* IMAGE PREVIEW */}
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-40 h-56 object-cover border rounded-lg shadow-sm"
          />

          {/* UPLOAD CONTROLS */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Upload a new cover image. Recommended size: <b>600×800px</b>.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onCoverUpload}
              accept="image/*"
              className="hidden"
            />

            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              icon={UploadCloud}
            >
              Upload Image
            </Button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default BookDetailsTab;


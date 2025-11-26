import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";



import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {Plus, Book} from "lucide-react";
import Button from "../components/ui/Button";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateEbookModal";


const BookCardSkeleton = () => (
  <div className="animate-pulse border border-slate-200 rounded-lg shadow-sm">
    <div className="w-full aspect-w-16 aspect-h-25 bg-slate-200 rounded-lg"></div>
    <div className="p-4">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
)

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-25 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              className="bg-red-600 rounded-lg p-2 text-white hover:bg-red-700"
            >
              Confirm
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};



const DashboardPage = () => {
  const { user, loading, isAuthenticated } = useAuth();

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  if (loading) return;     // wait for auth to finish
  if (!isAuthenticated) return; // stop if user not logged in

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
      setBooks(response.data.books || []);

    } catch (error) {
      toast.error("Failed to fetch your ebooks");
    } finally {
      setIsLoading(false);
    }
  };

  fetchBooks();
}, [loading, isAuthenticated]);


  const handleDeleteBook = async () => {
  if (!bookToDelete) return;

  try {
    await axiosInstance.delete(
      `${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`
    );

    setBooks((books) => books.filter((book) => book._id !== bookToDelete));
    toast.success("eBook deleted successfully.");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete eBook.");
  } finally {
    setBookToDelete(null);
  }
};

  const handleCreateBookClick = () => {
    setIsCreateModalOpen(true);
  }

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">All eBooks</h1>
            <p className="text-[13px] text-slate-600 mt-1">Create, edit, and manage all your AI-generated eBooks.</p>
          </div>
          <Button className="whitespace-nowrap p-2 rounded-xl text-white bg-linear-to-tl from-violet-800 to-purple-400 shadow-lg hover:shadow-violet-300 shadow-violet-500" onClick={handleCreateBookClick} icon={Plus}>
            Create New eBook 
          </Button>
        </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>  
      ) : books.length === 0 ? (
        <div className="text-center flex flex-col items-center py-12 text-slate-600 border-2 border-dashed border-slate-300 rounded-lg mt-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center mb-4">
            <Book className="mb-4 h-8 w-8 text-slate-400"/>
          </div>
          <h3 className="text-lg text-slate-900 font-medium mb-2">
            No eBooks found.
          </h3>
          <p className="text-slate-500 mb-6 max-w-md">You haven't created any ebooks yet. Get started by creating your first one.</p>
          <Button onClick={handleCreateBookClick} className="whitespace-nowrap p-2 rounded-xl text-white bg-linear-to-tl from-violet-800 to-purple-400 shadow-lg hover:shadow-violet-300 shadow-violet-500"  icon={Plus} >Create Your First eBook</Button>
          
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {books.map((book) => (
    <BookCard 
      key={book._id}
      book={book}
      onDelete={() => setBookToDelete(book._id)}
    />
  ))}
</div>

      )}

      <ConfirmationModal
  isOpen={!!bookToDelete}
  onClose={() => setBookToDelete(null)}
  onConfirm={handleDeleteBook}
  title="Delete eBook"
  message="Are you sure you want to delete this eBook? This action cannot be undone."
/>

      <CreateBookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBookCreated={handleBookCreated}
      />

      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;


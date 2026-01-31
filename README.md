# eBook AI 📚🤖

A full-stack application that leverages Google's Gemini AI to generate high-quality eBooks. Users can generate content, edit it using a built-in markdown editor, and export their final work to PDF or DOCX formats.

## 🚀 Features

- **AI-Powered Content Generation:** Uses Google Gemini AI to create book outlines and full chapters.
- **Interactive Editor:** A seamless markdown editor for refining generated content.
- **Export Options:** Download your eBooks in **PDF** or **DOCX** formats.
- **User Authentication:** Secure login and registration system.
- **Dashboard:** Manage your created books and profile.
- **Responsive UI:** Modern design built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend

- **React** (Vite)
- **Tailwind CSS**
- **Lucide React** (Icons)
- **React MD Editor** (Markdown editing)
- **React Router** (Navigation)

### Backend

- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **Google Generative AI** (Gemini API)
- **JWT & Bcryptjs** (Authentication)
- **PDFKit & Docx** (File Export)

## ⚙️ Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Noor1805/ebook.git
   cd ebook
   ```

2. **Backend Setup:**

   ```bash
   cd backend
   npm install
   # Create a .env file and add your credentials (see below)
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file and add VITE_API_URL
   npm run dev
   ```

## 🔑 Environment Variables

### Backend (`backend/.env`)

- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure random string.
- `GEMINI_API_KEY`: Your Google Gemini API Key.
- `PORT`: (Default: 5000 or 10000)

### Frontend (`frontend/.env`)

- `VITE_API_URL`: Your backend server URL (e.g., `http://localhost:5000` for local or Render URL for production).

## 🌍 Deployment

### Backend (Render)

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend (Vercel)

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Environment Variable: `VITE_API_URL` (Point to your backend URL)

## 📄 License

This project is licensed under the ISC License.

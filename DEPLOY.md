# Deployment Guide

This project is a full-stack application with a **Node.js/Express Backend** and a **React/Vite Frontend**.

## 1. Backend Deployment (Render)

We will use [Render](https://render.com/) to deploy the backend.

1.  **Push your code to GitHub**.
2.  **Create a Web Service on Render**:
    *   Go to the Render Dashboard and click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
    *   **Root Directory**: `backend` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
3.  **Environment Variables**:
    *   Scroll down to the "Environment Variables" section and add the following:
        *   `MONGO_URI`: Your MongoDB connection string (from MongoDB Atlas).
        *   `JWT_SECRET`: A secure random string for authentication.
        *   `GEMINI_API_KEY`: Your Google Gemini API Key.
        *   `PORT`: `10000` (Render sets this automatically, but good to know).
4.  **Deploy**: Click **Create Web Service**.
5.  **Copy the Backend URL**: Once deployed, copy the URL (e.g., `https://ebook-ai-backend.onrender.com`). You will need this for the frontend.

## 2. Frontend Deployment (Vercel)

We will use [Vercel](https://vercel.com/) to deploy the frontend.

1.  **Import Project**:
    *   Go to the Vercel Dashboard and click **Add New...** -> **Project**.
    *   Import your GitHub repository.
2.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add `VITE_API_URL` and set the value to your **Render Backend URL** (e.g., `https://ebook-ai-backend.onrender.com`).
        *   *Note: Do not add a trailing slash `/`.*
4.  **Deploy**: Click **Deploy**.

## 3. Verification

1.  Open your Vercel deployment URL.
2.  Try to Sign Up or Login.
3.  If successful, the frontend is correctly communicating with the backend!

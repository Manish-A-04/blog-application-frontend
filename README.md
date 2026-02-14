# Blog Application Frontend

A modern, responsive frontend for the Blog Application, built with React and Vite.

## Tech Stack

-   **Framework**: React
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **Routing**: React Router DOM
-   **HTTP Client**: Axios
-   **Icons**: Heroicons

## Features

-   **Modern UI**: Glassmorphism design and smooth animations.
-   **Markdown Support**: Render blog posts written in Markdown.
-   **Blog Scheduling**: UI for selecting future publication dates.
-   **Admin Dashboard**: comprehensive dashboard for managing content (no sidebar, focused layout).
-   **Authentication**: Login and Register pages with validation.
-   **Responsive Design**: Optimized for mobile and desktop.

## Setup

1.  **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the `frontend` directory:
    ```env
    VITE_API_URL=http://localhost:8000/api
    ```

## Running the App

**Development**:
```bash
npm run dev
```
The app will run at `http://localhost:5173`.

**Production Build**:
```bash
npm run build
```
The output will be in the `dist` folder, ready for deployment to Vercel, Netlify, or AWS S3.

## Key Components

-   **`src/pages/CreateBlog.jsx`**: Logic for creating and scheduling posts.
-   **`src/layouts/AdminLayout.jsx`**: Simplified layout for admin tools.
-   **`src/hooks/useAuth.js`**: Authentication context and logic.

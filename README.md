# Polaris Frontend

## Overview

This repository contains the frontend for Polaris, a professional photography gallery system. The frontend is built with React and TypeScript, using Vite for builds, Tailwind CSS for styling, and Zustand for state management. It consumes the backend REST API for authentication, project management, photos, and selections.

## Project Structure

- `src/App.tsx`: Main route definitions and layout.
- `src/pages/`: Core pages (Landing, Login, Dashboard, Projects, Profile, etc.).
- `src/components/`: Reusable UI components (PhotoGallery, Navbar, etc.).
- `src/services/`: API integration services (auth, project, drive, etc.).
- `src/store/`: Global state management (authStore, projectStore).
- `src/types/`: Shared TypeScript types.
- `src/utils/`: Utility functions.

## Main Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router v6
- Axios
- Framer Motion

## Setup and Execution

1. Install dependencies:
   ```sh
   npm install
   ```
2. Configure environment variables in `.env` (example: `.env.example`, if available).
3. Start the development server:
   ```sh
   npm run dev
   ```

## Useful Scripts

- `npm run dev` — Starts the development server
- `npm run build` — Builds the production bundle
- `npm run preview` — Previews the production build locally

## Notes

- The frontend expects the backend to be running and accessible through the URL configured in `VITE_API_URL`.
- Authentication is handled via httpOnly cookies, which are sent automatically by the browser.
- Images are served directly from Google Drive through public URLs.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

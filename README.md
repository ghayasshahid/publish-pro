# Bookstore Frontend

A professional-grade, reactive bookstore management application built with React, TypeScript, and Vite. This application facilitates seamless interaction with the backend API for secure user authentication, book management, and file operations.

## 🚀 Key Technologies & Stack

- **Framework:** [React 19](https://react.dev/) with TypeScript for type-safe, maintainable UI components.
- **Build Tool:** [Vite](https://vite.dev/) for lightning-fast development and optimized production builds.
- **State Management:** [Redux](https://redux.js.org/) for global state and [TanStack React Query](https://tanstack.com/query/latest) for efficient server-state management.
- **Styling:** [SCSS (Sass)](https://sass-lang.com/) for structured, modular, and maintainable CSS architectures.
- **Routing:** [React Router v7](https://reactrouter.com/) for declarative, nested navigation.
- **API Communication:** Custom wrapper around the native `fetch` API for robust, authorized, and error-handled communication.

## 🏗️ Architectural Overview

The application follows a clean, component-based architecture:

- **`/src/components`**: Modular UI components organized by functional complexity (atoms/molecules/organisms).
- **`/src/api.ts`**: Centralized API service layer handling authentication tokens, cross-origin communication, and token refresh logic.
- **`/src/styles`**: Global and component-specific SCSS files utilizing the `@use` directive for modular styling.
- **`/src/utils`**: Reusable helper functions (e.g., input validation).

## 🛠️ Project Setup

### Prerequisites
- Node.js (v20+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd bookstore-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## ⚙️ Key Functional Features

- **Robust Authentication:** Secure login/signup process with automatic JWT token management.
- **Token Refreshing:** Seamless background token renewal mechanism.
- **Dynamic Book Management:** CRUD operations on book inventory, including file uploads and downloads.
- **State Optimization:** Intelligent caching and refetching policies managed by React Query.
- **Standardized Design:** Uniform typography utilizing the 'Inter' font across all components for a professional aesthetic.

## 📄 License
This project is proprietary and confidential.

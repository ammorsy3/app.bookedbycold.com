# AI Development Rules

This document outlines the technical stack and library usage guidelines for this project to ensure consistency and maintainability.

## Tech Stack

This is a modern web application built with the following technologies:

*   **Framework**: React with TypeScript for building a type-safe, component-based user interface.
*   **Build Tool**: Vite for fast development and optimized production builds.
*   **Styling**: Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent design implementation.
*   **Routing**: React Router for handling all client-side navigation and URL management.
*   **Icons**: Lucide React for a comprehensive and lightweight set of SVG icons.
*   **Backend & Auth**: Supabase is used for database, authentication, and serverless Edge Functions.
*   **Notifications**: Novu for in-app notifications.

## Library Usage Rules

To maintain a clean and predictable codebase, please adhere to the following rules:

1.  **UI Components**:
    *   All new UI components must be built using React and styled with **Tailwind CSS**.
    *   Do not introduce other styling libraries like Styled Components or CSS-in-JS without prior approval.

2.  **Icons**:
    *   Only use icons from the **Lucide React** library (`lucide-react`). This keeps the icon set consistent and optimized.
    *   If a required icon is missing, it should be created as a custom SVG component, not imported from another library.

3.  **Routing**:
    *   All application routes, including protected and public pages, must be managed through **React Router**.
    *   Keep route definitions centralized in `src/App.tsx`.

4.  **State Management**:
    *   For local component state, use React's built-in hooks (`useState`, `useEffect`, `useContext`).
    *   Avoid adding complex global state management libraries (like Redux or Zustand) unless the application's complexity justifies it.

5.  **Backend Interaction**:
    *   All backend interactions (database queries, authentication, serverless functions) must go through the **Supabase** client.
    *   CORS-related issues with external APIs should be solved by proxying requests through a Supabase Edge Function.

6.  **Type Safety**:
    *   Write all new code in **TypeScript**. Avoid using `any` where possible, and define clear interfaces for props, API responses, and complex objects.

7.  **Code Formatting**:
    *   Code will be automatically formatted on save using Prettier and linted with ESLint. Ensure your editor is configured to use the project's settings.
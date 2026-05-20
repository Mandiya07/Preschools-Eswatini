# Sikolo - EdTech Platform Setup & Deployment

## Architecture Overview
Sikolo is a scalable, multi-tenant SaaS platform built for schools (preschools to colleges). It provides a central administrative dashboard for school administrators, a parent portal, an e-learning environment, and a multi-tenant capability via a super-admin portal.

### Tech Stack
-   **Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui components, Framer Motion for animations.
-   **Backend:** Express / Node.js (via server.ts) configured to handle API requests and Vite middleware for the frontend in development.
-   **Database / Auth:** Firebase Enterprise Edition (Firestore, Firebase Auth).
-   **Multi-tenancy:** Isolated per school using data access rules applied on top of Firebase Collections (`School`, `User`, `PlatformSubscription`, etc.).
-   **Styling:** Utility-first styling with Tailwind CSS, utilizing a consistent and accessible color scale.

### Directory Structure
```
/src
 ├── /components    # Reusable UI components (buttons, dialogs, cards)
 │    ├── /ui       # Shadcn primitives
 │    └── /layout   # Main shell wrappers (Admin, SuperAdmin, Landing)
 ├── /data          # Mock data and global states when offline
 ├── /lib           # Core services (Auth context, Firestore utilities)
 ├── /pages         # Top-level route components mapped logically
 │    └── /super    # Super-admin specific routes
 └── types.ts       # Global data shapes (TypeScript definitions)
```

## Setup Instructions

### Environment Variables
1. Make a copy of `.env.example` and name it `.env`.
2. Ensure you have the `GEMINI_API_KEY` for AI functionalities.
3. Configure your Firebase project using the set_up_firebase tools internally. A `firebase-applet-config.json` will be generated.

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. The server starts usually on port 3000, exposed handling both API calls (`/api/`) and the client-side SPA.

### Firestore Rules & Security
Run testing for security rules (using configured primitives in `firebase-blueprint.json`):
```bash
npm run lint
```
Always ensure Quota limits are respected, and rules strictly validate tenant IDs (school IDs) on all document reads and writes.

## Deployment Instructions

### Production Build
1. Create a production build of the Vite React App AND esbuild for the Express server:
   ```bash
   npm run build
   ```
2. This creates static assets inside `dist/` and a self-contained Express server at `dist/server.cjs`.

### Dockerization / Cloud Run
Sikolo is optimized to run inside Google Cloud Run. Setup:
- Ensure the Docker image copies the `dist/` folder and `package.json`.
- The start command is already mapped to:
  ```bash
  npm start
  ```
- Exposes port 3000 mapping internally to standard web ingress. Traffic is proxied through an Nginx reverse proxy.
- Set all production environment variables in the Cloud Run service configuration (Secrets).

## Core Modules Enabled
- **Admissions Engine:** Paperless pipeline for form applications.
- **E-Learning & Result Cards:** Advanced modules for courses and publishing results.
- **Marketplace & Subscriptions:** Premium SaaS scaling features supporting modular plugins.
- **AI Tutors:** Real-time chat via Gemini API.
- **Transportation:** Routing modules built on Map location systems.

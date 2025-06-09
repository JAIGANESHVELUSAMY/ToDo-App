# ToDo-App

# TaskMaster - A Full-Stack Todo Management Application

TaskMaster is a modern, full-stack web application designed to help users manage their personal to-do tasks efficiently. It features a clean, responsive user interface, secure authentication via multiple providers, and a robust backend API for full CRUD (Create, Read, Update, Delete) functionality.

### Live Demo & Video
- **Live Application:** **[https://todo-app-oddz.onrender.com]**

---

## Features

- **Secure Authentication:** Sign up and log in with Email/Password, Google, or GitHub.
- **Full CRUD Functionality:** Create, read, update, and delete tasks seamlessly.
- **Task Management:**
  - Add titles, descriptions, due dates, and specific due times.
  - Mark tasks as "Open" or "Completed".
  - A clear dashboard view separating tasks into "To Do" and "Completed" columns.
- **In-App Reminders:** Receive a browser pop-up notification for tasks that are due within 10 minutes.
- **Light/Dark Mode:** A theme-switcher in the navbar to toggle between light and dark modes, with the user's preference saved locally.
- **Responsive Design:** A beautiful and functional user interface that works perfectly on both desktop and mobile devices.

---

## Architecture Diagram

This application follows a modern, decoupled frontend/backend architecture.


*Replace the link above with the path to your own architecture diagram image in the repository.*

**Flow:**
1.  The **React Frontend**, hosted on a static hosting service like Vercel, serves the user interface.
2.  Users authenticate via the **Node.js/Express Backend API**, which handles logic for local (email/password) and social (Google/GitHub) logins.
3.  Upon successful authentication, the backend generates a **JSON Web Token (JWT)**, which is sent back to the client.
4.  All subsequent API requests from the client (e.g., to fetch or create tasks) include this JWT for authorization.
5.  The backend processes these requests, performing CRUD operations on the **MongoDB Atlas** database. All data is scoped to the authenticated user.

---

## Tech Stack

| Category      | Technology                                                              |
|---------------|-------------------------------------------------------------------------|
| **Frontend**  | React, Vite, React Router, Axios, CSS Modules, Lucide Icons             |
| **Backend**   | Node.js, Express.js                                                     |
| **Database**  | MongoDB (with Mongoose ODM)                                             |
| **Authentication** | Passport.js (Local, Google OAuth 2.0, GitHub strategies), JWT, bcrypt.js |
| **Deployment** | **[e.g., Vercel (Frontend), Render (Backend), MongoDB Atlas (DB)]**     |

---

## Local Development Setup

To run this project on your local machine, follow these steps.

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Git
- A MongoDB Atlas account
- Google and GitHub OAuth credentials

### 1. Clone the Repository
```bash
git clone https://github.com/JAIGANESHVELUSAMY/ToDo-App
cd ToDo-App
```

### 2. Backend Setup
```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env
```
Now, open `backend/.env` and fill in all the required values:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` (for local dev, use `http://localhost:5173`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

```bash
# Start the backend server
npm run dev
```
The backend will be running on `http://localhost:3001`.

### 3. Frontend Setup
Open a new terminal window.
```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```
The frontend is configured to connect to the backend at `http://localhost:3001` via its Vite proxy settings.

```bash
# Start the frontend development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## Assumptions & Design Choices

- **Styling:** To ensure maximum compatibility and avoid build tool conflicts, this project was built using **CSS Modules** instead of a utility-first framework like Tailwind CSS. This provides scoped styling out-of-the-box and works reliably with Vite.
- **Reminders:** The email reminder feature was scoped out in favor of a simpler, client-side **in-app notification system** using browser alerts. This simplifies the backend configuration while still providing the core reminder functionality.
- **State Management:** Global state (authentication, theme) is managed using React's built-in **Context API**, which is lightweight and sufficient for the scale of this application.

---

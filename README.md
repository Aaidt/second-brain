# 🧠 Second Brain (Serverless Edition)

Second Brain is an AI-powered knowledge management and chat application designed to capture, organize, and retrieve your thoughts and ideas. It leverages advanced vector search and Large Language Models (LLMs) to provide a "second brain" that you can query in natural language.

---

## 🚀 Demo

### Live Deployment
You can access the deployed serverless backend API here:
**[🔗 Live Serverless API Link](YOUR_LIVE_LINK_HERE)**

### Demo
![Application Demo](assets/demo.gif)

---

## 🛠 Tech Stack

### Serverless Backend (Deployed)
Built with **Next.js** to function as a robust, scalable API.
-   **Framework:** Next.js (Serverless Functions)
-   **Database:** PostgreSQL (NeonDB) via Prisma ORM
-   **Vector Database:** Qdrant (for semantic search and memory)
-   **AI Models:** Google Gemini, Mistral AI, OpenRouter
-   **Authentication:** Supabase Auth & NextAuth
-   **Deployment:** Vercel (or compatible serverless platform)

### Frontend (Local)
A modern, responsive interface built for speed and aesthetics.
-   **Framework:** React (Vite)
-   **Styling:** Tailwind CSS, Framer Motion
-   **State/Logic:** Axios, React Router, React Toastify

---

## ✨ Features

-   **AI Chat Interface:** Conversational access to your knowledge base using state-of-the-art LLMs.
-   **Memory & Context:** Uses Vector Embeddings (Qdrant) to recall relevant past interactions and stored notes.
-   **Secure Authentication:** User management handled via Supabase.
-   **Responsive Design:** Clean, modern UI optimized for all devices.
-   **Serverless Architecture:** Scalable and cost-effective backend logic.

---

## ⚙️ Local Setup Guide

Follow these steps to get the full stack running locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/second-brain.git
cd second-brain
```

### 2. Backend Setup (Serverless)

Navigate to the serverless directory:
```bash
cd serverless
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on `.env.example` and add your keys:
```env
# Database & Auth
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key"

# AI Services
GEMINI_API_KEY="your-gemini-key"
MISTRAL_API_KEY="your-mistral-key"
OPENROUTER_API_KEY="your-openrouter-key"

# Vector DB
QDRANT_API_KEY="your-qdrant-key"
QDRANT_CLOUD_URL="your-qdrant-url"
```

Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup (Client)

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on `.env.example`:
```env
VITE_BACKEND_URL="http://localhost:3000/api" # Or your deployed API URL
VITE_CLIENT_URL="http://localhost:5173"
```

Run the frontend:
```bash
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License.

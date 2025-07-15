# 🧠 Second Brain
![Alt](https://repobeats.axiom.co/api/embed/fa8652287408755e9114263560c515eaef4f568d.svg "Repobeats analytics image")

**Second Brain** is a personal **knowledge repository** powered by AI. It lets users upload and store their content—such as YouTube, Reddit, or Twitter links, written thoughts, or documents—and later **query their uploads using AI** to uncover insights, rediscover information, and **learn more about themselves**.

---

## 📌 Features

- ✍️ Save your thoughts here
- 🔗 Add links from platforms like YouTube, Reddit, and Twitter  
- 📄 Upload documents (PDF, EPUB, etc.)  
- 🤖 Query your "second brain" using AI to generate insights  
- 🧠 Centralize your knowledge and revisit it over time  

---

## 💡 Use Cases

- Journal your thoughts and extract patterns using AI  
- Curate useful content from the web and rediscover it contextually  
- Save study material, ideas, or references for long-term memory  
- Learn from your own digital trail

---

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite  
- **Backend**: Node.js + Express.js + TypeScript  
- **Database**: MongoDB with Mongoose  
- **AI Layer**: Will be added soon... 
- **File Uploads**: Multer  
- **Routing**: react-router-dom  
- **Authentication**: jsonwebtokens 

---

## 📦 Dependencies (Core)

- `react`, `react-dom`, `react-router-dom`  
- `axios`, `jsonwebtoken`, `dotenv`  
- `express`, `mongoose`, `multer`, `cors`  
- `typescript`, `vite`, `multer`  
- `zod`, `bcrypt`

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+ recommended)  
- MongoDB database (local or cloud)   
- `.env` file configured with your variables

### 📁 Environment Variables Example
#### For server:
```env
CONN=mongodb://localhost:27017/name-of-your-db
ACCESS_SECRET=your-access-secret
REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-api-key
QDRANT_API_KEY=your-api-key
QDRANT_CLOUD_URL=your-cloud-url
```
#### For client: 
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your-api-key
```


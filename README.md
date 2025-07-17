# 🧠 Second Brain
![Alt](https://repobeats.axiom.co/api/embed/fa8652287408755e9114263560c515eaef4f568d.svg "Repobeats analytics image")

Second Brain is a full-stack AI-powered chat and knowledge management application. It allows users to create, manage, store and reference their thoughts and knowledge in a structured and searchable way and query them. The app features authentication, session management, and a modern, responsive UI.

---

## Features

- **AI Chat Sessions:** Start new chat sessions, continue previous ones, and interact with an AI assistant.
- **Session History:** View, revisit, and delete previous chat sessions.
- **References:** See which of your stored thoughts were used to answer your queries.
- **Authentication:** Secure login and token-based session management.
- **Modern UI:** Responsive, user-friendly interface built with React and Tailwind CSS.
- **Persistent Storage:** All chats and thoughts are stored in a database for future reference.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, React Markdown, React Toastify
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** NeonDb (Configured via Prisma, e.g., PostgreSQL or SQLite)
- **Authentication:** JWT-based (Access and refresh tokens)
- **Other:** Axios, Vite, Lucide Icons

---

## Project Structure

```
second-brain/
  client/      # Frontend React app
  server/      # Backend API (Express + Prisma)
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

**Note:**  
- Make sure your database is running and accessible.
- Adjust environment variables as needed for your setup.
- For production, set secure values for secrets and use a production-ready database.


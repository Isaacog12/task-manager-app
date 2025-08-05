# 📝 Task Manager App

A simple yet functional full-stack Task Manager built with:

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: SQLite

This app allows users to create, update, delete, and manage tasks with priority levels and status toggles.

---

## 🚀 Features

✅ Add new tasks  
✅ Edit task details  
✅ Delete tasks  
✅ Toggle task status (Pending / Completed)  
✅ View all tasks from the database  
✅ Mobile-friendly UI with **Midnight Blue** theme

---

## 🧱 Project Structure

task-manager-app/
│
├── backend/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── dev.db (auto-created)
│ └── server.js
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── package.json
└── README.md

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app


 2. Install Dependencies
bash
Copy
Edit
npm install


3. Initialize the Database
bash
Copy
Edit
cd backend
npx prisma migrate dev --name init

4. Start the App
From the root folder:

bash
Copy
Edit
npm start
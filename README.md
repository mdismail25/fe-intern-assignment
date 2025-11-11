# 🚀 FE Intern Assignment – Full Stack Web Application

**Developer:** Mohammed Ismail Y  
**Role:** Frontend Developer Intern  
**Duration:** 3-Day Assignment  
**Technologies:** React.js (Vite), Tailwind CSS, Node.js (Express), JWT Authentication  

---

## 🌐 Live Demo Links

| Service | URL |
|----------|-----|
| 🖥️ **Frontend (Vercel)** | [https://fe-intern-assignment.vercel.app](https://fe-intern-assignment.vercel.app) |
| ⚙️ **Backend (Render)** | [https://fe-intern-assignment.onrender.com](https://fe-intern-assignment.onrender.com) |
| 📬 **GitHub Repository** | [https://github.com/mdismail25/fe-intern-assignment](https://github.com/mdismail25/fe-intern-assignment) |

---

## 🧩 Project Overview

This project is a **scalable full-stack web app** with authentication and a dashboard, built for the Frontend Developer Intern assignment.

It demonstrates:
- **Modern responsive UI** using React.js + Tailwind CSS  
- **JWT-based authentication** (login, register, logout)  
- **Protected routes** and secure token handling  
- **Reusable component structure** for scalability  
- **Fully deployed** backend and frontend for production use  

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React.js (Vite), Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Authentication | JWT (JSON Web Token) |
| Deployment | Render (Backend) & Vercel (Frontend) |

---

## 📜 API Endpoints

**Base URL:** `https://fe-intern-assignment.onrender.com`

| Method | Endpoint | Description | Auth |
|--------|-----------|--------------|------|
| `GET` | `/` | Health check | ❌ |
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user and get token | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |
| `PUT` | `/api/auth/me` | Update profile | ✅ |
| `GET` | `/api/tasks` | Fetch all tasks | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |

✅ **Auth** = Requires JWT token in header:  
`Authorization: Bearer <your_token>`

---

## 🧠 Features Implemented

✅ Responsive UI with TailwindCSS  
✅ Login & Register flows (with validation)  
✅ JWT token storage in localStorage  
✅ Protected dashboard route  
✅ Logout functionality  
✅ CRUD endpoints tested with Postman  
✅ Deployed backend and frontend  

---

## 🧪 API Testing (Postman)

- All endpoints tested successfully using Postman.  
- Sample Postman collection: `fe-intern.postman_collection.json`  
  (You can import it into Postman and test all routes instantly.)

---

## ⚡ How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mdismail25/fe-intern-assignment.git
cd fe-intern-assignment
```
###2️⃣ Run the backend
```bash
cd backend
npm install
npm run dev
```

### Server runs at → http://localhost:5000

### 3️⃣ Run the frontend
```bash
cd ../frontend
npm install
npm run dev
```

### App runs at → http://localhost:5173

### 4️⃣ Environment Variables

### Backend (.env):
```bash
PORT=5000
JWT_SECRET=please_change_me
```

### Frontend (.env):
```bash
VITE_API_URL=https://fe-intern-assignment.onrender.com
```

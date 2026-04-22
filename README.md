# CityResolve – Local Community Problem Reporting System

CityResolve is a full-stack web application that allows citizens to report local issues such as garbage, potholes, water problems, and more. Authorities can track and resolve these complaints efficiently.

---

## Features

### User Features
- User registration and login (JWT authentication)
- Submit complaints
- View complaints
- Track complaint status

### System Features
- Update complaint status (Pending to Resolved)
- View all complaints
- Secure backend APIs

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

---


## Project Structure

```

CITYRESOLVE/
│
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ └── package.json
│
├── backend/ # Express backend
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ ├── server.js
│ └── package.json

```
---

## Setup Instructions

### 1. Clone Repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd CITYRESOLVE

---

### 2. Backend Setup
cd backend
npm install

Create a .env file inside backend:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

Run backend:
node server.js

---

### 3. Frontend Setup
cd frontend
npm install
npm start

---

## Deployment

### Backend (Render)
- Build Command: npm install
- Start Command: node server.js
- Environment Variables:
  - MONGO_URI
  - JWT_SECRET

### Frontend (Render)
- Build Command: npm run build
- Publish Directory: build

---

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Complaints
- POST /api/complaints
- GET /api/complaints
- PUT /api/complaints/:id

# FreeLynk Freelance Platform

FreeLynk is a modern web platform connecting clients and freelancers. It enables project posting, bidding, and portfolio showcasing, with a beautiful, responsive UI and robust backend.

## 🚀 Features

- User authentication (Client & Freelancer roles)
- Project posting, browsing, and management
- Bidding system for freelancers
- Dashboards with stats and recent activity
- Portfolio and profile management
- Modern, responsive UI (React + Tailwind CSS)
- RESTful API (Node.js/Express + MongoDB)

## 🏗️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Other:** Context API, Role-based access, CORS, REST API

## 📁 Project Structure


FreeLynk/
- │   backend/
- │   ├── controllers/
- │   │   ├── authController.js
- │   │   ├── bidController.js
- │   │   ├── projectController.js
- │   │   └── userController.js
- │   ├── middleware/
- │   │   └── auth.js
- │   ├── models/
- │   │   ├── Bid.js
- │   │   ├── Project.js
- │   │   └── User.js
- │   ├── routes/
- │   │   ├── auth.js
- │   │   ├── bids.js
- │   │   ├── projects.js
- │   │   └── users.js
- │   ├── utils/
- │   │   └── seedData.js
- │   ├── seed.js
- │   ├── server.js
- │   ├── package.json
- │   └── package-lock.json
- │
- ├── frontend/
- │   ├── public/
- │   │   ├── favicon.ico
- │   │   ├── FreeLynk_Logo.jpeg
- │   │   ├── index.html
- │   │   ├── logo192.png
- │   │   ├── logo512.png
- │   │   ├── manifest.json
- │   │   └── robots.txt
- │   ├── src/
- │   │   ├── components/
- │   │   │   ├── Header.js
- │   │   │   ├── Loading.js
- │   │   │   └── Toast.js
- │   │   ├── context/
- │   │   │   └── AuthContext.js
- │   │   ├── pages/
- │   │   │   ├── BrowseProjects.js
- │   │   │   ├── CreateProject.js
- │   │   │   ├── Dashboard.js
- │   │   │   ├── FreelancerPortfolio.js
- │   │   │   ├── Login.js
- │   │   │   ├── MyBids.js
- │   │   │   ├── Portfolio.js
- │   │   │   ├── ProjectDetails.js
- │   │   │   ├── Register.js
- │   │   │   └── SearchFreelancers.js
- │   │   ├── App.js
- │   │   ├── App.css
- │   │   ├── App.test.js
- │   │   ├── index.js
- │   │   ├── index.css
- │   │   ├── logo.svg
- │   │   ├── reportWebVitals.js
- │   │   └── setupTests.js
- │   ├── tailwind.config.js
- │   ├── postcss.config.js
- │   ├── package.json
- │   ├── package-lock.json
- │
- ├── FreeLynk_Logo.jpeg
- ├── package.json
- └── package-lock.json

## ⚡ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)


### 1. Backend Setup

```bash
cd backend
npm install
```

# Create a .env file for your MongoDB URI and JWT secret
MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Database Collections & Schemas

##Users Collection (users)

| Field       | Type       | Description                         |
| ----------- | ---------- | ----------------------------------- |
| `_id`       | `ObjectId` | Unique identifier for each user     |
| `name`      | `String`   | User’s full name                    |
| `email`     | `String`   | Unique email address                |
| `password`  | `String`   | Hashed password                     |
| `role`      | `String`   | Either `'client'` or `'freelancer'` |
| `bio`       | `String`   |              Short user bio         |
| `skills`    | `[String]` |              Freelancer skill set   |
| `createdAt` | `Date`     | Timestamp of account creation       |


##Projects Collection (projects)

| Field         | Type         | Description                                   |
| ------------- | ------------ | --------------------------------------------- |
| `_id`         | `ObjectId`   | Unique project ID                             |
| `title`       | `String`     | Project title                                 |
| `description` | `String`     | Details and requirements of the project       |
| `budget`      | `Number`     | Budget allocated by the client                |
| `client`      | `ObjectId`   | Reference to the user who created the project |
| `status`      | `String`     | Project status (e.g., `'open'`, `'closed'`)   |
| `bids`        | `[ObjectId]` | Array of bids placed (references to `bids`)   |
| `createdAt`   | `Date`       | Timestamp when the project was posted         |


## Bids Collection (bids)

| Field        | Type       | Description                                  |
| ------------ | ---------- | -------------------------------------------- |
| `_id`        | `ObjectId` | Unique bid ID                                |
| `project`    | `ObjectId` | Reference to the related project             |
| `freelancer` | `ObjectId` | Reference to the bidding freelancer          |
| `amount`     | `Number`   | Proposed bid amount                          |
| `message`    | `String`   | Proposal/cover letter by freelancer          |
| `status`     | `String`   | Bid status (e.g., `'pending'`, `'accepted'`) |
| `createdAt`  | `Date`     | Timestamp when the bid was placed            |




- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)


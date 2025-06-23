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
-- │
-- │   ├── middleware/
-- │   │   └── auth.js
-- │   ├── models/
-- │   │   ├── Bid.js
-- │   │   ├── Project.js
-- │   │   └── User.js
-- │   ├── routes/
-- │   │   ├── auth.js
-- │   │   ├── bids.js
-- │   │   ├── projects.js
-- │   │   └── users.js
-- │   ├── utils/
-- │   │   └── seedData.js
-- │   ├── seed.js
-- │   ├── server.js
-- │   ├── package.json
-- │   └── package-lock.json
-- │
-- ├── frontend/
-- │   ├── public/
-- │   │   ├── favicon.ico
-- │   │   ├── FreeLynk_Logo.jpeg
-- │   │   ├── index.html
-- │   │   ├── logo192.png
-- │   │   ├── logo512.png
-- │   │   ├── manifest.json
-- │   │   └── robots.txt
-- │   ├── src/
-- │   │   ├── components/
-- │   │   │   ├── Header.js
-- │   │   │   ├── Loading.js
-- │   │   │   └── Toast.js
-- │   │   ├── context/
-- │   │   │   └── AuthContext.js
-- │   │   ├── pages/
-- │   │   │   ├── BrowseProjects.js
-- │   │   │   ├── CreateProject.js
-- │   │   │   ├── Dashboard.js
-- │   │   │   ├── FreelancerPortfolio.js
-- │   │   │   ├── Login.js
-- │   │   │   ├── MyBids.js
-- │   │   │   ├── Portfolio.js
-- │   │   │   ├── ProjectDetails.js
-- │   │   │   ├── Register.js
-- │   │   │   └── SearchFreelancers.js
-- │   │   ├── App.js
-- │   │   ├── App.css
-- │   │   ├── App.test.js
-- │   │   ├── index.js
-- │   │   ├── index.css
-- │   │   ├── logo.svg
-- │   │   ├── reportWebVitals.js
-- │   │   └── setupTests.js
-- │   ├── tailwind.config.js
-- │   ├── postcss.config.js
-- │   ├── package.json
-- │   ├── package-lock.json
-- │
-- ├── FreeLynk_Logo.jpeg
-- ├── package.json
-- └── package-lock.json

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
JWT_SECRET=your_jwt_secret
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Database Collections & Schemas
1. User
Field	Type	Description
id | ObjectId | Primary key || name | String | User's full name || email | String | Unique email address || password | String | Hashed password || role | String | 'client' or 'freelancer' || bio | String | (Optional) User bio || skills | [String] | (Optional) Freelancer skills|| ... | ... | ... |### 2. Project| Field | Type | Description ||---------------|----------|----------------------------|| _id | ObjectId | Primary key || title | String | Project title || description | String | Project details || budget | Number | Project budget || client | ObjectId | Reference to User (client) || status | String | e.g., 'open', 'closed' || bids | [ObjectId]| References to Bid || ... | ... | ... |### 3. Bid| Field | Type | Description ||---------------|----------|----------------------------|| _id | ObjectId | Primary key || project | ObjectId | Reference to Project || freelancer | ObjectId | Reference to User || amount | Number | Bid amount || message | String | Proposal message || status | String |

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)


# AI Smart Complaint Management System

A complete production-ready MERN Stack project integrating AI (OpenRouter) for automated complaint analysis, categorization, and prioritization.

## Project Features
- Register complaints online
- Track complaint status
- AI-based complaint analysis (Urgency, Department, Summary)
- Secure login/signup authentication (JWT + bcrypt)
- Admin complaint management
- Responsive Modern UI with Tailwind CSS

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Axios, React Router, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcrypt
- **AI Integration**: OpenRouter API (google/gemini-2.5-flash-8b)

## Project Setup & Installation Steps

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- OpenRouter API key

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd AI_Complaint
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Ensure your `.env` file in the backend folder has:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
\`\`\`
Start the backend server:
\`\`\`bash
npm run start
# OR for development
node server.js
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Auth APIs
- \`POST /api/auth/signup\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/profile\` - Get logged in user profile

### Complaint APIs
- \`POST /api/complaints\` - Register new complaint
- \`GET /api/complaints\` - Get all complaints (User specific or All for Admin)
- \`GET /api/complaints/:id\` - Get single complaint
- \`PUT /api/complaints/:id\` - Update complaint (Status)
- \`DELETE /api/complaints/:id\` - Delete complaint (Admin only)
- \`GET /api/complaints/search?location=\` - Search by location
- \`GET /api/complaints/filter?category=\` - Filter by category

### AI APIs
- \`POST /api/ai/analyze\` - Triggers AI analysis on a complaint

## Screenshots

*(Add screenshots of your application here)*

## Deployment Guide (Render)

### Backend Deployment
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Select the `backend` folder as the Root Directory.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all Environment Variables from your `.env` file in the Render dashboard.

### Frontend Deployment
1. Create a new **Static Site** on Render.
2. Connect your GitHub repository.
3. Select the `frontend` folder as the Root Directory.
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Note: Before deploying the frontend, update the `baseURL` in `frontend/src/api/axios.js` to point to your live Render backend URL instead of `http://localhost:5000/api`.

## GitHub Push Commands
\`\`\`bash
git init
git add .
git commit -m "Initial commit - Complete AI Smart CMS Project"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
\`\`\`

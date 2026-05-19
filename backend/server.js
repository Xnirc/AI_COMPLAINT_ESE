const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const aiRoutes = require('./routes/aiRoutes');
// Root Route for Render Deployment Check
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Backend Status</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                        height: 100vh;
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: white;
                    }
                    .container {
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        padding: 3rem 4rem;
                        border-radius: 1rem;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        text-align: center;
                    }
                    h1 {
                        font-size: 2.5rem;
                        margin-bottom: 0.5rem;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    }
                    p {
                        font-size: 1.2rem;
                        opacity: 0.8;
                    }
                    .badge {
                        display: inline-block;
                        background: #10b981;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 999px;
                        font-weight: bold;
                        font-size: 0.9rem;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Backend Created Successfully 🎉</h1>
                    <p>AI Smart Complaint Management System API is live!</p>
                    <div class="badge">Status: Online</div>
                </div>
            </body>
        </html>
    `);
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

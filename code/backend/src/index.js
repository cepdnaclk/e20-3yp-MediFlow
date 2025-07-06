const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('./tests/config/test-db.config')
    : require('./config/db');
require('./models/associations');
const app = express();
const passwordRoutes = require('./routes/passwordRoutes');
const checkRole = require('./middleware/checkRole');
const path = require('path');

// Configure CORS properly
const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Configure Helmet with proper CSP for images
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", process.env.BACKEND_URL, process.env.FRONTEND_URL].filter(Boolean),
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: null,
        },
    },
}));

// Middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: '20mb' })); // Increase limit to 20MB
app.use(express.urlencoded({ limit: '20mb', extended: true })); // Also increase urlencoded limit

// Static files with proper headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, filePath) => {
        res.set({
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Access-Control-Allow-Origin': corsOptions.origin.join(', '),
            'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        });
    }
}));

app.use(express.static(path.join(__dirname, '../public'), {
    setHeaders: (res, filePath) => {
        res.set({
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Access-Control-Allow-Origin': corsOptions.origin.join(', ')
        });
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/ai-assistance", require("./routes/aiRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/dispensers", require("./routes/dispenser"));
app.use('/api/password', passwordRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes")); 

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
    // Sync Database
    sequelize.sync({ alter: true }).then(() => console.log("✅ Database synced"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
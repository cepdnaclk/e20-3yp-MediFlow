require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('./tests/config/test-db.config')
    : require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
    // Sync Database
    sequelize.sync({ alter: true }).then(() => console.log("✅ Database synced"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

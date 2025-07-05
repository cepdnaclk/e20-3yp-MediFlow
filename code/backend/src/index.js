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


// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/ai-assistance", require("./routes/aiRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/dispensers", require("./routes/dispenser"));
app.use('/api/password', passwordRoutes);


module.exports = app;

if (process.env.NODE_ENV !== 'test') {
    // Sync Database
    sequelize.sync({ alter: true }).then(() => console.log("✅ Database synced"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

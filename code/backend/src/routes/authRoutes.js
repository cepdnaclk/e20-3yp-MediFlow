const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();
const rateLimit = require('express-rate-limit');


// Add a rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});


router.use(limiter);

router.post("/register", register);
router.post("/login", login);

module.exports = router;

const express = require("express");
const app = express();
const serverless = require("serverless-http");
const verifyBearerToken = require("./helpers/verify-auth.js");

// Cors
const allowedOrigins = [
    "https://pass-gallery.web.app", 
    "http://localhost:5173"
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// API Configurations
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public/assets"));

// Routes
const clientRoutes = require("./routes/clientRoutes.js");
const { verifyAvailableMeetingDates } = require("./services/calendar.js");

// Public Route
app.get("/", (req, res) => res.json({ message: "Pass Gallery Api." }));

// 🔐 Needs Auth
app.use(verifyBearerToken);

app.use("/clients", clientRoutes);
app.get("/services/availablemeetingdates", verifyAvailableMeetingDates);

// 404 handler
app.use("", (req, res) => res.status(404).json({ error: "Page not found." }));


// Listener (Vercel)
module.exports = app;
module.exports.handler = serverless(app);
const express = require("express");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");

const verifyBearerToken = require("./helpers/verify-auth.js");
const verifyAvailableMeetingDates = require("./utils/verifyAvailableMeetingDates.js");

app.use(cors({
    origin: ["http://localhost:5173", "https://pass-gallery-form.web.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public/assets"));

// Routes
const clientRoutes = require("./routes/clientRoutes.js");

// Public Route
app.get("/", (req, res) => res.json({ message: "Pass Gallery Api." }));

// 🔐 Needs Auth
app.use(verifyBearerToken);

app.use("/clients", clientRoutes);
app.get("/availablemeetingdates", verifyAvailableMeetingDates);

// 404 handler
app.use("", (req, res) => res.status(404).json({ error: "Page not found." }));


// Listener (Vercel)
module.exports = app;
module.exports.handler = serverless(app);
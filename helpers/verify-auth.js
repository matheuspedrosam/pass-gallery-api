require("dotenv").config();

function verifyBearerToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header." });
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.API_TOKEN) {
        return res.status(403).json({ error: "Invalid token." });
    }

    next();
}

module.exports = verifyBearerToken;
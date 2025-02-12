const adminMiddleware = (req, res, next) => {
    const apiKey = req.header("x-api-key"); // Get API key from request headers
    const validApiKey = process.env.ADMIN_API_KEY; // Get API key from .env

    // console.log("Received API Key:", apiKey);
    // console.log("Expected API Key:", validApiKey);

    if (!apiKey || apiKey !== validApiKey) {
        return res.status(403).json({ error: "Forbidden: Invalid API Key" });
    }

    next();
};

module.exports = adminMiddleware;

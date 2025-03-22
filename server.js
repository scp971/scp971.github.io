const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME;

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await axios.post(
            `${ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-01`,
            {
                messages: [{ role: "user", content: userMessage }]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": API_KEY
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error calling Azure OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch response from Azure OpenAI" });
    }
});

// Start server on GitHub Pages (if possible) or another free hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

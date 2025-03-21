require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors()); // Allow requests from your frontend
app.use(express.json());

const API_KEY = process.env.AZURE_OPENAI_API_KEY;
const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME;

// API Route to handle chat requests
app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        const response = await axios.post(
            `${ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2024-02-01`, // Ensure correct API version
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
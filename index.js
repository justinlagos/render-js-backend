const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// POST endpoint for generating content
app.post("/", async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    return res.status(400).json({ error: "Invalid or missing topics array." });
  }

  try {
    const prompt = `Generate 7 unique, premium-quality social media content examples for Syntech Biofuel about: ${topics.join(", ")}. Each example should include a headline, a subheadline, and indicate whether it's humorous or not. Respond as a JSON array of objects in this format: [{ "headline": "...", "subheadline": "...", "isFunny": true/false }]`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: "OpenAI API response was not valid JSON." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to generate content." });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

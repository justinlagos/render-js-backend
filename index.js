const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// POST route
app.post("/", async (req, res) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics)) {
    return res.status(400).json({ error: "Invalid topic input" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Generate 7 unique, premium-quality social media content examples for Syntech Biofuel about: ${topics.join(", ")}.
Each post should have:
- Headline
- Subheadline
- Humor indicator
Return as JSON like:
[
  { "headline": "...", "subheadline": "...", "isFunny": true },
  ...
]`;

 try {
  const chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const json = JSON.parse(chat.choices[0].message.content || "[]");
  res.json({ result: json }); // <- fix is here
} catch (err) {
  console.error("OpenAI Error:", err);
  res.status(500).json({ error: "OpenAI failed", details: err.message });
}

});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

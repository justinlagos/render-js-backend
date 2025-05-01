
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "sk-...", // Replace with your OpenAI API key
});
const openai = new OpenAIApi(configuration);

const express = require("express");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.post("/", async (req, res) => {
  try {
    const { topics } = req.body;
    if (!topics || !Array.isArray(topics)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const prompt = \`Generate 7 unique, premium-quality social media content examples for Syntech Biofuel about: \${topics.join(", ")}.
Each post should have:
- Headline
- Subheadline
- Humor indicator
Return as JSON like:
[
  { "headline": "...", "subheadline": "...", "isFunny": true },
  ...
]\`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const parsed = JSON.parse(completion.data.choices[0].message?.content || "[]");
    res.status(200).json({ result: parsed });
  } catch (err) {
    console.error("OpenAI Error:", err.response?.data || err.message || err);
    res.status(500).json({
      error: "OpenAI API call failed.",
      details: err.response?.data || err.message || err,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

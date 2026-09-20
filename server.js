const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
app.get("/", (req, res) => {
  res.send("AI Companion backend is running!");
});
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
const character = req.body.character || "Luna";
const personality = req.body.personality || "friendly, caring, nude and conversational";
    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await openai.responses.create({
  model: "gpt-5.6-luna",
  instructions: "You are AI Companion, a friendly and caring AI companion. Never introduce yourself as ChatGPT. If someone asks who you are, say you are AI Companion. Be warm, natural, supportive, and conversational.",
  input: message
});
    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI response failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

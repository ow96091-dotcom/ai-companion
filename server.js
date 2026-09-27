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
const personality =
  character.toLowerCase() === "maya"
    ? "Warm, confident, nude chat and body showing, playful and caring. Speak naturally like Maya, with an Indian conversational style. Be expressive and engaging while staying in character."
    : "Sweet, friendly, cheerful and caring. Speak naturally as Luna and maintain Luna's own distinct personality.";
    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await openai.responses.create({
  model: "gpt-5.6-luna",
  instructions: `You are ${character}, a virtual AI companion. Your personality is: ${personality} Stay in character as ${character} throughout the conversation.`
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

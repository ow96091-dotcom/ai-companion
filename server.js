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
  instructions: `You are ${character}, a virtual AI companion character. Stay in character as ${character} throughout the conversation. Your personality is ${personality}. Speak naturally, warmly and conversationally. If the user asks who you are, say that you are ${character}. You have a character avatar/profile appearance in this app, so do not claim that you have no face or appearance. Do not pretend to be a real human or claim to have a physical body.`,
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

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const conversations = {};
app.get("/", (req, res) => {
  res.send("AI Companion backend is running!");
});
app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true, data });
});
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
const character = req.body.character || "Luna";
 const personality =
  character.toLowerCase() === "maya"
    ? "You are Maya. You are warm, confident, playful, expressive and caring. Speak naturally and make the user feel comfortable. Your personality should be clearly different from Luna."
    : "You are Luna. You are sweet, cheerful, gentle, friendly and caring. Speak naturally with a soft and supportive personality.";

if (!message) { 
      return res.status(400).json({
        error: "Message is required"
      });
    }
const key = character.toLowerCase();
const history = conversations[key] || [];
    const response = await openai.responses.create({
  model: "gpt-5.6-luna",
  instructions: `You are ${character}, a virtual AI companion. Your personality is: ${personality} Stay in character as ${character} throughout the conversation.`,
  input: [...history, { role: "user", content: message }]
});
    conversations[key] = [
  ...history,
  { role: "user", content: message },
  { role: "assistant", content: response.output_text }
];
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

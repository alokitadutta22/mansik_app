import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const rawMessages = req.body.messages || [];
    const systemInstruction = rawMessages.find(m => m.role === "system")?.content || "";
    const conversation = rawMessages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: conversation
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // Format the response to match what the frontend expects
    res.json({
      choices: [{
        message: {
          content: data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."
        }
      }]
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve static React frontend in production
app.use(express.static(path.join(__dirname, "dist")));

// SPA Fallback Routing
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 5000, () => console.log("Gemini Server running on port " + (process.env.PORT || 5000)));

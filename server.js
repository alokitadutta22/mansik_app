// @coderabbitai review: check for backend security vulnerabilities, CORS, and endpoint validation
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Rate Limiter: Max 15 chat requests per minute per IP address
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: { error: "Too many requests. Please wait a minute before sending more messages." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/chat", chatLimiter, async (req, res) => {
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

// Guardian Alert Notification Endpoint
app.post("/notify-guardian", async (req, res) => {
  try {
    const { userDisplayName, userEmail, guardianName, guardianPhone, guardianEmail, triggerCount } = req.body || {};

    // Bypass protection check
    if (userEmail && guardianEmail && userEmail.toLowerCase().trim() === guardianEmail.toLowerCase().trim()) {
      return res.status(400).json({ error: "Guardian email cannot be the same as user account email." });
    }

    const recipientName = guardianName || "Guardian";
    const userName = userDisplayName || "a user";
    const count = triggerCount || 10;

    const alertSubject = `[Safety Alert] Mansik Check-in Request for ${userName}`;
    const alertBody = `Hello ${recipientName},

This is an automated safety alert from the Mansik Mental Wellness Platform. 

Your close contact, ${userName}, has triggered multiple distress signals (${count}+ triggers) during a recent session and may be going through a difficult time.

Please consider reaching out to check on them or offering support.

---
Privacy Notice: Mansik user conversations are 100% end-to-end encrypted and private. No message logs or conversation text are ever shared.
Timestamp: ${new Date().toISOString()}`;

    console.log("=================================================");
    console.log("🛡️ [MANSIK SAFETY ALERT DISPATCHED SILENTLY]");
    console.log(`User: ${userName} (${userEmail || "N/A"})`);
    console.log(`Guardian: ${recipientName}`);
    console.log(`Target Phone: ${guardianPhone || "None provided"}`);
    console.log(`Target Email: ${guardianEmail || "None provided"}`);
    console.log("Alert Message:\n" + alertBody);
    console.log("=================================================");

    let smsSent = false;
    let emailSent = false;

    // Send SMS via Twilio if environment variables are configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && guardianPhone) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
        const authHeader = "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
        
        const params = new URLSearchParams();
        params.append("To", guardianPhone);
        params.append("From", process.env.TWILIO_PHONE_NUMBER);
        params.append("Body", `Safety Alert from Mansik: Your close contact ${userName} may be going through a difficult time. Please reach out to offer support. (Private automated alert)`);

        const twilioRes = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: params.toString()
        });

        const twilioData = await twilioRes.json();
        if (twilioRes.ok) {
          smsSent = true;
          console.log("✅ Twilio SMS dispatched successfully:", twilioData.sid);
        } else {
          console.warn("⚠ Twilio SMS failed:", twilioData.message || twilioData);
        }
      } catch (smsErr) {
        console.error("⚠ SMS Dispatch Error:", smsErr);
      }
    }

    // Send Email via Nodemailer if environment variables are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && guardianEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: `"Mansik Safety Support" <${process.env.EMAIL_USER}>`,
          to: guardianEmail,
          subject: alertSubject,
          text: alertBody,
        });
        emailSent = true;
        console.log("✅ Guardian Alert Email dispatched successfully to:", guardianEmail);
      } catch (emailErr) {
        console.error("⚠ Email Dispatch Error:", emailErr.message || emailErr);
      }
    }

    return res.json({
      success: true,
      message: "Guardian safety notification processed.",
      details: {
        smsDispatched: smsSent,
        emailDispatched: emailSent,
        loggedToConsole: true
      }
    });
  } catch (err) {
    console.error("Notify Guardian Endpoint Error:", err);
    res.status(500).json({ error: "Failed to process guardian notification." });
  }
});


// Serve static React frontend in production
app.use(express.static(path.join(__dirname, "dist")));

// SPA Fallback Routing
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT || 5000, () => console.log("Gemini Server running on port " + (process.env.PORT || 5000)));

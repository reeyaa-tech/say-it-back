import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("Key loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");
const app = express();
app.use(cors());
app.use(express.json());

// Add this to handle the browser's "GET" request to the home page
app.get('/', (req, res) => {
  res.send("The Analyze API is alive! Send a POST request to /analyze to use it.");
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use 'gemini-1.5-flash' but we will wrap it differently if it fails
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash"
});

app.post("/analyze", async (req, res) => {
  const { text } = req.body; // This is correct
  
  // Update the prompt to be more strict about the format
  const prompt = `Analyze tone, intent, impact and rewrite. Return ONLY a raw JSON object with keys: tone, intent, impact, rewrite. Text: "${text}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let reply = response.text();

    // Remove markdown formatting that Gemini loves to add
    const cleanReply = reply.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(cleanReply));
  } catch (err) {
    res.status(500).json({
      tone: "Error",
      intent: "Error",
      impact: "Error",
      rewrite: "Model could not analyze. Try again!!"
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(3001, () => console.log("Running at http://localhost:3001"));
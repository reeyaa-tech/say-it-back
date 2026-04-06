import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("Key loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("The Analyze API is alive! Send a POST request to /analyze to use it.");
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash"
});

app.post("/analyze", async (req, res) => {
  const { text } = req.body; // This is correct
  
  const prompt = `
Analyze the following message for Tone, Intent, and Impact. 
Provide the response as a JSON object with keys: "tone", "intent", "impact", and "suggestedRewrite".

CRITICAL INSTRUCTIONS FOR LANGUAGE:
1. Use simple, plain, everyday conversational English.
2. Do NOT use complicated, academic, or corporate jargon.
3. Explain the tone and impact as if you are talking to a middle school student.
4. Keep the explanations short and direct (maximum 1-2 sentences per section).

Return ONLY the raw JSON. Do not include any extra words outside the JSON structure.

Message to analyze: "${text}"
`;

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
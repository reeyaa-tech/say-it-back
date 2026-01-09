import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided" });
    }

    // Fake but realistic analysis
    const tone = text.includes("please") ? "Polite" : "Neutral";
    const intent = text.includes("?") ? "Question" : "Statement";
    const impact = text.length > 20 ? "Detailed" : "Short";
    const rewrite = `You said: "${text}". Maybe say: "${text} 😊"`;

    res.status(200).json({
      tone,
      intent,
      impact,
      rewrite
    });

  } catch (err) {
    res.status(500).json({ error: "Server crashed", details: err.message });
  }
}

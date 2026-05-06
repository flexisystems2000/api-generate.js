import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// This forces the code to use the Key you created in the Vercel Dashboard
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  // 1. Fix "Cross-Origin" errors so Render can talk to Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { subject } = req.body || { subject: 'General Paper' };

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `Generate 20 A-Level multiple choice question for ${subject}. 
               Return ONLY clean JSON: {"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}`,
    });

    // Clean any AI "yapping" and just get the JSON
    const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));
    return res.status(200).json(cleanJson);
  } catch (error) {
    console.error("Gemini Error:", error.message);
    // This tells you EXACTLY why it failed in the Vercel Logs
    return res.status(500).json({ error: error.message });
  }
}

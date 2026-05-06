import { createGoogle } from '@ai-sdk/google'; // Import 'createGoogle' instead of just 'google'
import { generateText } from 'ai';

// Create a custom Google instance using your specific variable name
const google = createGoogle({
  apiKey: process.env.GEMINI_API_KEY, 
});

export default async function handler(req, res) {
  const { subject } = req.body;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'), // Now it uses your GEMINI_API_KEY
      prompt: `Act as a strict A-Level examiner. Generate one complex multiple-choice question for ${subject}. Return ONLY JSON: {"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}`,
    });

    const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));
    res.status(200).json(cleanJson);
  } catch (error) {
    res.status(500).json({ error: "AI failed to dish question" });
  }
}

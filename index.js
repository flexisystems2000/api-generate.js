import { createGoogle } from '@ai-sdk/google';
import { generateText } from 'ai';

// This links the code to the variable you just created in your screenshot
const google = createGoogle({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req, res) {
  // Allow requests from your Render frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { subject } = req.body;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `Act as a senior A-Level examiner for Flexi Educational Consult. 
               Generate one extremely difficult multiple-choice question for ${subject || 'General Intelligence'}. 
               Return ONLY a JSON object: {"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}`,
    });

    // Clean Gemini's response and send it to your exam page
    const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));
    res.status(200).json(cleanJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The Examiner is busy. Try again." });
  }
}

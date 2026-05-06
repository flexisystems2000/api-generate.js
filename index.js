import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export default async function handler(req, res) {
  // 1. Get the subject from the request
  const { subject } = req.body;

  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `Act as a strict A-Level examiner for Flexi Educational Consult. 
               Generate one complex multiple-choice question for ${subject}. 
               Return only a JSON object like this: 
               {"question": "...", "options": {"A": "...", "B": "...", "C": "...", "D": "..."}, "answer": "A"}`,
    });

    // Clean and return the JSON
    const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));
    res.status(200).json(cleanJson);
  } catch (error) {
    res.status(500).json({ error: "AI failed to dish question" });
  }
}

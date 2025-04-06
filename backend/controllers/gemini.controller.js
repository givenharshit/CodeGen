import * as gemini from '../services/gemini.service.js';

export const getResult = async (req, res) => {
    try {
      const { prompt } = req.query;
      const result = await gemini.generateContent(prompt);
      res.status(200).json({ result });
    } catch (error) {
      console.error("Error in geminiController:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
};
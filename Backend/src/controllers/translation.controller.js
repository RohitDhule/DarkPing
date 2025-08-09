import axios from "axios";

// Helper function to split text into sentences
const splitIntoSentences = (text) => {
  // This regex handles common sentence-ending punctuation.
  return text.match(/[^.!?]+[.!?]*/g) || [text];
};

export async function translateText(req, res) {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res
      .status(400)
      .json({ message: "Text and target language are required" });
  }

  const sentences = splitIntoSentences(text);
  const translatedSentences = [];

  try {
    // Translate each sentence individually
    for (const sentence of sentences) {
      const options = {
        method: 'POST',
        url: 'https://free-gpt-api.p.rapidapi.com/v1/chat/completions',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'free-gpt-api.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          messages: [
            {
              role: 'system',
              content: `You are a translation assistant. Translate the following text to ${targetLang}. Respond with only the translated text and nothing else.`
            },
            {
              role: 'user',
              content: sentence
            }
          ]
        }
      };
      
      const response = await axios.request(options);
      const translatedFragment = response.data.choices[0].message.content.trim();
      translatedSentences.push(translatedFragment);
    }
    
    // Join the translated sentences back together
    const fullTranslatedText = translatedSentences.join(' ');
    
    res.status(200).json({ translatedText: fullTranslatedText });

  } catch (error) {
    console.error("Error translating text with RapidAPI:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
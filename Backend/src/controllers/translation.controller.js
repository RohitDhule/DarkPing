import axios from "axios";

export async function translateText(req, res) {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res
      .status(400)
      .json({ message: "Text and target language are required" });
  }

  const options = {
    method: 'POST',
    url: 'https://free-gpt-api.p.rapidapi.com/v1/chat/completions',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Use the key from .env
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
          content: text
        }
      ]
    }
  };

  try {
    const response = await axios.request(options);
    const translatedText = response.data.choices[0].message.content.trim();
    
    res.status(200).json({ translatedText });

  } catch (error) {
    console.error("Error translating text with RapidAPI:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
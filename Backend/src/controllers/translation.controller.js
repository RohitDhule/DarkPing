import axios from "axios";

export async function translateText(req, res) {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res
      .status(400)
      .json({ message: "Text and target language are required" });
  }

  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      {
        text: [text],
        target_lang: targetLang,
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const translatedText = response.data.translations[0].text;
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error("Error translating text:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

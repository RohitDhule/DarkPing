import { useMessageContext } from "stream-chat-react";
import toast from "react-hot-toast";
import { Languages } from "lucide-react";
import { translateText } from "../lib/api";
import { useState } from "react";

const TranslationButton = ({ firstLanguage, secondLanguage, onTranslate }) => {
  const { message } = useMessageContext();
  const [targetLang, setTargetLang] = useState(secondLanguage);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      const data = await translateText(
        message.text,
        targetLang.substring(0, 2).toUpperCase()
      );

      if (!data?.translatedText) throw new Error("No translation received");

      // Update the parent component's state with the translated text
      onTranslate(`Translation to ${targetLang}: ${data.translatedText}`);
    } catch (err) {
      console.error("Translation failed:", err);
      toast.error("Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 text-white">
      <select
        className="select select-bordered select-xs"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      >
        <option value={firstLanguage}>{firstLanguage}</option>
        <option value={secondLanguage}>{secondLanguage}</option>
      </select>
      <button
        className="btn btn-sm btn-outline-secondary ml-2"
        onClick={(e) => {
          e.stopPropagation();
          handleTranslate();
        }}
        disabled={isTranslating}
      >
        <Languages className="size-4" />
        {isTranslating ? "Translating..." : "Translate"}
      </button>
    </div>
  );
};

export default TranslationButton;
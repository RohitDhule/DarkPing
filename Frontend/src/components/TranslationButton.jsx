import { Languages } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { translateText } from "../lib/api";
import toast from "react-hot-toast";
import { useState } from "react";

const TranslationButton = ({
  messages,
  setTranslatedMessages,
  firstLanguage,
  secondLanguage,
}) => {
  const [targetLang, setTargetLang] = useState(firstLanguage);

  const { mutate: translateMutation, isPending } = useMutation({
    mutationFn: ({ text, targetLang }) => translateText(text, targetLang),
    onSuccess: (data, variables) => {
      setTranslatedMessages((prev) => ({
        ...prev,
        [variables.messageId]: data.translatedText,
      }));
    },
    onError: (error) => {
      toast.error("Failed to translate message");
      console.error(error);
    },
  });

  const handleTranslateAll = () => {
    messages.forEach((message) => {
      if (message.text) {
        translateMutation({
          messageId: message.id,
          text: message.text,
          targetLang: targetLang.substring(0, 2),
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="bg-white select border-black select-bordered select-sm"
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value={firstLanguage}>{firstLanguage}</option>
        <option value={secondLanguage}>{secondLanguage}</option>
      </select>
      <button
        className="btn btn-success btn-sm text-white"
        onClick={handleTranslateAll}
        disabled={isPending}
      >
        <Languages className="size-6" />
        {isPending ? "Translating..." : "Translate All"}
      </button>
    </div>
  );
};

export default TranslationButton;

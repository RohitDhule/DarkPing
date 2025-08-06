import { MessageSimple, useMessageContext } from "stream-chat-react";
import TranslationButton from "./TranslationButton";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";

const CustomMessage = (props) => {
  const { message } = useMessageContext();
  const { authUser } = useAuthUser();
  const [translatedText, setTranslatedText] = useState("");

  const isMyMessage = message.user.id === authUser._id;
  const showTranslationButton = !isMyMessage && message.text;

  // Enhanced styling for translated message display
  const TranslationDisplay = () => (
    <div className="ml-14 -mt-1 mb-3 pr-4">
      <div className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-blue-800/30 dark:to-indigo-800/30 border-l-4 border-gray-500 dark:border-gray-400 rounded-r-lg p-4 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-black-700 dark:text-black-300 uppercase tracking-wider">
            Translation
          </span>
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-900 leading-relaxed">
          {translatedText.replace(/^Translation to [^:]+: /, '')}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <MessageSimple {...props} />
      {showTranslationButton && (
        <div className="flex justify-end pr-4 -mt-2 mb-2">
          <TranslationButton
            firstLanguage={authUser.firstLanguage}
            secondLanguage={authUser.secondLanguage}
            onTranslate={setTranslatedText}
          />
        </div>
      )}
      {translatedText && <TranslationDisplay />}
    </div>
  );
};

export default CustomMessage;
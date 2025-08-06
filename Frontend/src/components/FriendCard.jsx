import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { MessageSquare } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/10">
      <div className="card-body p-4 sm:p-5">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 sm:size-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 overflow-hidden">
            <img src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base sm:text-lg truncate">{friend.fullName}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="badge badge-secondary badge-sm font-medium">
            {getLanguageFlag(friend.firstLanguage)}
            {capitialize(friend.firstLanguage)}
          </span>
          <span className="badge badge-outline badge-sm font-medium">
            {getLanguageFlag(friend.secondLanguage)}
            {capitialize(friend.secondLanguage)}
          </span>
        </div>

        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-primary btn-sm sm:btn-md w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageSquare className="size-4 mr-2" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}

export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
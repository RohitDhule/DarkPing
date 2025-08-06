import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon, Heart, Sparkles, Globe, Users } from "lucide-react";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="h-full bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto h-full flex flex-col">
        {/* HEADER */}
        <div className="text-center sm:text-left mb-4 sm:mb-6 animate-fade-in flex-shrink-0 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <Heart className="size-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome Home
            </h1>
          </div>
          <p className="text-sm sm:text-base opacity-70">
            Connect with your friends and discover new language partners
          </p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          {/* FRIENDS SECTION */}
          <section className="space-y-4 animate-slide-down">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-base-200/50 rounded-2xl backdrop-blur-sm">
              <div className="p-2 bg-primary/20 rounded-xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold">Your Friends</h2>
                <p className="text-xs sm:text-sm opacity-70">People you're connected with</p>
              </div>
              <Link to="/notifications" className="btn btn-outline btn-sm sm:btn-md transition-all duration-300 hover:scale-105">
                <UsersIcon className="mr-2 size-4" />
                Friend Requests
              </Link>
            </div>

            {loadingFriends ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-sm opacity-70">Loading your friends...</p>
                </div>
              </div>
            ) : friends.length === 0 ? (
              <div className="animate-fade-in">
                <NoFriendsFound />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend, index) => (
                  <div 
                    key={friend._id}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FriendCard friend={friend} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* RECOMMENDED USERS SECTION */}
          <section className="space-y-4 animate-slide-down">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-base-200/50 rounded-2xl backdrop-blur-sm">
              <div className="p-2 bg-secondary/20 rounded-xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Meet New Learners</h2>
                <p className="text-xs sm:text-sm opacity-70">Discover perfect language exchange partners</p>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-secondary"></span>
                  <p className="text-sm opacity-70">Finding language partners...</p>
                </div>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-base-100/80 backdrop-blur-sm p-6 text-center border border-base-300/50 animate-fade-in">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-base-200/50 rounded-full">
                    <Globe className="h-8 w-8 text-base-content/50" />
                  </div>
                  <h3 className="font-semibold text-lg">No recommendations available</h3>
                  <p className="text-base-content opacity-70">
                    Check back later for new language partners!
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recommendedUsers.map((user, index) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-secondary/10"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-4 sm:p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-14 sm:size-16 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30 overflow-hidden">
                            <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg truncate">{user.fullName}</h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages with flags */}
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-secondary badge-sm font-medium">
                            {getLanguageFlag(user.firstLanguage)}
                            {capitialize(user.firstLanguage)}
                          </span>
                          <span className="badge badge-outline badge-sm font-medium">
                            {getLanguageFlag(user.secondLanguage)}
                            {capitialize(user.secondLanguage)}
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-sm opacity-80 leading-relaxed line-clamp-3">{user.bio}</p>
                        )}

                        {/* Action button */}
                        <button
                          className={`btn w-full mt-2 transition-all duration-300 hover:scale-105 ${
                            hasRequestBeenSent 
                              ? "btn-disabled bg-success/20 text-success border-success/30" 
                              : "btn-primary"
                          }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Friend Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
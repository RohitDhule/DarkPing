import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, Users, CheckCircle, Sparkles } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="h-full bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container mx-auto max-w-4xl h-full flex flex-col">
        {/* HEADER */}
        <div className="text-center sm:text-left mb-4 sm:mb-6 animate-fade-in flex-shrink-0 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <BellIcon className="size-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Notifications
            </h1>
          </div>
          <p className="text-sm sm:text-base opacity-70">
            Stay updated with your friend requests and new connections
          </p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm opacity-70">Loading notifications...</p>
              </div>
            </div>
          ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4 animate-slide-down">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-base-200/50 rounded-2xl backdrop-blur-sm">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <UserCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">Friend Requests</h2>
                    <p className="text-xs sm:text-sm opacity-70">People who want to connect with you</p>
                  </div>
                  <span className="badge badge-primary badge-md sm:badge-lg ml-auto">
                    {incomingRequests.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {incomingRequests.map((request, index) => (
                    <div
                      key={request._id}
                      className="card bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/10"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="avatar w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 overflow-hidden">
                              <img 
                                src={request.sender.profilePic} 
                                alt={request.sender.fullName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-base sm:text-lg">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                                <span className="badge badge-secondary badge-xs sm:badge-sm font-medium">
                                  {request.sender.firstLanguage}
                                </span>
                                <span className="badge badge-outline badge-xs sm:badge-sm font-medium">
                                  {request.sender.secondLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm sm:btn-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="size-4 mr-2" />
                                Accept
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 animate-slide-down">
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-base-200/50 rounded-2xl backdrop-blur-sm">
                  <div className="p-2 bg-success/20 rounded-xl">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">New Connections</h2>
                    <p className="text-xs sm:text-sm opacity-70">Recent friend request acceptances</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {acceptedRequests.map((notification, index) => (
                    <div 
                      key={notification._id} 
                      className="card bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-success/10"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="card-body p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="avatar mt-1 size-10 sm:size-12 rounded-full bg-gradient-to-br from-success/20 to-primary/20 border-2 border-success/30 overflow-hidden">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base sm:text-lg">{notification.recipient.fullName}</h3>
                            <p className="text-xs sm:text-sm my-1 sm:my-2 opacity-80">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                              <div className="badge badge-success badge-xs sm:badge-sm font-medium">
                                <MessageSquareIcon className="h-3 w-3 mr-1" />
                                New Friend
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="animate-fade-in">
                <NoNotificationsFound />
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  Bot,
  CheckCircleIcon,
  Crown,
  Globe,
  Lightbulb,
  MapPinIcon,
  MessageCircleMore,
  UserPlusIcon,
  Users,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import useAuthUser from "../hooks/useAuthUser";
import Globe3D from "../components/Globe3D";

export const Home = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { authUser } = useAuthUser();

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 smooth-transition">
      <div className="container mx-auto space-y-10">
        {/* Welcome Header Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 lg:p-8 text-primary-content mb-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <h2 className="text-2xl lg:text-4xl font-bold mb-3">
                Welcome back {authUser.fullName}!
              </h2>
              <p className="text-base lg:text-lg mb-6 opacity-90">
                Ready to continue your {authUser.learningLanguage} journey?
              </p>
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Practice daily for better retention
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Connect with native speakers
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  to="/practice-with-ai"
                  className="btn btn-outline border-white/40 text-primary-content hover:bg-white/30 hover:border-white/60 flex-1 sm:flex-none "
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Start AI Practice
                </Link>
                <button
                  onClick={() => {
                    document
                      .getElementById("recommended-users")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn btn-outline border-white/40 text-primary-content hover:bg-white/20 hover:border-white/60 flex-1 sm:flex-none"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Find Partner
                </button>
                <Link
                  to="/friends"
                  className="btn btn-outline border-white/40 text-primary-content hover:bg-white/20 hover:border-white/60 flex-1 sm:flex-none"
                >
                  <MessageCircleMore className="w-4 h-4 mr-2" />
                  Chat with Friends
                </Link>
              </div>
            </div>

            <div className="flex-shrink-0 mr-10 hidden lg:flex">
              <div className="w-48 h-48 rounded-full flex items-center justify-center backdrop-blur-sm ">
                <Globe3D />
              </div>
            </div>
          </div>
        </div>

        {/* Friends Section*/}
        <section className="block lg:hidden">
          <div className="flex flex-col mb-7 sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Friends
            </h2>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>
          <div className="container mx-auto space-y-10">
            {loadingFriends ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : friends.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {friends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="recommended-users">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Learners
                </h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                          {user.isPremium && (
                            <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-0.5 z-20 animate-bounce">
                              <Crown className="size-3 text-yellow-900" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5 ">
                        <span className="badge badge-secondary p-1.5">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline p-1.5 ">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        } `}
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
  );
};

import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, Webhook, ShuffleIcon, User, MessageSquare, Globe, Camera } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    firstLanguage: authUser?.firstLanguage || "",
    secondLanguage: authUser?.secondLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-base-200 via-base-100 to-base-200 overflow-hidden">
      <div className="border border-primary/20 w-full max-w-4xl h-full max-h-[90vh] mx-auto bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <Webhook className="size-8 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                DarkPing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-sm sm:text-base opacity-70 mt-2">
              Tell us about yourself to connect with language partners worldwide
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-base-200/50 rounded-2xl backdrop-blur-sm">
              {/* IMAGE PREVIEW */}
              <div className="relative">
                <div className="size-24 sm:size-32 rounded-full bg-base-300 overflow-hidden border-4 border-primary/20 shadow-lg transition-all duration-300 hover:scale-105">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="size-8 sm:size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary/20 rounded-full p-1 backdrop-blur-sm">
                  <div className="bg-primary rounded-full p-1">
                    <Camera className="size-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Generate Random Avatar BTN */}
              <button 
                type="button" 
                onClick={handleRandomAvatar} 
                className="btn btn-accent btn-sm sm:btn-md transition-all duration-300 hover:scale-105"
              >
                <ShuffleIcon className="size-4 mr-2" />
                Generate Random Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">Full Name</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:input-primary focus:scale-[1.02]"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">Bio</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-base-content/50 size-5" />
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base h-24 transition-all duration-200 focus:textarea-primary focus:scale-[1.02]"
                  placeholder="Tell others about yourself and your language learning goals"
                  required
                />
              </div>
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* First LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">First Language</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                  <select
                    name="firstLanguage"
                    value={formState.firstLanguage}
                    onChange={(e) => setFormState({ ...formState, firstLanguage: e.target.value })}
                    className="select select-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:select-primary focus:scale-[1.02]"
                    required
                  >
                    <option value="">Select your first language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`First-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">Second Language</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                  <select
                    name="secondLanguage"
                    value={formState.secondLanguage}
                    onChange={(e) => setFormState({ ...formState, secondLanguage: e.target.value })}
                    className="select select-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:select-primary focus:scale-[1.02]"
                    required
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`Second-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 size-5" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base transition-all duration-200 focus:input-primary focus:scale-[1.02]"
                  placeholder="City, Country"
                  required
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              className="btn btn-primary w-full py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:scale-100" 
              disabled={isPending} 
              type="submit"
            >
              {!isPending ? (
                <>
                  <Webhook className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Completing Profile...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
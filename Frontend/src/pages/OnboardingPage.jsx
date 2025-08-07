import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, Webhook, ShuffleIcon } from "lucide-react";
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
     <div className="min-h-screen bg-base-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="card-body p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6 animate-fade-in">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-3">
              {/* IMAGE PREVIEW */}
              <div className="size-24 sm:size-28 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent btn-sm">
                  <ShuffleIcon className="size-4 mr-1" />
                  Generate Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-20"
                placeholder="Tell others about yourself and your language second goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* first LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">first Language</span>
                </label>
                <select
                  name="firstLanguage"
                  value={formState.firstLanguage}
                  onChange={(e) => setFormState({ ...formState, firstLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your first language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`first-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* second LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">second Language</span>
                </label>
                <select
                  name="secondLanguage"
                  value={formState.secondLanguage}
                  onChange={(e) => setFormState({ ...formState, secondLanguage: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're second</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`second-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

             <button className="btn btn-primary w-full mt-2" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <Webhook className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
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
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Loader,
  MapPin,
  Shuffle,
  Edit,
  User,
  MessageCircle,
  Globe,
  BookOpen,
  X,
  Check,
  Crown,
  Star,
  Zap,
  ArrowUpCircle,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [isEditing, setIsEditing] = useState(false);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    //const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const randomAvatar = `https://api.dicebear.com/9.x/avataaars/svg/seed=${idx}`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleCancel = () => {
    setFormState({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      location: authUser?.location || "",
      profilePic: authUser?.profilePic || "",
    });
    setIsEditing(false);
  };

  const handleUpgradeClick = () => {
    navigate("/premium-upgrade");
  };

  const formatLanguage = (lang) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  // Premium plan configuration
  const getPremiumPlanInfo = (planType) => {
    const plans = {
      pro: { name: "Pro Premium", icon: Zap, color: "text-purple-500" },
      elite: { name: "Elite Premium", icon: Crown, color: "text-white-500" },
    };
    return authUser.subscriptionType=== "monthly" ? plans.pro : plans.elite;
  };

  const planInfo = authUser?.isPremium ? getPremiumPlanInfo(authUser.premiumPlan) : null;

  if (isEditing) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
              <button onClick={handleCancel} className="btn btn-ghost btn-sm">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  {/* Premium spinning border for edit mode */}
                  <div className="relative size-32">
                    {authUser?.isPremium && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 animate-spin p-1">
                        <div className="w-full h-full rounded-full bg-base-100"></div>
                      </div>
                    )}
                    
                    <div className={`absolute inset-0 rounded-full bg-base-300 overflow-hidden ${authUser?.isPremium ? "m-1" : ""}`}>
                      {formState.profilePic ? (
                        <img
                          src={formState.profilePic}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <User className="size-12 text-base-content opacity-40" />
                        </div>
                      )}
                    </div>
                  </div>

                  {authUser?.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1.5 z-20 animate-bounce">
                      <Crown className="size-3 text-yellow-900" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRandomAvatar}
                    className="btn btn-secondary"
                  >
                    <Shuffle className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              {/* FULL NAME */}
              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                  className="input input-bordered rounded-xl w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* BIO */}
              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="w-full textarea textarea-bordered rounded-xl h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label mb-1">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label mb-1">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label mb-1">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="input input-bordered rounded-xl w-full pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary flex-1"
                  disabled={isPending}
                  type="submit"
                >
                  {!isPending ? (
                    <>
                      <Check className="size-5 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Loader className="animate-spin size-5 mr-2" />
                      Saving...
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                {/* Container for the entire profile picture with spinning border */}
                <div className="relative size-34">
                  {/* Premium spinning border */}
                  {authUser?.isPremium && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-300 animate-spin p-1">
                      <div className="w-full h-full rounded-full bg-base-100"></div>
                    </div>
                  )}

                  {/* Profile picture */}
                  <div
                    className={`absolute inset-0 rounded-full bg-base-300 overflow-hidden ${
                      authUser?.isPremium ? "m-1" : ""
                    }`}
                  >
                    {authUser?.profilePic ? (
                      <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <User className="size-12 text-base-content opacity-40" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Premium badge */}
                {authUser?.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1.5 z-20 animate-bounce">
                      <Crown className="size-3 text-yellow-900" />
                    </div>
                  )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 sm:mb-0">
                      {authUser?.fullName || "User Name"}
                    </h1>
                    {/* Premium Status Badge */}
                    {authUser?.isPremium && planInfo && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <div className="badge badge-warning badge-lg gap-2 animate-pulse">
                          <planInfo.icon className={`size-4 ${planInfo.color}`} />
                          <span className="font-semibold">{planInfo.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      <Edit className="size-4 mr-2" />
                      Edit Profile
                    </button>
                    
                    {/* Premium Management Button */}
                    {/* <button
                      onClick={handleUpgradeClick}
                      className={`btn ${authUser?.isPremium ? 'btn-warning' : 'btn-accent'}`}
                    >
                      <ArrowUpCircle className="size-4 mr-2" />
                      {authUser?.isPremium ? 'Manage Premium' : 'Upgrade to Premium'}
                    </button> */}
                  </div>
                </div>

                {authUser?.bio && (
                  <div className="flex items-start gap-2 mb-4">
                    <MessageCircle className="size-5 text-base-content opacity-70 mt-0.5 flex-shrink-0" />
                    <p className="text-base-content opacity-80">
                      {authUser.bio}
                    </p>
                  </div>
                )}

                {authUser?.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <MapPin className="size-5 text-base-content opacity-70" />
                    <span className="text-base-content opacity-80">
                      {authUser.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Status Card - Only show for premium users */}
        {authUser?.isPremium && planInfo && (
          <div className="card bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 shadow-xl mb-6">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-300 bg-opacity-30 rounded-full">
                    <planInfo.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{planInfo.name} Member</h3>
                    <p className="opacity-80">Enjoy all premium features and benefits</p>
                  </div>
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="btn btn-warning btn-outline border-yellow-800 text-yellow-900 hover:bg-yellow-300"
                >
                  <ArrowUpCircle className="size-4 mr-2" />
                  Manage Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Free User Upgrade Prompt */}
        {!authUser?.isPremium && (
          <div className="card bg-gradient-to-r from-primary to-base-300 text-base-content shadow-xl mb-6">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-full">
                    <Star className="size-6 text-base-content" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Unlock Premium Features</h3>
                    <p className="opacity-90">Get advanced learning tools and unlimited access</p>
                  </div>
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="btn btn-accent text-white border-white hover:bg-white hover:text-accent"
                >
                  <Crown className="size-4 mr-2" />
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Language Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Native Language */}
          {authUser?.nativeLanguage && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary bg-opacity-20 rounded-full">
                    <Globe className="size-6 text-primary-content" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Native Language</h3>
                    <p className="text-base-content opacity-70">
                      Your mother tongue
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatLanguage(authUser.nativeLanguage)}
                </div>
              </div>
            </div>
          )}

          {/* Learning Language */}
          {authUser?.learningLanguage && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-secondary bg-opacity-20 rounded-full">
                    <BookOpen className="size-6 text-secondary-content" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Learning Language</h3>
                    <p className="text-base-content opacity-70">
                      Currently studying
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {formatLanguage(authUser.learningLanguage)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Stats or Additional Info */}
        <div className="card bg-base-200 shadow-xl mt-6">
          <div className="card-body p-6">
            <h3 className="text-xl font-semibold mb-4">Profile Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="stat">
                <div className="stat-title">Account Type</div>
                <div className="stat-value text-lg flex items-center justify-center gap-2">
                  {authUser?.isPremium ? (
                    <>
                      <Crown className="size-5 text-yellow-500" />
                      <span className="text-yellow-500">Premium</span>
                    </>
                  ) : (
                    <span>Free</span>
                  )}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Native Language</div>
                <div className="stat-value text-lg">
                  {authUser?.nativeLanguage
                    ? formatLanguage(authUser.nativeLanguage)
                    : "Not set"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Learning</div>
                <div className="stat-value text-lg">
                  {authUser?.learningLanguage
                    ? formatLanguage(authUser.learningLanguage)
                    : "Not set"}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Location</div>
                <div className="stat-value text-lg">
                  {authUser?.location || "Not set"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
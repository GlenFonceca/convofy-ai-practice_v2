import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  ArrowLeft,
  BellIcon,
  Crown,
  LogOutIcon,
  ShipWheelIcon,
  SparklesIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthUser();

  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  const handleGoBack = () => {
    if (location.pathname == "/") {
      navigate("/");
    } else if (location.pathname == "/premium-upgrade") {
      navigate("/");
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <nav className="bg-base-300 border-b border-base-300 sticky top-0 z-30 h-14 sm:h-16 flex items-center drop-shadow">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex gap-2 sm:gap-3 items-center justify-between w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {
            <div
              className={`flex-shrink-0 ${
                isChatPage ? "block" : "block lg:hidden"
              }`}
            >
              <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5">
                <SparklesIcon className="size-6 sm:size-7 lg:size-9 text-primary" />
                <span className="text-lg sm:text-2xl lg:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Convofy
                </span>
              </Link>
            </div>
          }
          <button
            onClick={handleGoBack}
            className="hidden lg:flex btn btn-ghost btn-sm sm:btn-md p-2 min-h-0 h-auto hover:bg-base-300 hover:scale-105 transition-all duration-100 group border border-base-content/20 hover:border-base-content/40 shadow-sm hover:shadow-md"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-primary" />
          </button>

          {/* Right side controls */}

          {/* Upgrade to premium Button */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-auto">
            {!authUser.isPremium && (
              <button
                onClick={() => navigate("/premium-upgrade")}
                className="btn bg-gradient-to-r from-primary to-base-content text-base-100 btn-sm lg:hidden"
              >
                <span className="hidden sm:inline">✨</span>
                <span className="hidden md:inline">Upgrade to Premium</span>
                <span className="md:hidden">Upgrade</span>
              </button>
            )}

            {/* Notifications */}
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md ">
                <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-base-content hover:text-primary opacity-70 " />
              </button>
            </Link>

            {/* Theme Selector */}
            <div>
              <ThemeSelector />
            </div>

            {/* User Avatar */}
            <div className="avatar">
              <Link to={"/profile"}>
                <div className="w-7 sm:w-8 lg:w-9 rounded-full ring-1 ring-base-300">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    className="object-cover"
                    // onError={(e) => {
                    //   e.target.onerror = null; // Prevent infinite loop
                    //   e.target.src = "/cat.png";
                    // }}
                  />
                </div>
                {/* Premium badge - optional for smaller avatars */}
                {authUser?.isPremium && (
                  <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-0.5 z-20">
                    <Crown className="size-2 text-yellow-900" />
                  </div>
                )}
              </Link>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              onClick={logoutMutation}
              aria-label="Logout"
            >
              <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-base-content hover:text-primary opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

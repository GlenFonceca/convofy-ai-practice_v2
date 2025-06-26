import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  Mic,
  SparklesIcon,
  User,
  UsersIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <SparklesIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
            Convofy
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/practice-with-ai"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/practice-with-ai" ? "btn-active" : ""
          }`}
        >
          <Mic className="size-5 text-base-content opacity-70" />
          <span>Practice With AI</span>
        </Link>

        {/* Premium Section - Add in sidebar */}
        {!authUser.isPremium && (
          <div className="mx-4 my-6">
            <div className="card bg-gradient-to-r from-primary to-base-content text-base-100">
              <div className="card-body p-4 text-center">
                <h3 className="font-bold text-sm mb-2">✨ Go Premium</h3>
                <p className="text-xs opacity-90 mb-3">
                  Unlock unlimited AI practice
                </p>
                <button onClick={()=>navigate('/premium-upgrade')} className="btn btn-sm bg-base-100 text-base-content hover:bg-base-300 hover:text-yellow-300 border-none">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/profile" ? "btn-active" : ""
          }`}
        >
          <User className="size-5 text-base-content opacity-70" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      {/* <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div> */}
    </aside>
  );
};
export default Sidebar;

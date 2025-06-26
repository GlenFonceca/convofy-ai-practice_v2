import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import { useThemeStore } from "../store/useThemeStore.js";


const Layout = ({ children, showSidebar = false,showNavbar = true }) => {

  const {theme} = useThemeStore();
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {showNavbar && <Navbar />}
          <main className="flex-1 " data-theme = {theme}>{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;

// Top navigation bar with brand logo SVG, user avatar, and logout action
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogoIcon, LogoutIcon } from "./Icons";

const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const userName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="sidebar-toggle-btn"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <LogoIcon size={20} />
          </div>
          <span className="navbar-brand-name">TrackLearn</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar" aria-label="User avatar">
            {userInitial}
          </div>
          <span className="user-name" title={userName}>{userName}</span>
        </div>

        <button
          className="logout-btn-nav"
          onClick={handleLogout}
          id="navbar-logout-btn"
          aria-label="Logout"
        >
          <LogoutIcon size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

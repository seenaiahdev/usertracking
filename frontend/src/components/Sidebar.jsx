// Collapsible sidebar supporting both expanded (text+icon) and collapsed (icon-only mini bar) modes
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HomeIcon, LiveIcon, SessionsIcon, LogoutIcon } from "./Icons";

const Sidebar = ({ isOpen, activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { id: "home",     label: "Home",     Icon: HomeIcon,     showLivePulse: false },
    { id: "live",     label: "Live",     Icon: LiveIcon,     showLivePulse: true  },
    { id: "sessions", label: "Sessions", Icon: SessionsIcon, showLivePulse: false },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <nav className="sidebar-nav">
        <div className="sidebar-label">Menu</div>

        {navItems.map(({ id, label, Icon, showLivePulse }) => (
          <button
            key={id}
            className={`sidebar-item ${activeTab === id ? "active" : ""}`}
            onClick={() => onTabChange(id)}
            id={`sidebar-${id}-btn`}
            aria-label={label}
            title={label}
          >
            <span className="sidebar-item-icon">
              <Icon size={20} />
            </span>
            <span className="sidebar-item-text">{label}</span>
            {showLivePulse && <span className="sidebar-live-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          id="sidebar-logout-btn"
          aria-label="Logout"
          title="Logout"
        >
          <span className="sidebar-item-icon">
            <LogoutIcon size={20} />
          </span>
          <span className="sidebar-item-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

// Welcome home view — greeting with user name and quick action cards
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import { LiveIcon, SessionsIcon, ArrowRightIcon, ClockIcon, VideoIcon } from "../components/Icons";
import "../styles/homeView.css";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const HomeView = ({ onTabChange }) => {
  const { user } = useAuth();
  const [watchedSeconds, setWatchedSeconds] = useState(0);

  const userName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axiosClient.get("/api/progress/live-session-001");
        setWatchedSeconds(data.watchedSeconds || 0);
      } catch {
        setWatchedSeconds(0);
      }
    };
    fetchProgress();
  }, []);

  const formatWatched = (seconds) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 1) return "0 min";
    return `${mins} min`;
  };

  return (
    <div className="home-view">
      <div className="greeting-section">
        <div className="greeting-time">
          <ClockIcon size={14} />
          <span>{getGreeting()}</span>
        </div>
        <h1 className="greeting-text">
          Welcome back, <span>{userName}!</span>
        </h1>
        <p className="greeting-sub">
          Ready to continue your learning journey today?
        </p>
      </div>

      <div className="quick-actions-label">Quick Actions</div>
      <div className="quick-actions-grid">
        <button
          className="quick-action-card live"
          onClick={() => onTabChange("live")}
          id="home-go-live-btn"
        >
          <div className="quick-action-icon live-icon">
            <LiveIcon size={24} />
          </div>
          <div className="quick-action-info">
            <div className="quick-action-title">Join Live Session</div>
            <div className="quick-action-desc">
              Continue watching the live class. Click to load the video player.
            </div>
          </div>
          <span className="quick-action-arrow">
            <ArrowRightIcon size={20} />
          </span>
        </button>

        <button
          className="quick-action-card"
          onClick={() => onTabChange("sessions")}
          id="home-go-sessions-btn"
        >
          <div className="quick-action-icon sessions-icon">
            <SessionsIcon size={24} />
          </div>
          <div className="quick-action-info">
            <div className="quick-action-title">Browse Sessions</div>
            <div className="quick-action-desc">
              Explore all recorded class sessions available for you.
            </div>
          </div>
          <span className="quick-action-arrow">
            <ArrowRightIcon size={20} />
          </span>
        </button>
      </div>

      <div className="stats-section">
        <div className="quick-actions-label">Your Progress</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{formatWatched(watchedSeconds)}</div>
            <div className="stat-card-label">Total Watched</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">1</div>
            <div className="stat-card-label">Live Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">5</div>
            <div className="stat-card-label">Recorded Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

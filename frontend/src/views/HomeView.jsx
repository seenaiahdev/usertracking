// Welcome home view — greeting with user name, quick action cards, and real-time Supabase stats
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import supabase from "../supabaseClient";
import { LiveIcon, SessionsIcon, ArrowRightIcon, ClockIcon } from "../components/Icons";
import "../styles/homeView.css";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const HomeView = ({ onTabChange }) => {
  const { user } = useAuth();
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userName =
    user?.user_metadata?.username ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  useEffect(() => {
    let isMounted = true;

    const fetchHomeStats = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select("id");

        if (error) throw error;

        if (isMounted) {
          setSessionCount(data?.length || 0);
        }
      } catch (err) {
        console.error("Error loading sessions count:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeStats();

    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="quick-actions-label">Your Overview</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">1</div>
            <div className="stat-card-label">Live Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-value">
              {loading ? "..." : sessionCount}
            </div>
            <div className="stat-card-label">Recorded Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;

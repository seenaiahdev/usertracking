// Sessions view — fetches and displays all class sessions from backend
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import SessionCard from "../components/SessionCard";
import { EmptyBoxIcon } from "../components/Icons";
import "../styles/sessionsView.css";

const SessionsView = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await axiosClient.get("/api/sessions");
        setSessions(data.sessions || []);
      } catch {
        setError("Failed to load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="sessions-view">
      <div className="sessions-header">
        <h2 className="sessions-title">Class Sessions</h2>
        <p className="sessions-subtitle">Browse all recorded class sessions</p>
      </div>

      {loading && (
        <div className="sessions-loading">
          <div className="spinner" />
        </div>
      )}

      {error && <div className="auth-error">{error}</div>}

      {!loading && !error && sessions.length === 0 && (
        <div className="sessions-empty">
          <div className="sessions-empty-icon">
            <EmptyBoxIcon size={56} />
          </div>
          <p className="sessions-empty-text">No sessions available yet.</p>
        </div>
      )}

      {!loading && !error && sessions.length > 0 && (
        <div className="sessions-grid">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsView;

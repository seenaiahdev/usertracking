// Sessions view — fetches and displays class sessions directly from Supabase database
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import SessionCard from "../components/SessionCard";
import { EmptyBoxIcon } from "../components/Icons";
import "../styles/sessionsView.css";

const SessionsView = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchSessions = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from("sessions")
          .select("id, title, description, thumbnail_url, duration_minutes, session_date")
          .order("session_date", { ascending: false });

        if (dbError) throw dbError;

        if (isMounted) {
          setSessions(data || []);
        }
      } catch (err) {
        console.error("Failed to load sessions:", err.message);
        if (isMounted) {
          setError("Failed to load sessions. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSessions();

    return () => {
      isMounted = false;
    };
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

// Session card displaying class session info — thumbnail, title, duration, description
import { ClockIcon, VideoIcon } from "./Icons";

const SessionCard = ({ session }) => {
  const formattedDate = session.session_date
    ? new Date(session.session_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No date";

  return (
    <div className="session-card" id={`session-card-${session.id}`}>
      {session.thumbnail_url ? (
        <img
          className="session-thumbnail"
          src={session.thumbnail_url}
          alt={session.title}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="session-thumbnail-placeholder"
        style={{ display: session.thumbnail_url ? "none" : "flex" }}
      >
        <VideoIcon size={40} />
      </div>

      <div className="session-body">
        <div className="session-meta">
          <span className="session-date">{formattedDate}</span>
          <span className="session-duration">
            <ClockIcon size={13} />
            <span>{session.duration_minutes} min</span>
          </span>
        </div>

        <h3 className="session-title">{session.title}</h3>
        <p className="session-description">{session.description}</p>
      </div>
    </div>
  );
};

export default SessionCard;

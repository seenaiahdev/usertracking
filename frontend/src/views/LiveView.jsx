// Live video view — shows the live session video player
import VideoPlayer from "../components/VideoPlayer";
import "../styles/liveView.css";

const LiveView = () => {
  return (
    <div className="live-view">
      <div className="live-header">
        <div className="live-badge">
          <span className="live-badge-dot" />
          Live
        </div>
        <h2 className="live-title">Live Session — Full Stack Development</h2>
      </div>

      <VideoPlayer />
    </div>
  );
};

export default LiveView;

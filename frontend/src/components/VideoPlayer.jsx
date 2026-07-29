// Video player with direct Supabase watch time tracking and seamless auto-resume
import { useRef, useEffect, useState, useCallback } from "react";
import supabase from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const VIDEO_ID = "live-session-001";
const VIDEO_SRC = "https://media.w3.org/2010/05/sintel/trailer.mp4";
const VIDEO_POSTER = "https://media.w3.org/2010/05/sintel/poster.png";
const SAVE_INTERVAL_MS = 3000;

const VideoPlayer = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const watchedSecondsRef = useRef(0);
  const lastSaveTimeRef = useRef(Date.now());
  const lastPlayTimeRef = useRef(null);
  const savedPositionRef = useRef(0);

  const [progressLoaded, setProgressLoaded] = useState(false);

  const saveProgress = useCallback(
    async (currentPosition) => {
      if (!user || currentPosition === undefined || currentPosition === null) return;
      try {
        await supabase.from("video_progress").upsert(
          {
            user_id: user.id,
            video_id: VIDEO_ID,
            watched_seconds: Math.round(watchedSecondsRef.current),
            last_position: parseFloat(currentPosition),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,video_id" }
        );
        savedPositionRef.current = currentPosition;
      } catch (err) {
        console.error("Save progress error:", err.message);
      }
    },
    [user]
  );

  // Fetch saved position on mount and seek video seamlessly
  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("video_progress")
          .select("watched_seconds, last_position")
          .eq("user_id", user.id)
          .eq("video_id", VIDEO_ID)
          .maybeSingle();

        if (error) throw error;
        if (!isMounted) return;

        const targetPos = data?.last_position ? parseFloat(data.last_position) : 0;
        watchedSecondsRef.current = data?.watched_seconds ? parseInt(data.watched_seconds, 10) : 0;
        savedPositionRef.current = targetPos;

        if (targetPos > 0 && videoRef.current) {
          const video = videoRef.current;

          const applySeek = () => {
            if (video && targetPos > 0) {
              video.currentTime = targetPos;
            }
          };

          if (video.readyState >= 1) {
            applySeek();
          } else {
            video.addEventListener("loadedmetadata", applySeek, { once: true });
            video.addEventListener("canplay", applySeek, { once: true });
          }
        }
      } catch (err) {
        console.error("Failed to load progress:", err.message);
      } finally {
        if (isMounted) setProgressLoaded(true);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
      if (videoRef.current && videoRef.current.currentTime > 0) {
        saveProgress(videoRef.current.currentTime);
      }
    };
  }, [user, saveProgress]);

  // Video event listeners for play, pause, seek, and interval save
  useEffect(() => {
    if (!progressLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      lastPlayTimeRef.current = video.currentTime;
    };

    const handleTimeUpdate = () => {
      if (lastPlayTimeRef.current !== null) {
        const delta = video.currentTime - lastPlayTimeRef.current;
        if (delta > 0 && delta < 2) {
          watchedSecondsRef.current += delta;
        }
        lastPlayTimeRef.current = video.currentTime;
      }

      const now = Date.now();
      if (now - lastSaveTimeRef.current >= SAVE_INTERVAL_MS) {
        lastSaveTimeRef.current = now;
        saveProgress(video.currentTime);
      }
    };

    const handlePause = () => {
      saveProgress(video.currentTime);
      lastPlayTimeRef.current = null;
    };

    const handleSeeked = () => {
      lastPlayTimeRef.current = video.currentTime;
      saveProgress(video.currentTime);
    };

    const handleEnded = () => {
      saveProgress(video.currentTime);
      lastPlayTimeRef.current = null;
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("ended", handleEnded);
    };
  }, [progressLoaded, saveProgress]);

  return (
    <div className="video-wrapper">
      <video
        ref={videoRef}
        controls
        id="live-video-player"
        preload="auto"
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
      />
    </div>
  );
};

export default VideoPlayer;

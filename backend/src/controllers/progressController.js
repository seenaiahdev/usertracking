// Controller to get and save video watch progress per user
import supabaseAdmin from "../config/supabaseAdmin.js";

export const getVideoProgress = async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.params;

  const { data, error } = await supabaseAdmin
    .from("video_progress")
    .select("watched_seconds, last_position")
    .eq("user_id", userId)
    .eq("video_id", videoId)
    .maybeSingle();

  if (error) {
    console.error("[Progress GET Error]", error.message, error.details);
    return res.status(500).json({ error: "Failed to fetch video progress", detail: error.message });
  }

  const lastPos = data?.last_position ? parseFloat(data.last_position) : 0;
  const watchedSec = data?.watched_seconds ? parseInt(data.watched_seconds, 10) : 0;

  return res.status(200).json({
    watchedSeconds: watchedSec,
    lastPosition: lastPos,
  });
};

export const saveVideoProgress = async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.params;
  const { watchedSeconds, lastPosition } = req.body;

  if (watchedSeconds === undefined || lastPosition === undefined) {
    return res.status(400).json({ error: "watchedSeconds and lastPosition are required" });
  }

  const numericLastPos = parseFloat(lastPosition) || 0;
  const numericWatched = Math.round(parseFloat(watchedSeconds) || 0);

  const { error } = await supabaseAdmin.from("video_progress").upsert(
    {
      user_id: userId,
      video_id: videoId,
      watched_seconds: numericWatched,
      last_position: numericLastPos,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,video_id" }
  );

  if (error) {
    console.error("[Progress POST Error]", error.message, error.details, error.hint);
    return res.status(500).json({ error: "Failed to save video progress", detail: error.message });
  }

  return res.status(200).json({ message: "Progress saved successfully", lastPosition: numericLastPos });
};

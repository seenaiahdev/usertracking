// Controller to fetch all available class sessions
import supabaseAdmin from "../config/supabaseAdmin.js";

export const getAllSessions = async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("id, title, description, thumbnail_url, duration_minutes, session_date")
    .order("session_date", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Failed to fetch sessions" });
  }

  return res.status(200).json({ sessions: data });
};

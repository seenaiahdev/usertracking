// Controller to handle user profile retrieval
import supabaseAdmin from "../config/supabaseAdmin.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username, avatar_url, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }

  return res.status(200).json({ profile: data });
};

// Middleware to verify Supabase JWT token on every protected route
import supabaseAdmin from "../config/supabaseAdmin.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  req.user = data.user;
  next();
};

export default verifyToken;

// Supabase client instance for frontend authentication with production environment fallback
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://bkphzskdjkxrtxgpykok.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcGh6c2tkamt4cnR4Z3B5a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTcxMzAsImV4cCI6MjEwMDg5MzEzMH0.3TqOFj7XxTKxx5uYJdjK_-hbPLP9CdcNslogD4VJEg0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

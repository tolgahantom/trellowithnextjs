import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://enoshjyrsxfbbcvuyioy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVub3Noanlyc3hmYmJjdnV5aW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODYwMjEsImV4cCI6MjA1NDc2MjAyMX0.xO2wSAKTf94a5tgcXulR46-8se31bQ-XvoivJ0o0mJI";

export const supabase = createClient(supabaseUrl, supabaseKey);

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, prefer",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Extract the token
    const token = authHeader.replace("Bearer ", "");
    
    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Parse the request body
    const { score, streak } = await req.json();

    // Get all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*");

    if (achievementsError) {
      throw achievementsError;
    }

    // Get user's existing achievements
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);

    if (userAchievementsError) {
      throw userAchievementsError;
    }

    // Filter to unearned achievements
    const userAchievementIds = userAchievements.map(ua => ua.achievement_id);
    const unearnedAchievements = achievements.filter(a => 
      !userAchievementIds.includes(a.id)
    );

    // Check if any new achievements should be awarded
    const newAchievements = [];
    for (const achievement of unearnedAchievements) {
      let shouldGrant = false;
      
      // Determine if achievement should be granted based on name and description
      if (achievement.name === "First Win" && score >= 1) {
        shouldGrant = true;
      } else if (achievement.name === "Streak Master" && streak >= 5) {
        shouldGrant = true;
      } else if (achievement.name === "Element Expert" && score >= 100) {
        shouldGrant = true;
      } else if (achievement.name === "Multiplayer Champion" && score >= 10) {
        shouldGrant = true;
      } else if (achievement.name === "Quick Thinker" && score >= 1) {
        shouldGrant = true;
      } else if (achievement.name === "Perfect Game" && score >= 10) {
        shouldGrant = true;
      } else if (achievement.name === "Dedicated Player" && score >= 50) {
        shouldGrant = true;
      } else if (achievement.name === "Noble Gas Guru" && score >= 5) {
        shouldGrant = true;
      } else if (achievement.name === "Transition Metal Master" && score >= 5) {
        shouldGrant = true;
      } else if (achievement.name === "Halogen Hero" && score >= 5) {
        shouldGrant = true;
      }
      
      if (shouldGrant) {
        // Insert the new achievement for the user
        const { error: insertError } = await supabase
          .from("user_achievements")
          .insert([
            { user_id: user.id, achievement_id: achievement.id }
          ]);
          
        if (insertError) {
          throw insertError;
        }
        
        newAchievements.push(achievement);
      }
    }

    return new Response(
      JSON.stringify({ newAchievements }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});


// supabase/functions/create_multiplayer_game/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    // Get token from header
    const token = authHeader.replace('Bearer ', '')
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { action } = await req.json()

    if (action === 'find') {
      // First try to find a waiting game
      const { data: waitingGame, error: findError } = await supabase
        .from('multiplayer_games')
        .select('*')
        .eq('status', 'waiting')
        .neq('player1_id', user.id)
        .limit(1)
        .single()

      if (findError && findError.code !== 'PGRST116') {
        throw findError
      }

      if (waitingGame) {
        // Join this game
        const { data: joinedGame, error: joinError } = await supabase
          .from('multiplayer_games')
          .update({
            player2_id: user.id,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', waitingGame.id)
          .select('*')
          .single()

        if (joinError) throw joinError

        return new Response(
          JSON.stringify({ success: true, game: joinedGame, action: 'joined' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        // Create a new game
        const { data: newGame, error: createError } = await supabase
          .from('multiplayer_games')
          .insert({
            player1_id: user.id,
            player1_score: 0,
            player2_score: 0,
            player1_errors: 0,
            player2_errors: 0,
            current_question_index: 0,
            is_active: true,
            time_remaining: 180, // 3 minutes
            status: 'waiting'
          })
          .select('*')
          .single()

        if (createError) throw createError

        return new Response(
          JSON.stringify({ success: true, game: newGame, action: 'created' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else if (action === 'leave') {
      const { gameId } = await req.json()
      
      if (!gameId) {
        return new Response(
          JSON.stringify({ error: 'Missing gameId' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Get the game
      const { data: game, error: getError } = await supabase
        .from('multiplayer_games')
        .select('*')
        .eq('id', gameId)
        .single()
      
      if (getError) throw getError
      
      if (game.status === 'waiting') {
        // Delete the game if it's still waiting
        const { error: deleteError } = await supabase
          .from('multiplayer_games')
          .delete()
          .eq('id', gameId)
        
        if (deleteError) throw deleteError
      } else if (game.status === 'active') {
        // Forfeit the game
        const winnerId = game.player1_id === user.id ? game.player2_id : game.player1_id
        
        const { error: updateError } = await supabase
          .from('multiplayer_games')
          .update({
            status: 'completed',
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', gameId)
        
        if (updateError) throw updateError
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

-- Drop existing tables if they exist
drop table if exists public.user_streaks;
drop table if exists public.game_history;
drop table if exists public.user_achievements;
drop table if exists public.achievements;

-- Create achievements table
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  icon text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table
create table if not exists public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  achievement_id uuid references public.achievements not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Create game_history table
create table if not exists public.game_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  game_type text not null check (game_type in ('single', 'multiplayer')),
  score integer not null default 0,
  questions_answered integer not null default 0,
  correct_answers integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_streaks table
create table if not exists public.user_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  current_streak integer not null default 0,
  max_streak integer not null default 0,
  last_played timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.game_history enable row level security;
alter table public.user_streaks enable row level security;

-- Create policies for achievements
create policy "Anyone can view achievements"
  on public.achievements for select
  using (true);

-- Create policies for user_achievements
create policy "Users can view their own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- Create policies for game_history
create policy "Users can view their own game history"
  on public.game_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own game history"
  on public.game_history for insert
  with check (auth.uid() = user_id);

-- Create policies for user_streaks
create policy "Users can view their own streaks"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own streaks"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own streaks"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- Insert some default achievements
insert into public.achievements (name, description, icon)
values
  ('First Win', 'Win your first game', '🏆'),
  ('Streak Master', 'Maintain a 5-day streak', '🔥'),
  ('Element Expert', 'Answer 100 questions correctly', '🧪'),
  ('Multiplayer Champion', 'Win 10 multiplayer games', '👑'),
  ('Quick Thinker', 'Answer a question in under 5 seconds', '⚡'),
  ('Perfect Game', 'Answer all questions correctly in a game', '💯'),
  ('Dedicated Player', 'Play 50 games', '🎮'),
  ('Noble Gas Guru', 'Answer all noble gas questions correctly', '🌌'),
  ('Transition Metal Master', 'Answer all transition metal questions correctly', '🔧'),
  ('Halogen Hero', 'Answer all halogen questions correctly', '🧪')
on conflict do nothing;

-- Enable realtime for these tables
alter publication supabase_realtime add table public.user_streaks;
alter publication supabase_realtime add table public.game_history;
alter publication supabase_realtime add table public.user_achievements;
alter publication supabase_realtime add table public.achievements;

-- Create RPC function for inserting game history
create or replace function public.insert_game_history(
  p_user_id uuid,
  p_score integer,
  p_total_questions integer,
  p_game_type text default 'single'
)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  insert into public.game_history (
    user_id,
    score,
    questions_answered,
    correct_answers,
    game_type
  )
  values (
    p_user_id,
    p_score,
    p_total_questions,
    p_score,
    p_game_type
  )
  returning to_jsonb(game_history.*) into result;
  
  return result;
end;
$$; 
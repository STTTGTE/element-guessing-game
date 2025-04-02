-- Create achievements table
create table if not exists public.achievements (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  condition text not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_achievements table
create table if not exists public.user_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  achievement_id uuid references public.achievements not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Enable Row Level Security
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- Create policies
create policy "Achievements are viewable by everyone."
  on public.achievements for select
  using (true);

create policy "Users can view their own achievements."
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "Users can insert their own achievements."
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- Insert sample achievements
insert into public.achievements (name, description, condition, icon)
values
  ('First Steps', 'Complete your first game', 'score >= 1', 'trophy'),
  ('Periodic Expert', 'Score 5 or more in a single game', 'score >= 5', 'award'),
  ('Element Master', 'Score 10 or more in a single game', 'score >= 10', 'star'),
  ('Perfect Streak', 'Achieve a streak of 3 correct answers', 'streak >= 3', 'calendar'),
  ('Chemistry Whiz', 'Achieve a streak of 5 correct answers', 'streak >= 5', 'flask')
on conflict do nothing;

-- Enable realtime
alter publication supabase_realtime add table public.achievements;
alter publication supabase_realtime add table public.user_achievements;

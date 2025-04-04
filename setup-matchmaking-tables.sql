-- Drop existing tables if they exist
drop table if exists public.matches;
drop table if exists public.matchmaking;

-- Create matchmaking table
create table if not exists public.matchmaking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  status text not null check (status in ('searching', 'matched')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create matches table
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  player1_id uuid references auth.users not null,
  player2_id uuid references auth.users not null,
  current_question jsonb not null,
  scores jsonb not null default '{}'::jsonb,
  question_number integer not null default 0,
  status text not null check (status in ('active', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.matchmaking enable row level security;
alter table public.matches enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own matchmaking status." on public.matchmaking;
drop policy if exists "Users can insert their own matchmaking entry." on public.matchmaking;
drop policy if exists "Users can update their own matchmaking entry." on public.matchmaking;
drop policy if exists "Users can delete their own matchmaking entry." on public.matchmaking;
drop policy if exists "Users can view matches they are part of." on public.matches;
drop policy if exists "Users can update matches they are part of." on public.matches;

-- Create policies for matchmaking
create policy "Users can view their own matchmaking status."
  on public.matchmaking for select
  using (auth.uid() = user_id);

create policy "Users can insert their own matchmaking entry."
  on public.matchmaking for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own matchmaking entry."
  on public.matchmaking for update
  using (auth.uid() = user_id);

create policy "Users can delete their own matchmaking entry."
  on public.matchmaking for delete
  using (auth.uid() = user_id);

-- Create policies for matches
create policy "Users can view matches they are part of."
  on public.matches for select
  using (auth.uid() = player1_id or auth.uid() = player2_id);

create policy "Users can update matches they are part of."
  on public.matches for update
  using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Create a function to match players
create or replace function public.match_players()
returns trigger as $$
declare
  waiting_player record;
  new_match_id uuid;
  random_question jsonb;
begin
  -- Find another player who is searching
  select * into waiting_player
  from public.matchmaking
  where status = 'searching' and user_id != new.user_id
  order by created_at asc
  limit 1;
  
  -- If found, create a match
  if found then
    -- Get a random question
    select to_jsonb(q) into random_question
    from (
      select id, text, "correctElement", hint, difficulty
      from (
        values
          (1, 'What is the most abundant element in the universe?', 'H', 'This element is the lightest and makes up most stars', 'easy'),
          (2, 'Which element is essential for life and forms the basis of organic chemistry?', 'C', 'This element can form up to four covalent bonds', 'easy'),
          (3, 'Which noble gas is used in lighting and signs, giving a reddish-orange glow?', 'Ne', 'This element has atomic number 10', 'medium'),
          (4, 'Which halogen is a purple gas at room temperature?', 'I', 'This element is used as an antiseptic', 'medium'),
          (5, 'Which transition metal is liquid at room temperature?', 'Hg', 'This element was historically known as quicksilver', 'medium'),
          (6, 'Which alkali metal explodes violently when it comes into contact with water?', 'Cs', 'This element has the lowest electronegativity', 'hard'),
          (7, 'Which element is used in semiconductor devices and solar cells?', 'Si', 'This element is the second most abundant in Earth''s crust', 'medium'),
          (8, 'Which noble gas is used in MRI machines?', 'He', 'This element is extracted from natural gas', 'easy'),
          (9, 'Which element is essential for strong bones and teeth?', 'Ca', 'This element is the most abundant metal in the human body', 'easy'),
          (10, 'Which radioactive element was discovered by Marie Curie?', 'Ra', 'This element glows blue in the dark', 'hard')
      ) as q(id, text, "correctElement", hint, difficulty)
      order by random()
      limit 1
    ) q;
    
    -- Create a new match
    insert into public.matches (
      player1_id,
      player2_id,
      current_question,
      scores,
      status
    ) values (
      waiting_player.user_id,
      new.user_id,
      random_question,
      jsonb_build_object(waiting_player.user_id, 0, new.user_id, 0),
      'active'
    )
    returning id into new_match_id;
    
    -- Update both players' status to matched
    update public.matchmaking
    set status = 'matched'
    where user_id = waiting_player.user_id or user_id = new.user_id;
    
    -- Delete matchmaking entries for both players
    delete from public.matchmaking
    where user_id = waiting_player.user_id or user_id = new.user_id;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_matchmaking_insert on public.matchmaking;

-- Create a trigger to run the match_players function
create trigger on_matchmaking_insert
  after insert on public.matchmaking
  for each row execute procedure public.match_players();

-- Enable realtime
drop publication if exists supabase_realtime;
create publication supabase_realtime for table public.matchmaking, public.matches;

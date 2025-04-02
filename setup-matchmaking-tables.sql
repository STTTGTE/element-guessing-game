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
          (1, 'Which element is a noble gas with atomic number 10?', 'Ne', 'It''s used in lighting and signs', 'medium'),
          (2, 'Which element is the most abundant metal in Earth''s crust?', 'Al', 'It''s lightweight and used in cans', 'easy'),
          (3, 'Which element is a halogen with atomic number 35?', 'Br', 'It''s a reddish-brown liquid at room temperature', 'hard'),
          (4, 'Which element is essential for human life and forms the backbone of DNA?', 'P', 'It glows in the dark', 'medium'),
          (5, 'Which element is the lightest metal on the periodic table?', 'Li', 'It''s used in batteries', 'easy')
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

-- Create a trigger to run the match_players function
create or replace trigger on_matchmaking_insert
  after insert on public.matchmaking
  for each row execute procedure public.match_players();

-- Enable realtime (only if not already added)
do $$
begin
  -- Check if matchmaking is already in the publication
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'matchmaking'
  ) then
    alter publication supabase_realtime add table public.matchmaking;
  end if;
  
  -- Check if matches is already in the publication
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'matches'
  ) then
    alter publication supabase_realtime add table public.matches;
  end if;
end
$$;

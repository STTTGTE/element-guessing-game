-- Create matchmaking table if it doesn't exist
create table if not exists public.matchmaking (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    status text check (status in ('searching', 'matched')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create matches table if it doesn't exist
create table if not exists public.matches (
    id uuid default gen_random_uuid() primary key,
    player1_id uuid references auth.users not null,
    player2_id uuid references auth.users not null,
    scores jsonb default '{}'::jsonb not null,
    current_question jsonb,
    question_number integer default 0,
    status text check (status in ('active', 'completed')) default 'active' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.matchmaking enable row level security;
alter table public.matches enable row level security;

-- Create or replace policies
drop policy if exists "Users can view their own matchmaking entries" on public.matchmaking;
drop policy if exists "Users can insert their own matchmaking entries" on public.matchmaking;
drop policy if exists "Users can delete their own matchmaking entries" on public.matchmaking;
drop policy if exists "Users can view their matches" on public.matches;
drop policy if exists "Users can update their matches" on public.matches;

create policy "Users can view their own matchmaking entries"
    on public.matchmaking for select
    using (auth.uid() = user_id);

create policy "Users can insert their own matchmaking entries"
    on public.matchmaking for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own matchmaking entries"
    on public.matchmaking for delete
    using (auth.uid() = user_id);

create policy "Users can update their matchmaking entries"
    on public.matchmaking for update
    using (auth.uid() = user_id);

create policy "Users can view their matches"
    on public.matches for select
    using (auth.uid() = player1_id or auth.uid() = player2_id);

create policy "Users can update their matches"
    on public.matches for update
    using (auth.uid() = player1_id or auth.uid() = player2_id);

-- Enable realtime
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.matchmaking;

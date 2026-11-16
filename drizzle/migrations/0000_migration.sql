create type public.app_role as enum ('admin','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age_range text,
  education_level text,
  stream text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.user_preferences (
  user_id uuid primary key,
  subjects text[] not null default '{}',
  interests text[] not null default '{}',
  capabilities text[] not null default '{}',
  environment text,
  budget integer,
  weekly_hours integer,
  short_goal text,
  long_goal text,
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.user_preferences to authenticated;
grant all on public.user_preferences to service_role;
alter table public.user_preferences enable row level security;
create policy "own prefs" on public.user_preferences for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reference vocab
create table public.interests (id text primary key, label text not null);
create table public.capabilities (id text primary key, label text not null);
grant select on public.interests, public.capabilities to anon, authenticated;
grant all on public.interests, public.capabilities to service_role;
alter table public.interests enable row level security;
alter table public.capabilities enable row level security;
create policy "public read" on public.interests for select to anon, authenticated using (true);
create policy "public read" on public.capabilities for select to anon, authenticated using (true);
create policy "admin write" on public.interests for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.capabilities for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.careers (
  id text primary key,
  title text not null,
  industry text not null,
  subcategory text,
  description text not null,
  responsibilities text[] not null default '{}',
  qualifications text[] not null default '{}',
  alt_routes text[] not null default '{}',
  resources jsonb not null default '[]',
  cost_note text,
  progression text[] not null default '{}',
  trial text,
  career_type text,
  emerging boolean not null default false,
  updated_at timestamptz not null default now()
);
create index careers_industry_idx on public.careers(industry);
create table public.career_interests (career_id text references public.careers(id) on delete cascade, interest_id text references public.interests(id) on delete cascade, primary key (career_id, interest_id));
create table public.career_skills (career_id text references public.careers(id) on delete cascade, capability_id text references public.capabilities(id) on delete cascade, primary key (career_id, capability_id));
create index career_interests_i on public.career_interests(interest_id);
create index career_skills_c on public.career_skills(capability_id);
grant select on public.careers, public.career_interests, public.career_skills to anon, authenticated;
grant insert, update, delete on public.careers, public.career_interests, public.career_skills to authenticated;
grant all on public.careers, public.career_interests, public.career_skills to service_role;
alter table public.careers enable row level security;
alter table public.career_interests enable row level security;
alter table public.career_skills enable row level security;
create policy "public read" on public.careers for select to anon, authenticated using (true);
create policy "public read" on public.career_interests for select to anon, authenticated using (true);
create policy "public read" on public.career_skills for select to anon, authenticated using (true);
create policy "admin write" on public.careers for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.career_interests for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin write" on public.career_skills for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- private user data
create table public.assessments (id uuid primary key default gen_random_uuid(), user_id uuid not null, answers jsonb not null, results jsonb not null, created_at timestamptz not null default now());
create table public.saved_careers (user_id uuid not null, career_id text not null, folder text not null default 'explore_later' check (folder in ('top','alternative','explore_later')), created_at timestamptz not null default now(), primary key (user_id, career_id));
create table public.career_comparisons (id uuid primary key default gen_random_uuid(), user_id uuid not null, career_ids text[] not null, note text, created_at timestamptz not null default now());
create table public.roadmaps (id uuid primary key default gen_random_uuid(), user_id uuid not null, career_id text not null, title text not null, settings jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.roadmap_tasks (id uuid primary key default gen_random_uuid(), roadmap_id uuid not null references public.roadmaps(id) on delete cascade, user_id uuid not null, phase int not null, week int, position int not null default 0, title text not null, description text, effort text, resource jsonb, done boolean not null default false);
create index assessments_user on public.assessments(user_id);
create index comparisons_user on public.career_comparisons(user_id);
create index roadmaps_user on public.roadmaps(user_id);
create index tasks_roadmap on public.roadmap_tasks(roadmap_id);
grant select, insert, update, delete on public.assessments, public.saved_careers, public.career_comparisons, public.roadmaps, public.roadmap_tasks to authenticated;
grant all on public.assessments, public.saved_careers, public.career_comparisons, public.roadmaps, public.roadmap_tasks to service_role;
alter table public.assessments enable row level security;
alter table public.saved_careers enable row level security;
alter table public.career_comparisons enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_tasks enable row level security;
create policy "own" on public.assessments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.saved_careers for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.career_comparisons for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.roadmaps for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own" on public.roadmap_tasks for all to authenticated using (auth.uid() = user_id and exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.user_id = auth.uid())) with check (auth.uid() = user_id and exists (select 1 from public.roadmaps r where r.id = roadmap_id and r.user_id = auth.uid()));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.interests (id,label) values
('sports','Sports and Football'),('gaming','Gaming'),('technology','Technology'),('ai','Artificial Intelligence'),('business','Business and Entrepreneurship'),('music','Music'),('art_design','Art and Design'),('writing','Writing'),('history','History'),('science','Science'),('mathematics','Mathematics'),('travel','Travelling'),('social','Social Activities'),('healthcare','Healthcare'),('law','Law'),('environment','Nature and Environment'),('media','Media and Entertainment'),('teaching','Teaching and Education');
insert into public.capabilities (id,label) values
('leadership','Leadership'),('communication','Communication'),('creativity','Creativity'),('analytical','Analytical Thinking'),('problem_solving','Problem Solving'),('mathematics','Mathematics'),('teamwork','Teamwork'),('observation','Observation'),('public_speaking','Public Speaking'),('writing','Writing'),('research','Research'),('fitness','Physical Fitness'),('organisation','Organisation'),('critical_thinking','Critical Thinking'),('technical','Technical Skills');
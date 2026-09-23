-- Ejecutar en Supabase SQL Editor.
create table if not exists public.pets (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

-- La app permite reportes públicos y comentarios/reacciones sin cuenta.
create policy "public can read pets" on public.pets for select to anon, authenticated using (true);
create policy "public can publish pets" on public.pets for insert to anon, authenticated with check (true);
create policy "public can update pets" on public.pets for update to anon, authenticated using (true) with check (true);
create policy "public can remove pets" on public.pets for delete to anon, authenticated using (true);

alter publication supabase_realtime add table public.pets;
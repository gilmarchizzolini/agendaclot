-- Execute once in Supabase SQL Editor to enable “↩ Desfazer”.
grant delete on table public.producao to anon;

create policy "Agenda CLOT - desfazer"
on public.producao
for delete
to anon
using (true);

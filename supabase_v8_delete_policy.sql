-- Execute uma única vez no Supabase SQL Editor para habilitar o botão “↩ Desfazer”.
grant delete on table public.producao to anon;

create policy "Agenda CLOT - desfazer"
on public.producao
for delete
to anon
using (true);

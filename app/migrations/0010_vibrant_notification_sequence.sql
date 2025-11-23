-- Ensure notifications serial sequence is aligned with existing rows
SELECT
  setval(
    'public.notifications_id_seq',
    COALESCE((SELECT MAX(id) FROM public.notifications), 0),
    true
  );

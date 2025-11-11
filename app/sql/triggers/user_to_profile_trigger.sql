-- Drop existing trigger/function if re-running the migration
drop trigger if exists user_to_profile_trigger on auth.users;
drop function if exists public.handle_new_user cascade;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_role text;
  v_slug_base text;
  v_slug text;
begin
  -- 안전장치: 이메일이 없으면 프로필을 생성할 수 없음
  if new.email is null then
    raise exception 'Cannot create profile for auth user % without email', new.id;
  end if;

  -- 이름/역할 값 구성 (raw_user_meta_data → raw_app_meta_data → 기본값)
  v_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    new.raw_app_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'Anonymous'
  );

  v_role := coalesce(
    new.raw_user_meta_data ->> 'role',
    new.raw_app_meta_data ->> 'role',
    'creator'
  );

  -- 슬러그 생성 (사용자가 지정한 값이 있으면 우선 사용)
  v_slug_base := coalesce(
    new.raw_user_meta_data ->> 'slug',
    new.raw_app_meta_data ->> 'slug',
    regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g')
  );
  v_slug_base := trim(both '-' from v_slug_base);
  if v_slug_base is null or v_slug_base = '' then
    v_slug_base := split_part(new.email, '@', 1);
  end if;
  if v_slug_base is null or v_slug_base = '' then
    v_slug_base := 'user';
  end if;

  -- 충돌 방지를 위해 랜덤 suffix 부여
  v_slug := v_slug_base || '-' || substr(md5(random()::text), 1, 6);

  insert into public.profiles (
    id,
    auth_user_id,
    name,
    email,
    slug,
    role
  )
  values (
    new.id,
    new.id,
    v_name,
    new.email,
    v_slug,
    v_role
  );

  return new;
end;
$$;

create trigger user_to_profile_trigger
after insert on auth.users
for each row execute function public.handle_new_user();


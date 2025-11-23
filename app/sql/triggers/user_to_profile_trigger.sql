-- 🔄 기존 트리거/함수 제거 (재실행 대비)
DROP TRIGGER IF EXISTS user_to_profile_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- ⚙️ 새 함수 정의 (소셜 로그인 프로바이더별 처리 포함)
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_role text;
  v_slug_base text;
  v_slug text;
  v_avatar_url text;
  v_provider text;
  v_email text;
BEGIN
  -- 프로바이더 확인
  v_provider := null;
  IF new.raw_app_meta_data ? 'provider' THEN
    v_provider := new.raw_app_meta_data ->> 'provider';
  END IF;

  -- 프로바이더별 특화 처리
  IF v_provider = 'kakao' THEN
    -- Kakao 소셜 로그인 처리 (이메일 없이도 작동)
    -- 이메일이 없으면 대체 이메일 생성
    v_email := COALESCE(
      new.email,
      'kakao-' || substr(new.id::text, 1, 8) || '@kakao.local'
    );
    
    v_name := COALESCE(
      new.raw_user_meta_data ->> 'name',
      'Anonymous'
    );
    v_slug_base := COALESCE(
      new.raw_user_meta_data ->> 'preferred_username',
      regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g')
    );
    v_avatar_url := new.raw_user_meta_data ->> 'avatar_url';
    v_role := 'creator';
    
    -- 사용자명 중복 방지
    v_slug_base := trim(both '-' from v_slug_base);
    IF v_slug_base IS NULL OR v_slug_base = '' THEN
      -- 이메일이 있으면 이메일에서 추출, 없으면 랜덤 생성
      IF new.email IS NOT NULL THEN
        v_slug_base := split_part(new.email, '@', 1);
      ELSE
        v_slug_base := 'kakao-user';
      END IF;
    END IF;
    v_slug := v_slug_base || '-' || substr(md5(random()::text), 1, 5);
    
    -- 프로필 자동 생성 (모든 필드 포함)
    INSERT INTO public.profiles (
      id,
      auth_user_id,
      name,
      email,
      slug,
      role,
      avatar_url,
      status,
      timezone,
      joined_at,
      followers_count,
      following_count,
      project_count,
      preferences,
      metadata,
      created_at,
      updated_at
    )
    VALUES (
      new.id,
      new.id,
      v_name,
      v_email,
      v_slug,
      v_role,
      v_avatar_url,
      'invited',
      'Asia/Seoul',
      now(),
      0, 0, 0,
      '{}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
    
    RETURN new;
  END IF;

  -- ⚠️ 안전장치: 카카오가 아닌 경우 이메일 필수
  IF new.email IS NULL THEN
    RAISE EXCEPTION 'Cannot create profile for auth user % without email', new.id;
  END IF;

  IF v_provider = 'github' THEN
    -- GitHub 소셜 로그인 처리
    v_name := COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'Anonymous'
    );
    v_slug_base := COALESCE(
      new.raw_user_meta_data ->> 'user_name',
      regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g')
    );
    v_avatar_url := new.raw_user_meta_data ->> 'avatar_url';
    v_role := 'creator';
    
    -- 사용자명 중복 방지
    v_slug_base := trim(both '-' from v_slug_base);
    IF v_slug_base IS NULL OR v_slug_base = '' THEN
      v_slug_base := split_part(new.email, '@', 1);
    END IF;
    v_slug := v_slug_base || '-' || substr(md5(random()::text), 1, 5);
    
    -- 프로필 자동 생성 (모든 필드 포함)
    INSERT INTO public.profiles (
      id,
      auth_user_id,
      name,
      email,
      slug,
      role,
      avatar_url,
      status,
      timezone,
      joined_at,
      followers_count,
      following_count,
      project_count,
      preferences,
      metadata,
      created_at,
      updated_at
    )
    VALUES (
      new.id,
      new.id,
      v_name,
      new.email,
      v_slug,
      v_role,
      v_avatar_url,
      'invited',
      'Asia/Seoul',
      now(),
      0, 0, 0,
      '{}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
    
    RETURN new;
  END IF;

  IF v_provider = 'google' THEN
    -- Google 소셜 로그인 처리
    v_name := COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1),
      'Anonymous'
    );
    v_slug_base := COALESCE(
      new.raw_user_meta_data ->> 'preferred_username',
      regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g'),
      split_part(new.email, '@', 1)
    );
    v_avatar_url := new.raw_user_meta_data ->> 'avatar_url';
    v_role := 'creator';
    
    -- 사용자명 중복 방지
    v_slug_base := trim(both '-' from v_slug_base);
    IF v_slug_base IS NULL OR v_slug_base = '' THEN
      v_slug_base := split_part(new.email, '@', 1);
    END IF;
    v_slug := v_slug_base || '-' || substr(md5(random()::text), 1, 5);
    
    -- 프로필 자동 생성 (모든 필드 포함)
    INSERT INTO public.profiles (
      id,
      auth_user_id,
      name,
      email,
      slug,
      role,
      avatar_url,
      status,
      timezone,
      joined_at,
      followers_count,
      following_count,
      project_count,
      preferences,
      metadata,
      created_at,
      updated_at
    )
    VALUES (
      new.id,
      new.id,
      v_name,
      new.email,
      v_slug,
      v_role,
      v_avatar_url,
      'invited',
      'Asia/Seoul',
      now(),
      0, 0, 0,
      '{}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    );
    
    RETURN new;
  END IF;

  -- 일반 프로필 생성 로직 (Email 회원가입 등)
  -- 👤 이름/역할 구성 (meta → fallback → email → Anonymous)
  v_name := COALESCE(
    new.raw_user_meta_data ->> 'name',
    new.raw_app_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'Anonymous'
  );

  v_role := COALESCE(
    new.raw_user_meta_data ->> 'role',
    new.raw_app_meta_data ->> 'role',
    'creator'
  );

  -- 🧱 슬러그 생성 (특수문자 제거 + 랜덤 suffix)
  v_slug_base := COALESCE(
    new.raw_user_meta_data ->> 'slug',
    new.raw_app_meta_data ->> 'slug',
    regexp_replace(lower(v_name), '[^a-z0-9]+', '-', 'g')
  );
  v_slug_base := trim(both '-' from v_slug_base);
  IF v_slug_base IS NULL OR v_slug_base = '' THEN
    v_slug_base := split_part(new.email, '@', 1);
  END IF;
  IF v_slug_base IS NULL OR v_slug_base = '' THEN
    v_slug_base := 'user';
  END IF;
  v_slug := v_slug_base || '-' || substr(md5(random()::text), 1, 6);

  -- 아바타 URL (일반 회원가입의 경우 메타데이터에서 가져올 수 있음)
  v_avatar_url := COALESCE(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_app_meta_data ->> 'avatar_url'
  );

  -- 🧩 프로필 자동 생성 (모든 NOT NULL 필드 포함)
  INSERT INTO public.profiles (
    id,
    auth_user_id,
    name,
    email,
    slug,
    role,
    avatar_url,
    status,
    timezone,
    joined_at,
    followers_count,
    following_count,
    project_count,
    preferences,
    metadata,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.id,
    v_name,
    new.email,
    v_slug,
    v_role,
    v_avatar_url,
    'invited',              -- 기본 상태
    'Asia/Seoul',          -- 기본 타임존
    now(),                 -- 가입 시각
    0, 0, 0,               -- count 계열 기본값
    '{}'::jsonb,           -- preferences
    '{}'::jsonb,           -- metadata
    now(),
    now()
  );

  RETURN new;
END;
$$;

create trigger user_to_profile_trigger
after insert on auth.users
for each row execute function public.handle_new_user();


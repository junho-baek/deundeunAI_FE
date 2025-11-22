-- 크레딧 관련 RLS 정책
-- credit_balance 필드는 RPC 함수를 통해서만 수정 가능하도록 제한합니다.

-- 1. profiles 테이블의 credit_balance 필드는 읽기만 가능 (수정 불가)
-- RPC 함수는 SECURITY DEFINER로 실행되므로 RLS를 우회합니다.

-- profiles 테이블에 RLS 활성화 (이미 활성화되어 있을 수 있음)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles 테이블의 credit_balance 필드는 SELECT만 허용
-- UPDATE는 RPC 함수(deduct_credits, grant_credits)를 통해서만 가능
CREATE POLICY "profiles_credit_balance_select_policy"
ON profiles
FOR SELECT
TO authenticated
USING (
  -- 자신의 프로필만 조회 가능
  id = auth.uid() OR
  -- 또는 auth_user_id가 현재 사용자와 일치하는 경우
  auth_user_id = auth.uid()
);

-- profiles 테이블의 credit_balance 필드는 직접 UPDATE 불가
-- RPC 함수를 통해서만 수정 가능하도록 정책을 명시적으로 거부하지 않음
-- (RPC 함수는 SECURITY DEFINER로 실행되므로 RLS를 우회)

-- 2. profile_credit_transactions 테이블: 자신의 거래 내역만 조회 가능
ALTER TABLE profile_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_transactions_select_policy"
ON profile_credit_transactions
FOR SELECT
TO authenticated
USING (
  profile_id = (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT는 RPC 함수를 통해서만 가능 (SECURITY DEFINER)
-- UPDATE, DELETE는 불가

-- 3. profile_credit_usages 테이블: 자신의 사용 내역만 조회 가능
ALTER TABLE profile_credit_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "credit_usages_select_policy"
ON profile_credit_usages
FOR SELECT
TO authenticated
USING (
  profile_id = (
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
  )
);

-- INSERT, UPDATE는 서버 사이드에서만 가능 (RPC 함수 또는 서비스 역할)

-- 주석: RPC 함수는 SECURITY DEFINER로 실행되므로 RLS를 우회합니다.
-- 따라서 credit_balance 필드는 RPC 함수를 통해서만 수정 가능하며,
-- 사용자가 브라우저 콘솔에서 직접 수정하는 것을 방지할 수 있습니다.


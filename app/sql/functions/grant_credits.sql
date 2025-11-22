-- 크레딧 지급 RPC 함수 (원자적 연산 보장)
-- 구독 갱신 시 매달 크레딧을 지급합니다.

CREATE OR REPLACE FUNCTION public.grant_credits(
  p_profile_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- 서비스 역할로 실행 (RLS 우회)
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- 1. 현재 잔액을 조회하고 동시에 잠금 (SELECT FOR UPDATE)
  SELECT credit_balance INTO v_current_balance
  FROM profiles
  WHERE id = p_profile_id
  FOR UPDATE; -- 행 잠금으로 동시성 제어

  -- 프로필이 존재하지 않는 경우
  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', '프로필을 찾을 수 없습니다.',
      'balance', 0
    );
  END IF;

  -- 2. 새 잔액 계산
  v_new_balance := v_current_balance + p_amount;

  -- 3. 트랜잭션 ID 생성
  v_transaction_id := gen_random_uuid();

  -- 4. 잔액 업데이트 및 마지막 지급일 업데이트
  UPDATE profiles
  SET 
    credit_balance = v_new_balance,
    credit_last_granted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_profile_id;

  -- 5. 트랜잭션 기록
  INSERT INTO profile_credit_transactions (
    transaction_id,
    profile_id,
    type,
    amount,
    balance_before,
    balance_after,
    description,
    metadata
  ) VALUES (
    v_transaction_id,
    p_profile_id,
    'granted',
    p_amount, -- 양수로 저장 (지급)
    v_current_balance,
    v_new_balance,
    p_description,
    p_metadata
  );

  -- 6. 성공 응답 반환
  RETURN jsonb_build_object(
    'success', true,
    'balance', v_new_balance,
    'transaction_id', v_transaction_id,
    'balance_before', v_current_balance,
    'balance_after', v_new_balance
  );
END;
$$;

-- 함수에 대한 주석 추가
COMMENT ON FUNCTION public.grant_credits IS '크레딧을 원자적으로 지급합니다. 구독 갱신 시 매달 크레딧 지급에 사용됩니다.';


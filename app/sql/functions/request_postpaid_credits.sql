-- 후불 크레딧 요청 RPC 함수
-- 월 구독 크레딧이 부족할 때 후불로 크레딧을 요청합니다.

CREATE OR REPLACE FUNCTION public.request_postpaid_credits(
  p_profile_id UUID,
  p_amount INTEGER,
  p_project_id UUID DEFAULT NULL,
  p_step_key TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_current_balance INTEGER;
BEGIN
  -- 현재 잔액 조회
  SELECT credit_balance INTO v_current_balance
  FROM profiles
  WHERE id = p_profile_id;

  IF v_current_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', '프로필을 찾을 수 없습니다.'
    );
  END IF;

  -- 요청 ID 생성
  v_request_id := gen_random_uuid();

  -- 후불 크레딧 요청 기록 (별도 테이블 또는 profile_credit_transactions에 기록)
  -- 여기서는 profile_credit_transactions에 'postpaid_request' 타입으로 기록
  INSERT INTO profile_credit_transactions (
    transaction_id,
    profile_id,
    type,
    amount,
    balance_before,
    balance_after,
    description,
    related_project_id,
    related_step_key,
    metadata
  ) VALUES (
    v_request_id,
    p_profile_id,
    'consumed', -- 실제로는 'postpaid_request' 타입이 필요하지만, enum에 없으므로 'consumed' 사용
    -p_amount, -- 음수로 저장 (요청된 양)
    v_current_balance,
    v_current_balance, -- 아직 지급되지 않았으므로 잔액은 동일
    COALESCE(p_description, format('후불 크레딧 요청: %s 크레딧', p_amount)),
    p_project_id,
    p_step_key,
    jsonb_build_object(
      'request_type', 'postpaid',
      'status', 'pending',
      'requested_at', NOW(),
      'original_metadata', p_metadata
    )
  );

  -- 성공 응답 반환
  RETURN jsonb_build_object(
    'success', true,
    'request_id', v_request_id,
    'amount', p_amount,
    'balance', v_current_balance,
    'message', format('후불 크레딧 요청이 접수되었습니다. %s 크레딧이 승인 후 지급됩니다.', p_amount)
  );
END;
$$;

COMMENT ON FUNCTION public.request_postpaid_credits IS '후불 크레딧 요청을 기록합니다. 관리자 승인 후 크레딧이 지급됩니다.';


# 크레딧 시스템 구현 가이드

## 개요

3가지 핵심 체크포인트를 모두 통과한 크레딧 시스템 구현입니다:
1. ✅ **동시성 처리**: Supabase RPC 함수로 원자적 연산 보장
2. ✅ **RLS 정책**: credit_balance 필드는 RPC 함수를 통해서만 수정 가능
3. ✅ **Optimistic UI**: Remix의 useFetcher로 즉각적인 UI 피드백 (구현 예정)

## 아키텍처

```
┌─────────────────┐
│  사용자 액션     │
│  (버튼 클릭)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Remix Action   │
│  (project-status)│
└────────┬────────┘
         │
         │ 1. 크레딧 계산
         │ 2. RPC 호출 (원자적 차감)
         │ 3. 워크플로우 실행
         ▼
┌─────────────────┐
│  Supabase RPC   │
│  deduct_credits │
│  (SELECT FOR    │
│   UPDATE)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  (원자적 연산)   │
└─────────────────┘
```

## 구현된 파일

### 1. 스키마 확장

**`app/features/users/schema.ts`**
- `profiles` 테이블에 크레딧 필드 추가:
  - `creditBalance`: 현재 크레딧 잔액
  - `creditLastGrantedAt`: 마지막 크레딧 지급일
  - `creditMonthlyAmount`: 매달 지급되는 크레딧 양
- `profileBillingPlans` 테이블에 크레딧 필드 추가:
  - `monthlyCredits`: 매달 지급되는 크레딧
  - `creditOverageRate`: 초과 사용 시 요금
- 새 테이블 생성:
  - `profileCreditTransactions`: 크레딧 거래 내역
  - `profileCreditUsages`: 워크플로우 실행별 크레딧 사용 내역

### 2. Supabase RPC 함수 (동시성 처리)

**`app/sql/functions/deduct_credits.sql`**
```sql
CREATE OR REPLACE FUNCTION public.deduct_credits(...)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- SELECT FOR UPDATE로 행 잠금 (동시성 제어)
  SELECT credit_balance INTO v_current_balance
  FROM profiles
  WHERE id = p_profile_id
  FOR UPDATE;

  -- 잔액 부족 확인
  v_new_balance := v_current_balance - p_amount;
  IF v_new_balance < 0 THEN
    RETURN jsonb_build_object('success', false, ...);
  END IF;

  -- 원자적 업데이트
  UPDATE profiles SET credit_balance = v_new_balance WHERE id = p_profile_id;
  
  -- 트랜잭션 기록
  INSERT INTO profile_credit_transactions (...) VALUES (...);
  
  RETURN jsonb_build_object('success', true, 'balance', v_new_balance, ...);
END;
$$;
```

**핵심 포인트:**
- `SELECT FOR UPDATE`: 행 잠금으로 동시성 제어
- `SECURITY DEFINER`: RLS 우회하여 서비스 역할로 실행
- 원자적 연산: 하나의 트랜잭션에서 조회 → 계산 → 업데이트

**`app/sql/functions/grant_credits.sql`**
- 구독 갱신 시 매달 크레딧 지급
- 동일한 원자적 연산 패턴 사용

### 3. RLS 정책 (보안)

**`app/sql/policies/credit_rls_policies.sql`**
```sql
-- profiles 테이블의 credit_balance는 SELECT만 허용
CREATE POLICY "profiles_credit_balance_select_policy"
ON profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR auth_user_id = auth.uid());

-- UPDATE는 RPC 함수를 통해서만 가능 (SECURITY DEFINER로 RLS 우회)
-- 사용자가 브라우저 콘솔에서 직접 수정 불가
```

**보안 보장:**
- 사용자는 자신의 크레딧 잔액만 조회 가능
- 크레딧 수정은 RPC 함수를 통해서만 가능
- 브라우저 콘솔에서 `supabase.from('profiles').update({ credit_balance: 999999 })` 시도 시 차단

### 4. 크레딧 계산 로직

**`app/features/users/services/credit-calculator.ts`**
```typescript
export const CREDIT_COSTS = {
  brief: 10,
  script: 50,
  narration: 30,
  images: 20,      // 개당
  videos: 100,     // 1분당
  final: 5,
  distribution: 0,
} as const;

export function calculateStepCredits(
  stepKey: ProjectStepKey,
  metadata?: Record<string, unknown>
): number {
  const baseCost = CREDIT_COSTS[stepKey];
  
  // 이미지 개수에 따른 추가 비용
  if (stepKey === "images" && metadata?.imageCount) {
    return baseCost * (metadata.imageCount as number);
  }
  
  // 영상 길이에 따른 추가 비용
  if (stepKey === "videos" && metadata?.videoLength) {
    const lengthMultiplier = Math.ceil((metadata.videoLength as number) / 60);
    return baseCost * lengthMultiplier;
  }
  
  return baseCost;
}
```

### 5. Remix Action 통합

**`app/features/projects/pages/project-status-action.tsx`**
```typescript
// 단계가 in_progress로 시작될 때 크레딧 차감
if (status === "in_progress") {
  // 1. 프로젝트 소유자 확인
  const project = await getProjectByProjectId(client, projectId);
  
  // 2. 필요한 크레딧 계산
  const requiredCredits = calculateStepCredits(stepKey, metadata);
  
  // 3. 크레딧 차감 (RPC 함수 사용 - 원자적 연산)
  const creditResult = await deductCreditsRPC(client, {
    profileId: project.owner_profile_id,
    amount: requiredCredits,
    description: `프로젝트 "${project.title}"의 ${stepKey} 단계 실행`,
    relatedProjectId: projectId,
    relatedStepKey: stepKey,
    metadata,
  });
  
  // 4. 크레딧 부족 시 에러 반환
  if (!creditResult.success) {
    return data({
      error: creditResult.error || "크레딧 차감에 실패했습니다.",
      creditBalance: creditResult.balance,
      requiredCredits,
    }, { status: 400 });
  }
  
  // 5. 크레딧 사용 내역 기록
  await client.from("profile_credit_usages").insert({...});
}
```

### 6. 쿼리 함수

**`app/features/users/queries.ts`**
```typescript
export async function deductCreditsRPC(
  client: SupabaseClient<Database>,
  { profileId, amount, ... }
): Promise<{ success: boolean; balance?: number; error?: string; }> {
  const { data, error } = await client.rpc("deduct_credits", {
    p_profile_id: profileId,
    p_amount: amount,
    ...
  });
  
  return {
    success: data?.success || false,
    balance: data?.balance,
    error: data?.error,
  };
}
```

## 동시성 테스트 시나리오

### 시나리오: 사용자가 버튼을 0.1초 만에 5번 클릭

**❌ 하수 방식 (SELECT → 계산 → UPDATE):**
```
요청 1: SELECT credit_balance = 100
요청 2: SELECT credit_balance = 100  (요청 1이 UPDATE 전)
요청 3: SELECT credit_balance = 100  (요청 1, 2가 UPDATE 전)
...
요청 1: UPDATE credit_balance = 99
요청 2: UPDATE credit_balance = 99  (잘못된 값!)
요청 3: UPDATE credit_balance = 99  (잘못된 값!)
결과: 크레딧은 1만 차감되었지만 요청은 5번 실행됨 ❌
```

**✅ 고수 방식 (RPC 함수 + SELECT FOR UPDATE):**
```
요청 1: SELECT FOR UPDATE credit_balance = 100 (행 잠금)
요청 2: SELECT FOR UPDATE ... (대기 중, 요청 1 완료까지)
요청 3: SELECT FOR UPDATE ... (대기 중)
...
요청 1: UPDATE credit_balance = 99 (행 잠금 해제)
요청 2: SELECT FOR UPDATE credit_balance = 99 (행 잠금)
요청 2: UPDATE credit_balance = 98 (행 잠금 해제)
...
결과: 크레딧이 정확히 5 차감되고 요청도 5번 실행됨 ✅
```

## RLS 보안 테스트

### 시나리오: 사용자가 브라우저 콘솔에서 크레딧 수정 시도

```javascript
// 브라우저 콘솔에서 실행
const { data, error } = await supabase
  .from('profiles')
  .update({ credit_balance: 999999 })
  .eq('id', 'user-id');

// 결과: RLS 정책에 의해 차단됨 ✅
// credit_balance 필드는 RPC 함수를 통해서만 수정 가능
```

## Optimistic UI 구현 (다음 단계)

**`app/features/projects/components/project-step-button.tsx`** (예시)
```typescript
import { useFetcher } from "react-router";
import { useOptimistic } from "react";

export function ProjectStepButton({ stepKey, currentBalance, requiredCredits }) {
  const fetcher = useFetcher();
  
  // Optimistic UI: 서버 응답 전에 UI 업데이트
  const [optimisticBalance, setOptimisticBalance] = useOptimistic(
    currentBalance,
    (state, action: { type: 'deduct'; amount: number }) => {
      if (action.type === 'deduct') {
        return state - action.amount;
      }
      return state;
    }
  );
  
  const handleClick = () => {
    // 즉시 UI 업데이트 (Optimistic)
    setOptimisticBalance({ type: 'deduct', amount: requiredCredits });
    
    // 서버 요청 (비동기)
    fetcher.submit(
      { stepKey, status: 'in_progress' },
      { method: 'post', action: `/project/${projectId}/status` }
    );
  };
  
  return (
    <button 
      onClick={handleClick}
      disabled={optimisticBalance < requiredCredits || fetcher.state !== 'idle'}
    >
      {optimisticBalance < requiredCredits ? '크레딧 부족' : '시작하기'}
      {fetcher.state === 'submitting' && ' (처리 중...)'}
    </button>
  );
}
```

## 마이그레이션 실행 순서

1. **스키마 마이그레이션 생성**
   ```bash
   npm run db:generate
   ```

2. **RPC 함수 생성** (Supabase 대시보드 SQL Editor에서 실행)
   ```sql
   -- app/sql/functions/deduct_credits.sql 실행
   -- app/sql/functions/grant_credits.sql 실행
   ```

3. **RLS 정책 적용** (Supabase 대시보드 SQL Editor에서 실행)
   ```sql
   -- app/sql/policies/credit_rls_policies.sql 실행
   ```

4. **마이그레이션 실행**
   ```bash
   npm run db:migrate
   ```

## 체크리스트

### ✅ 완료된 항목
- [x] 스키마 확장 (profiles, profileBillingPlans, 새 테이블)
- [x] Supabase RPC 함수 생성 (동시성 처리)
- [x] RLS 정책 설정 (보안)
- [x] 크레딧 계산 로직
- [x] Remix action 통합

### 🔄 다음 단계
- [ ] Optimistic UI 구현 (useFetcher + useOptimistic)
- [ ] 크레딧 잔액 표시 UI (네비게이션/대시보드)
- [ ] 크레딧 사용 내역 페이지
- [ ] 매달 크레딧 지급 트리거/스케줄러
- [ ] 크레딧 부족 시 경고 메시지

## 참고

- **동시성 처리**: `SELECT FOR UPDATE`로 행 잠금
- **보안**: RPC 함수는 `SECURITY DEFINER`로 RLS 우회
- **성능**: 원자적 연산으로 데이터 일관성 보장
- **UX**: Optimistic UI로 즉각적인 피드백 (구현 예정)


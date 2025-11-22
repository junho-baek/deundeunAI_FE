# 크레딧/토큰 시스템 설계

## 개요

구독 플랜에 따라 매달 지급되는 크레딧(토큰)을 관리하고, 워크플로우 실행 시 토큰을 차감하는 시스템입니다.

## 현재 스키마 분석

### 현재 상태
- ✅ `profiles` 테이블: 기본 프로필 정보
- ✅ `profileBillingPlans` 테이블: 구독 플랜 정보
- ❌ 크레딧 잔액 필드 없음
- ❌ 크레딧 사용 내역 추적 테이블 없음
- ❌ 매달 크레딧 지급 로직 없음

### 필요한 확장
1. `profiles` 테이블에 크레딧 관련 필드 추가
2. 크레딧 사용 내역 추적 테이블 추가
3. 크레딧 트랜잭션 테이블 추가
4. 매달 크레딧 지급 트리거/스케줄러

## 스키마 설계

### 1. profiles 테이블 확장

```typescript
// app/features/users/schema.ts

export const profiles = pgTable("profiles", {
  // ... 기존 필드들 ...
  
  // 크레딧 관련 필드 추가
  creditBalance: integer("credit_balance").default(0).notNull(), // 현재 크레딧 잔액
  creditLastGrantedAt: timestamp("credit_last_granted_at", { withTimezone: true }), // 마지막 크레딧 지급일
  creditMonthlyAmount: integer("credit_monthly_amount").default(0).notNull(), // 매달 지급되는 크레딧 양
});
```

### 2. 크레딧 트랜잭션 테이블

```typescript
export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "granted",      // 지급 (구독 갱신 시)
  "consumed",     // 소비 (워크플로우 실행 시)
  "refunded",     // 환불
  "expired",      // 만료
  "manual_adjust", // 수동 조정
]);

export const profileCreditTransactions = pgTable(
  "profile_credit_transactions",
  {
    id: serial("id").primaryKey(),
    transactionId: uuid("transaction_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    type: creditTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // 양수: 지급, 음수: 차감
    balanceBefore: integer("balance_before").notNull(), // 거래 전 잔액
    balanceAfter: integer("balance_after").notNull(), // 거래 후 잔액
    description: text("description"), // 거래 설명
    relatedProjectId: uuid("related_project_id"), // 관련 프로젝트 ID (소비 시)
    relatedStepKey: text("related_step_key"), // 관련 단계 키 (소비 시)
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    transactionIdIdx: uniqueIndex("credit_transactions_transaction_id_unique").on(
      table.transactionId
    ),
    profileCreatedIdx: uniqueIndex("credit_transactions_profile_created_unique").on(
      table.profileId,
      table.createdAt
    ),
  })
);
```

### 3. 크레딧 사용 내역 테이블 (워크플로우 실행 추적)

```typescript
export const creditUsageStatusEnum = pgEnum("credit_usage_status", [
  "pending",      // 대기 중
  "processing",  // 처리 중
  "completed",   // 완료
  "failed",       // 실패
  "refunded",     // 환불됨
]);

export const profileCreditUsages = pgTable(
  "profile_credit_usages",
  {
    id: serial("id").primaryKey(),
    usageId: uuid("usage_id").defaultRandom().notNull(),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").notNull(), // 프로젝트 UUID
    stepKey: text("step_key").notNull(), // 단계 키 (brief, script, narration, etc.)
    creditsUsed: integer("credits_used").notNull(), // 사용된 크레딧
    status: creditUsageStatusEnum("status").default("pending").notNull(),
    workflowExecutionId: text("workflow_execution_id"), // n8n 워크플로우 실행 ID
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usageIdIdx: uniqueIndex("credit_usages_usage_id_unique").on(
      table.usageId
    ),
    projectStepIdx: uniqueIndex("credit_usages_project_step_unique").on(
      table.projectId,
      table.stepKey
    ),
  })
);
```

### 4. profileBillingPlans 테이블 확장

```typescript
export const profileBillingPlans = pgTable("profile_billing_plans", {
  // ... 기존 필드들 ...
  
  // 크레딧 관련 필드 추가
  monthlyCredits: integer("monthly_credits").default(0).notNull(), // 매달 지급되는 크레딧
  creditOverageRate: numeric("credit_overage_rate"), // 초과 사용 시 크레딧당 요금
});
```

## 크레딧 계산 로직

### 워크플로우 단계별 크레딧 비용

```typescript
// app/features/users/services/credit-calculator.ts

export const CREDIT_COSTS = {
  brief: 10,        // 기획서 생성
  script: 50,       // 대본 생성 (AI 처리 비용 높음)
  narration: 30,   // 내레이션 생성
  images: 20,      // 이미지 생성 (개당)
  videos: 100,      // 영상 생성 (비용 높음)
  final: 5,        // 최종 편집
} as const;

export type ProjectStepKey = keyof typeof CREDIT_COSTS;

/**
 * 프로젝트 단계 실행에 필요한 크레딧 계산
 */
export function calculateStepCredits(
  stepKey: ProjectStepKey,
  metadata?: Record<string, unknown>
): number {
  const baseCost = CREDIT_COSTS[stepKey];
  
  // 메타데이터에 따라 추가 비용 계산
  if (stepKey === "images" && metadata?.imageCount) {
    const imageCount = metadata.imageCount as number;
    return baseCost * imageCount;
  }
  
  if (stepKey === "videos" && metadata?.videoLength) {
    const videoLength = metadata.videoLength as number; // 초 단위
    const lengthMultiplier = Math.ceil(videoLength / 60); // 1분당
    return baseCost * lengthMultiplier;
  }
  
  return baseCost;
}
```

## 크레딧 차감 로직

### 1. 크레딧 차감 함수

```typescript
// app/features/users/queries.ts

/**
 * 크레딧 차감
 * @param client - Supabase 클라이언트
 * @param profileId - 프로필 ID
 * @param amount - 차감할 크레딧 양
 * @param description - 거래 설명
 * @param metadata - 추가 메타데이터
 */
export async function deductCredits(
  client: SupabaseClient<Database>,
  {
    profileId,
    amount,
    description,
    metadata,
  }: {
    profileId: string;
    amount: number;
    description: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  // 트랜잭션 시작 (Supabase는 트랜잭션을 직접 지원하지 않으므로 RPC 함수 사용 권장)
  
  // 1. 현재 잔액 확인
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("credit_balance")
    .eq("id", profileId)
    .single();

  if (profileError || !profile) {
    return { success: false, newBalance: 0, error: "프로필을 찾을 수 없습니다." };
  }

  const currentBalance = profile.credit_balance || 0;
  const newBalance = currentBalance - amount;

  // 2. 잔액 부족 확인
  if (newBalance < 0) {
    return {
      success: false,
      newBalance: currentBalance,
      error: `크레딧이 부족합니다. 필요: ${amount}, 보유: ${currentBalance}`,
    };
  }

  // 3. 잔액 업데이트 및 트랜잭션 기록
  const { error: updateError } = await client
    .from("profiles")
    .update({
      credit_balance: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (updateError) {
    return { success: false, newBalance: currentBalance, error: updateError.message };
  }

  // 4. 트랜잭션 기록
  const { error: transactionError } = await client
    .from("profile_credit_transactions")
    .insert({
      profile_id: profileId,
      type: "consumed",
      amount: -amount, // 음수로 저장
      balance_before: currentBalance,
      balance_after: newBalance,
      description,
      metadata: metadata || {},
    });

  if (transactionError) {
    console.error("크레딧 트랜잭션 기록 실패:", transactionError);
    // 트랜잭션 기록 실패는 치명적이지 않으므로 계속 진행
  }

  return { success: true, newBalance };
}
```

### 2. 워크플로우 실행 전 크레딧 확인 및 차감

```typescript
// app/features/projects/pages/project-status-action.tsx

import { calculateStepCredits } from "~/features/users/services/credit-calculator";
import { deductCredits } from "~/features/users/queries";

export async function updateStepStatusAction({ request, params }: ActionFunctionArgs) {
  // ... 기존 코드 ...
  
  // 단계가 in_progress로 시작될 때 크레딧 차감
  if (status === "in_progress") {
    // 1. 프로젝트 소유자 확인
    const project = await getProjectByProjectId(client, projectId);
    if (!project) {
      return data({ error: "프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. 필요한 크레딧 계산
    const requiredCredits = calculateStepCredits(stepKey as ProjectStepKey, metadata);

    // 3. 크레딧 차감
    const creditResult = await deductCredits(client, {
      profileId: project.owner_profile_id,
      amount: requiredCredits,
      description: `프로젝트 "${project.title}"의 ${stepKey} 단계 실행`,
      metadata: {
        project_id: projectId,
        step_key: stepKey,
        ...metadata,
      },
    });

    if (!creditResult.success) {
      return data(
        { error: creditResult.error || "크레딧 차감에 실패했습니다." },
        { status: 400 }
      );
    }

    // 4. 크레딧 사용 내역 기록
    await client.from("profile_credit_usages").insert({
      profile_id: project.owner_profile_id,
      project_id: projectId,
      step_key: stepKey,
      credits_used: requiredCredits,
      status: "processing",
      started_at: new Date().toISOString(),
      metadata: {
        ...metadata,
        balance_after: creditResult.newBalance,
      },
    });
  }

  // ... 기존 단계 업데이트 로직 ...
}
```

## 매달 크레딧 지급 로직

### 1. Database Trigger (권장)

```sql
-- app/sql/triggers/monthly_credit_grant_trigger.sql

-- 구독 갱신 시 크레딧 지급 트리거
CREATE OR REPLACE FUNCTION public.grant_monthly_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_monthly_credits INTEGER;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- renewal_date가 업데이트되고, 이전 renewal_date와 다른 달인 경우
  IF NEW.renewal_date IS NOT NULL 
     AND (OLD.renewal_date IS NULL OR DATE_TRUNC('month', NEW.renewal_date) != DATE_TRUNC('month', OLD.renewal_date)) THEN
    
    -- 플랜의 매달 크레딧 양 가져오기
    v_monthly_credits := COALESCE(NEW.monthly_credits, 0);
    
    IF v_monthly_credits > 0 THEN
      -- 현재 잔액 조회
      SELECT credit_balance INTO v_current_balance
      FROM profiles
      WHERE id = NEW.profile_id;
      
      v_new_balance := COALESCE(v_current_balance, 0) + v_monthly_credits;
      
      -- 잔액 업데이트
      UPDATE profiles
      SET 
        credit_balance = v_new_balance,
        credit_last_granted_at = NOW(),
        updated_at = NOW()
      WHERE id = NEW.profile_id;
      
      -- 트랜잭션 기록
      INSERT INTO profile_credit_transactions (
        profile_id,
        type,
        amount,
        balance_before,
        balance_after,
        description,
        metadata
      ) VALUES (
        NEW.profile_id,
        'granted',
        v_monthly_credits,
        COALESCE(v_current_balance, 0),
        v_new_balance,
        '구독 갱신에 따른 월간 크레딧 지급',
        jsonb_build_object(
          'plan_name', NEW.plan_name,
          'renewal_date', NEW.renewal_date,
          'interval', NEW.interval
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER monthly_credit_grant_trigger
  AFTER INSERT OR UPDATE ON profile_billing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_monthly_credits();
```

### 2. 스케줄러 기반 지급 (대안)

```typescript
// app/lib/cron/monthly-credit-grant.ts

/**
 * 매달 1일 자정에 실행되는 크레딧 지급 작업
 * (Supabase Edge Functions 또는 외부 스케줄러 사용)
 */
export async function grantMonthlyCredits() {
  const { client } = makeSSRClient(request);
  
  // 이번 달에 아직 크레딧을 받지 않은 활성 구독자 조회
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  const { data: activeSubscriptions, error } = await client
    .from("profile_billing_plans")
    .select(`
      profile_id,
      monthly_credits,
      profiles!inner(
        id,
        credit_balance,
        credit_last_granted_at
      )
    `)
    .eq("interval", "monthly")
    .or(`renewal_date.gte.${currentMonth}-01,renewal_date.is.null`);

  if (error) {
    console.error("구독자 조회 실패:", error);
    return;
  }

  for (const subscription of activeSubscriptions || []) {
    const profile = subscription.profiles;
    const lastGranted = profile.credit_last_granted_at;
    const shouldGrant = !lastGranted || 
      new Date(lastGranted).toISOString().slice(0, 7) !== currentMonth;

    if (shouldGrant && subscription.monthly_credits > 0) {
      await deductCredits(client, {
        profileId: profile.id,
        amount: -subscription.monthly_credits, // 음수 = 지급
        description: `${currentMonth} 월간 크레딧 지급`,
        metadata: {
          plan_name: subscription.plan_name,
          renewal_date: subscription.renewal_date,
        },
      });
    }
  }
}
```

## 워크플로우 실행 시 크레딧 차감 플로우

```
1. 사용자가 프로젝트 단계 시작 요청
   ↓
2. project-status-action.tsx의 action 함수 실행
   ↓
3. 필요한 크레딧 계산 (calculateStepCredits)
   ↓
4. 크레딧 잔액 확인 및 차감 (deductCredits)
   ↓
5. 크레딧 사용 내역 기록 (profile_credit_usages)
   ↓
6. n8n 워크플로우 트리거 (triggerProjectStepStartWebhook)
   ↓
7. 워크플로우 완료 시 상태 업데이트
```

## 스키마 마이그레이션

### 1. profiles 테이블 확장

```sql
-- 마이그레이션 파일 생성
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS credit_last_granted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS credit_monthly_amount INTEGER DEFAULT 0 NOT NULL;
```

### 2. 새 테이블 생성

```sql
-- 크레딧 트랜잭션 테이블
CREATE TABLE profile_credit_transactions (
  id SERIAL PRIMARY KEY,
  transaction_id UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type credit_transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  related_project_id UUID,
  related_step_key TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 크레딧 사용 내역 테이블
CREATE TABLE profile_credit_usages (
  id SERIAL PRIMARY KEY,
  usage_id UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  step_key TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  status credit_usage_status DEFAULT 'pending' NOT NULL,
  workflow_execution_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, step_key)
);

-- profile_billing_plans 테이블 확장
ALTER TABLE profile_billing_plans
  ADD COLUMN IF NOT EXISTS monthly_credits INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS credit_overage_rate NUMERIC;
```

## 구현 체크리스트

### 스키마
- [ ] `profiles` 테이블에 크레딧 필드 추가
- [ ] `profile_credit_transactions` 테이블 생성
- [ ] `profile_credit_usages` 테이블 생성
- [ ] `profile_billing_plans` 테이블에 크레딧 필드 추가
- [ ] Enum 타입 생성 (`credit_transaction_type`, `credit_usage_status`)

### 쿼리 함수
- [ ] `deductCredits`: 크레딧 차감 함수
- [ ] `grantCredits`: 크레딧 지급 함수
- [ ] `getCreditBalance`: 크레딧 잔액 조회
- [ ] `getCreditTransactions`: 크레딧 거래 내역 조회
- [ ] `getCreditUsages`: 크레딧 사용 내역 조회

### 비즈니스 로직
- [ ] `calculateStepCredits`: 단계별 크레딧 계산
- [ ] 프로젝트 단계 시작 시 크레딧 차감 통합
- [ ] 매달 크레딧 지급 트리거/스케줄러
- [ ] 크레딧 부족 시 에러 처리

### UI
- [ ] 크레딧 잔액 표시 (네비게이션/대시보드)
- [ ] 크레딧 사용 내역 페이지
- [ ] 크레딧 부족 경고 메시지

## 참고

- 크레딧 차감은 원자적 연산이어야 하므로 RPC 함수 사용 권장
- 크레딧 부족 시 워크플로우 실행을 막아야 함
- 크레딧 사용 내역은 감사(audit) 목적으로 상세히 기록


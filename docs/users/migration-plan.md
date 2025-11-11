# Users 도메인 마이그레이션 계획 (초안)

최근 리팩터링으로 사용자 스키마가 다음과 같이 정리되었습니다.

- `profiles` (기본 프로필 + 카운트 컬럼)
- 선택 기능: `profile_follows`
- 활동/통계: `profile_activity_metrics`
- 워크스페이스: `profile_workspace_preferences`
- 빌링 모듈: `profile_billing_plans`, `profile_payment_methods`, `profile_invoices`, `profile_billing_notices`
- (뷰) `profile_dashboard_view` – 배포 시 SQL로 생성

아래 단계에 따라 기존 데이터/테이블을 새로운 구조로 이전합니다.

---

## 1. 사전 점검

1. 배포 전, 현재 `user_*` 테이블 및 관련 코드 경로를 파악한다.
2. Supabase `auth.users`와의 FK 의존성이 있는지 확인하고, trigger/정책을 검토한다.
3. 백업:
   ```sql
   create table backup_user_profiles as table user_profiles;
   create table backup_user_billing_plans as table user_billing_plans;
   -- 필요 테이블별 백업 수행
   ```

---

## 2. 스키마 Rename & Column 추가

테이블 rename은 다운타임을 최소화하기 위해 트랜잭션 안에서 진행한다.

```sql
alter table user_profiles rename to profiles;
alter table user_activity_metrics rename to profile_activity_metrics;
alter table user_workspace_preferences rename to profile_workspace_preferences;
alter table user_billing_plans rename to profile_billing_plans;
alter table user_payment_methods rename to profile_payment_methods;
alter table user_invoices rename to profile_invoices;
alter table user_billing_notices rename to profile_billing_notices;
```

추가 컬럼:

```sql
alter table profiles
  add column if not exists followers_count integer default 0 not null,
  add column if not exists following_count integer default 0 not null,
  add column if not exists project_count integer default 0 not null;
```

FK 연결:

```sql
alter table profiles
  drop constraint if exists profiles_auth_user_id_fkey;
alter table profiles
  add constraint profiles_auth_user_id_fkey
    foreign key (auth_user_id)
    references auth.users(id)
    on delete cascade;
```

---

## 3. `profile_billing_plan_benefits` 제거

혜택 데이터를 `profile_billing_plans.benefits_summary`에 병합한다.

```sql
update profile_billing_plans pb
set benefits_summary = (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'key', pbb.benefit_key,
        'label', pbb.label,
        'order', pbb.order
      )
      order by pbb.order
    ),
    '[]'::jsonb
  )
  from profile_billing_plan_benefits pbb
  where pbb.billing_plan_id = pb.id
)
where exists (
  select 1 from profile_billing_plan_benefits pbb
  where pbb.billing_plan_id = pb.id
);

drop table if exists profile_billing_plan_benefits;
```

---

## 4. `projects.owner_profile_id` FK 연결

리팩터링된 Projects 스키마에 맞춰 FK 추가 (이미 코드에 반영됨).

```sql
alter table projects
  add constraint projects_owner_profile_id_fkey
    foreign key (owner_profile_id)
    references profiles(id)
    on delete cascade;
```

데이터 정합성 확인:

```sql
select owner_profile_id
from projects
left join profiles on profiles.id = projects.owner_profile_id
where profiles.id is null;
```
→ 결과가 없도록 필요한 레코드를 보정한다.

---

## 5. 뷰 생성 (선택)

배포 스크립트에서 read-only 뷰를 생성해 UI 쿼리를 단순화한다.

```sql
create view profile_dashboard_view as
  -- docs/users/schema-modularization.md 참고
```

Materialized view가 더 적합하다면 `create materialized view ...`를 사용하고, 리프레시 전략(`refresh materialized view concurrently ...`)을 추가한다.

---

## 6. 데이터 검증 체크리스트

1. 프로필 목록/상세 페이지가 정상 조회되는지 확인.
2. 빌링/결제 페이지에서 Plan, Payment, Invoice 데이터가 노출되는지 확인.
3. 새 프로젝트 생성 시 `owner_profile_id`가 정상 입력되는지 테스트.
4. (선택) 팔로우 기능 활성화 시, `profile_follows` 트리거 또는 API가 정상 동작하는지 검증.

---

## 7. 롤백 전략

- 문제 발생 시 기존 backup 테이블을 원복하고, 테이블 rename을 역순으로 수행.
- FK/뷰를 삭제한 후 원래 구조로 복구한다.
- materialized view를 사용한 경우 `drop materialized view if exists ...`로 제거.

---

> **요약**: 위 절차를 통해 사용자 도메인의 테이블 수를 줄이고, 모듈별 경계를 명확히 유지한 채 프로젝트 도메인과의 FK를 확정할 수 있다. 이후 배포 파이프라인에서 마이그레이션 스크립트를 순차 실행하고, UI 확인 및 백업 복구 전략을 마련하면 안정적으로 전환이 가능하다.


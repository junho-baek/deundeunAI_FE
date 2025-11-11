# Users 도메인 모듈 단순화 제안

이 문서는 `docs/users/data-requirements.md`에서 파생된 UI 요구사항을 토대로, 현재 사용자 도메인 스키마를 모듈 단위로 단순화하거나 뷰/집계 계층을 도입하기 위한 설계안을 요약합니다.

## 1. 모듈 경계 재조정

| 모듈 | 핵심 테이블 | 설계 요점 | 비고 |
| --- | --- | --- | --- |
| 프로필 | `profiles`, `profile_follows` | Supabase `auth.users`와 FK 연동. 소셜 기능(팔로우)은 선택 사항이므로 별도 테이블 유지. | `profiles`에 팔로워/팔로잉/프로젝트 카운트 컬럼을 포함해 기본 메트릭을 즉시 조회 가능하게 함. |
| 활동 메트릭 | `profile_activity_metrics` | UI에서 요구하는 통계(Top5%, 프로젝트 수 등)를 `metric_key` 기반으로 저장. | 추후 배치/실시간 집계 파이프라인에서 업서트. |
| 워크스페이스 선호 | `profile_workspace_preferences` | CTA 라벨/설명 등 UI 텍스트 포함. 복잡성을 줄이기 위해 JSON 필드를 사용하지 않고 테이블형 구조 유지. | `preferences` 컬렉션이 크지 않아 관리 부담이 적음. 필요 시 `profiles.preferences` JSON으로도 이전 가능. |
| 빌링 | `profile_billing_plans`, `profile_payment_methods`, `profile_invoices`, `profile_billing_notices` | 결제·청구 관련 데이터를 모듈화. `benefits_summary`에 혜택 배열을 JSONB로 저장하여 보조 테이블 제거. | `profile_payment_methods` default 제약(한 계정당 기본 결제수단 1개) 유지. |

## 2. 집계 뷰 설계 (쿼리 단순화)

복잡한 조인을 줄이기 위해 다음과 같은 뷰(또는 materialized view)를 도입할 수 있습니다. Drizzle 코드에는 포함하지 않았으며, 인프라 레벨에서 SQL로 생성하는 용도입니다.

```sql
create view profile_dashboard_view as
select
  p.id as profile_id,
  p.name,
  p.email,
  p.role,
  p.company,
  p.followers_count,
  p.following_count,
  p.project_count,
  pb.plan_name,
  pb.price_label,
  pb.renewal_date,
  pb.usage_label,
  pb.usage_highlight_label,
  pb.benefits_summary,
  coalesce(
    jsonb_agg(
      distinct jsonb_build_object(
        'key', pam.metric_key,
        'label', pam.label,
        'value', pam.value,
        'helper', pam.helper
      )
    ) filter (where pam.metric_key is not null),
    '[]'::jsonb
  ) as activity_metrics,
  coalesce(
    jsonb_agg(
      distinct jsonb_build_object(
        'key', pwp.preference_key,
        'title', pwp.title,
        'description', pwp.description,
        'cta', pwp.cta_label,
        'order', pwp."order",
        'enabled', pwp.enabled
      )
    ) filter (where pwp.preference_key is not null),
    '[]'::jsonb
  ) as workspace_preferences,
  (
    select jsonb_build_object(
      'summary_label',
      concat(
        '마지막 결제 · ',
        to_char(coalesce(pi.issued_date, now()), 'YYYY.MM.DD'),
        ' ',
        coalesce(ppm.brand, ''),
        case when ppm.last4 is not null then ' •••• ' || ppm.last4 else '' end
      ),
      'brand', ppm.brand,
      'last4', ppm.last4,
      'holder', ppm.holder_name,
      'expires_label',
      case
        when ppm.expires_month is not null and ppm.expires_year is not null
          then lpad(ppm.expires_month::text, 2, '0') || '/' || right(ppm.expires_year::text, 2)
        else null
      end,
      'billing_email', ppm.billing_email,
      'auto_topup_mode', ppm.auto_topup_mode
    )
    from profile_payment_methods ppm
    left join profile_invoices pi
      on pi.profile_id = ppm.profile_id
    where ppm.profile_id = p.id
    order by ppm.is_default desc, pi.issued_date desc nulls last
    limit 1
  ) as payment_summary
from profiles p
left join profile_billing_plans pb
  on pb.profile_id = p.id
left join profile_activity_metrics pam
  on pam.profile_id = p.id
left join profile_workspace_preferences pwp
  on pwp.profile_id = p.id
group by
  p.id,
  pb.id;
```

> **운영 전략**  
> - 실시간 일관성이 필요 없다면 materialized view + 주기적 리프레시를 고려합니다.  
> - Drizzle 애플리케이션 레이어에서는 위 뷰를 read-only 소스로 취급하고, 원본 테이블은 각 모듈 서비스에서 관리합니다.

## 3. 마이그레이션 고려 사항

1. `profile_billing_plan_benefits` 테이블 제거 → 기존 데이터는 `profile_billing_plans.benefits_summary`로 이동.  
2. `profiles` 테이블에 팔로워/팔로잉/프로젝트 카운트 컬럼을 추가하고, 초기값은 0으로 설정.  
3. (선택) 기존 `user_*` 테이블 네이밍을 새 규칙으로 rename (`ALTER TABLE ... RENAME TO ...`).  
4. 뷰 도입 시, 배포 스크립트에서 `CREATE VIEW`/`DROP VIEW` 순서를 관리하고, 필요한 인덱스(예: `profile_activity_metrics`의 `(profile_id, metric_key)`)를 함께 유지합니다.

## 4. 추후 개선 아이디어

- **메트릭 파이프라인**: ETL 또는 background worker가 `profile_activity_metrics`에 업서트를 수행하도록 하고, 지표 종류를 제한하기 위해 enum 또는 reference table(`activity_metric_catalog`)을 도입할 수 있습니다.
- **워크스페이스 선호 자동화**: 기본 템플릿을 코드로 관리하고, 사용자가 최초 접근 시 복사하는 방식으로 테이블 증식을 줄일 수 있습니다.
- **Billing 연동**: 외부 결제 게이트웨이(Supabase, Stripe 등)에서 들어오는 webhook과 매칭할 수 있도록 `external_id`, `provider` 필드를 확장할 여지가 있습니다.

> 위 제안을 기반으로, 각 모듈 담당 서비스에서 필요한 query/API를 뷰나 경량화된 테이블 하나로 접근할 수 있게 되어, 전체 스키마 복잡도를 낮출 수 있습니다.


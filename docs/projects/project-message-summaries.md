# Project Message Summaries View

프로젝트–에이전트 대화의 최근 상태를 한 번에 읽을 수 있도록 `project_message_summaries` 뷰와 쿼리를 추가했습니다. 서비스 레이어(n8n, 외부 API 등)에서 프로젝트별 최근 메시지와 메시지 개수를 빠르게 조회할 수 있습니다.

## 1. 뷰 정의

`app/sql/views/project-message-summaries.sql`

```sql
CREATE OR REPLACE VIEW project_message_summaries AS
SELECT
  p.project_id AS project_uuid,
  p.id AS project_serial_id,
  p.title,
  p.owner_profile_id,
  COUNT(pm.message_id) AS message_count,
  (
    SELECT pm2.content
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_content,
  (
    SELECT pm2.role
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_role,
  (
    SELECT pm2.created_at
    FROM project_messages pm2
    WHERE pm2.project_id = p.id
    ORDER BY pm2.created_at DESC
    LIMIT 1
  ) AS last_message_at
FROM projects p
LEFT JOIN project_messages pm ON pm.project_id = p.id
GROUP BY
  p.id,
  p.project_id,
  p.title,
  p.owner_profile_id;
```

### 컬럼 설명

| 컬럼 | 설명 |
| --- | --- |
| `project_uuid` | 외부 노출용 UUID (`projects.project_id`) |
| `project_serial_id` | 내부 serial PK |
| `title` | 프로젝트 제목 |
| `owner_profile_id` | 소유자 프로필 ID |
| `message_count` | 누적 메시지 수 |
| `last_message_content` | 가장 최근 메시지 내용 |
| `last_message_role` | `user` 또는 `assistant` |
| `last_message_at` | 가장 최근 메시지 시각 |

## 2. 쿼리 함수

`app/features/projects/queries.ts`  
```ts
export async function getProjectMessageSummaries(
  client: SupabaseClient<Database>,
  { ownerProfileId, limit = 20 }: { ownerProfileId: string; limit?: number }
) {
  return client
    .from("project_message_summaries")
    .select("*")
    .eq("owner_profile_id", ownerProfileId)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(limit);
}
```

## 3. 서비스 레이어 연동 가이드

### 3.1 Supabase SQL 테스트

Supabase SQL Editor에서 특정 소유자의 최근 메시지를 확인:
```sql
select * from project_message_summaries
where owner_profile_id = '00000000-0000-0000-0000-000000000000'
order by last_message_at desc nulls last
limit 10;
```

### 3.2 n8n / 서버 측 예시 (TypeScript)

```ts
const { data, error } = await supabaseClient
  .from("project_message_summaries")
  .select("*")
  .eq("owner_profile_id", ownerProfileId)
  .order("last_message_at", { ascending: false, nullsFirst: false })
  .limit(5);

if (error) throw error;
// data[i].last_message_content 등을 활용
```

### 3.3 유용한 시나리오

1. **프로젝트 목록 카드에 “최근 대화 요약” 노출**  
   메시지 수/최근 대화 내용을 보여주거나 뱃지(“assistant 응답 대기” 등)를 계산할 수 있습니다.

2. **서비스 워커 / n8n 모듈**  
   n8n에서 프로젝트 상태를 주기적으로 점검할 때, 이 뷰만 조회하면 마지막 메시지를 바로 확인할 수 있습니다.

3. **테스트 데이터 검증**  
   mock 프로젝트에 메시지를 몇 개 삽입한 뒤, `project_message_summaries` 뷰를 조회해 `message_count`와 `last_message_*`가 기대대로인지 확인합니다.

## 4. 테스트 절차 요약

1. Supabase SQL Editor에서 뷰 정의 실행 후 `SELECT * FROM project_message_summaries LIMIT 1;`로 스키마 확인.
2. 개발 환경에서 `pnpm supabase db push` 실행 시 뷰가 적용됐는지 확인.
3. `scripts/seed` 또는 UI에서 프로젝트 메시지를 추가하고, 뷰 값이 즉시 반영되는지 검증.
4. 서비스 레이어(n8n/서버)에서 `getProjectMessageSummaries`를 호출하여 JSON 응답이 잘 나오는지 테스트.

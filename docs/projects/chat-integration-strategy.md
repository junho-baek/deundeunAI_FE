# 프로젝트 어시스턴트 챗 – 설계안

## 1. 사용자 입력 → 상태/리다이렉트 흐름

1. **대화 상태 모델링**
   - `ProjectDetailContext`에서 `messages` 타입을 `{ id, role: "user" | "assistant", content }`로 유지하되, 서버 응답을 기반으로 갱신하도록 변경한다.
   - `AgentConversationMock`를 실제 메시지 리스트를 렌더링하는 컴포넌트(예: `ProjectAgentConversation`)로 교체한다.
   - 사용자가 입력한 메시지는 즉시 optimistic update로 `messages`에 추가하고, 서버 응답(키워드/설문/진행 단계)을 받아 후행 메시지로 표시한다.

2. **리다이렉트 조건**
   - 서버에서 “프로젝트 생성(또는 업데이트)이 완료됨” 신호를 받으면 `useNavigate()`로 `/my/dashboard/project/${projectId}/workspace` 등 목표 페이지로 이동한다.
   - 수행 단계:
     1. `handleSubmit`에서 fetch → 응답 JSON 수신.
     2. `response.status === "created"` 등 조건 확인.
     3. `navigate(`/my/dashboard/project/${projectId}/workspace`)`.
   - 실패/진행 중인 경우에는 대화창에 안내 메시지를 추가하고 리다이렉트하지 않는다.

3. **키워드/요약 반영**
   - 서버 응답에 `keyword`, `brief`, `scriptStep` 등을 포함하도록 정의(아래 Supabase 연동 항목 참조).
   - 응답을 `messages`에 push하여 사용자가 입력한 텍스트가 그대로 대화 흐름에 반영되도록 한다.

## 2. Supabase 연동 전략

### 2.1 테이블 정의 초안

| 테이블                    | 주요 컬럼                                                                                          | 용도                               |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `project_messages`        | `id` (uuid), `project_id`, `role` (`user`/`assistant`), `content`, `payload` (jsonb), `created_at` | 대화 로그 저장                     |
| `project_flows`           | `id`, `project_id`, `status` (`draft`/`processing`/`completed`), `metadata` (jsonb), `updated_at`  | 프로젝트 생성 워크플로우 상태 추적 |
| (선택) `project_keywords` | `project_id`, `keyword`, `source_message_id`                                                       | 추출된 키워드 저장(필요 시)        |

### 2.2 API / Edge Function 흐름

1. **클라이언트 → Supabase Edge Function (또는 RPC)**
   - 입력 메시지를 전송 (`POST /functions/v1/project-agent`).
   - Function 내부에서:
     1. `project_messages`에 사용자 메시지 저장.
     2. OpenAI/내부 모델 호출로 응답 생성.
     3. 생성된 키워드/요약을 바탕으로 `projects` 또는 `project_flows` 업데이트.
     4. 어시스턴트 메시지를 `project_messages`에 저장.
     5. 처리 결과를 JSON으로 반환.
2. **클라이언트 수신**
   - 결과 JSON 구조 예시:
     ```json
     {
       "assistantMessage": "프로젝트 초안 설문을 생성했어요...",
       "keyword": "향수 캠페인",
       "status": "created",
       "redirectTo": "/my/dashboard/project/123/workspace"
     }
     ```
   - 이를 기반으로 `messages` 고도화 및 리다이렉트 처리.

### 2.3 인증/보안

- Edge Function에서 Supabase JWT를 검증해 현재 사용자/프로필을 식별.
- 권한 체크: `project_id`가 해당 사용자 소유인지 확인 후 진행.

## 3. 구현 단계별 TODO (후속 개발 참고)

1. **UI 연동**
   - [ ] `ProjectAgentConversation` 컴포넌트 작성 (목록 렌더링, 로딩/에러 표시).
   - [ ] `ChatForm` → `handleSubmit`에서 서버 응답을 await하고 `messages` 상태 갱신.
   - [ ] `useNavigate`로 조건부 리다이렉트 구현.

2. **API 연동**
   - [ ] Supabase Edge Function or Route Handler 작성.
   - [ ] `project_messages`, `project_flows` 등 테이블 생성 마이그레이션.
   - [ ] 응답 JSON 포맷 표준화.

3. **테스트/검증**
   - [ ] 단위: `handleSubmit`에서 성공/실패 시 메시지 상태 검사.
   - [ ] 통합: Edge Function을 통한 실제 대화 플로우 테스트.
   - [ ] 리다이렉트 후 워크스페이스 페이지에서 데이터가 반영되는지 확인.

4. **모니터링**
   - [ ] Supabase 로깅 또는 Sentry 등으로 에러 추적.
   - [ ] 메시지 테이블 용량 관리 정책 수립 (TTL, 보존 기간 등).

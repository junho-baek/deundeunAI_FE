# n8n + MCP 워크플로우 가이드

든든AI 앱에서는 `app/lib/n8n-webhook.ts`가 `project_started`와 `project_step_started` 이벤트를 n8n으로 전달합니다.  
`docs/n8n/project-step-mcp-sample.workflow.json`은 이 이벤트를 받아 MCP(Server)에게 작업을 위임한 뒤, 즉시 응답하는 목업(workflow) 예시입니다.

## 1. 이벤트 계약(Contract)

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `event_type` | string | `project_started` 또는 `project_step_started` |
| `timestamp` | string (ISO) | 앱에서 웹훅을 호출한 시각 |
| `project_id` | string | 외부 공유용 UUID (`projects.project_id`) |
| `project_title` | string | `project_started`에서만 제공 |
| `owner_profile_id` | string | 프로젝트 소유자 (Supabase profile_id) |
| `step_key` | string | `project_step_started` 전용. `brief`, `script` 등 |
| `step_status` | string | 보통 `in_progress` |
| `metadata` | object | 폼 응답, regenerate 대상 asset id 등 선택 정보 |

> **참고**  
> Next.js 측에서 샘플 페이로드를 보내려면 `triggerProjectStartWebhook` 또는 `triggerProjectStepStartWebhook`을 직접 호출하거나, Postman 등으로 n8n 웹훅 URL에 POST 하세요.

## 2. Workflow 구성 요약

1. **Webhook (project-events)**  
   - Method: `POST`, Path: 무작위 UUID.  
   - `Response Mode: responseNode`로 설정하여 마지막 노드 응답을 재사용.

2. **Normalize Body (Function)**  
   - `items[0].json.body` 혹은 raw JSON을 통일.  
   - 없을 경우 400 에러를 던져 console에서 확인할 수 있게 처리.

3. **Event Router (Switch)**  
   - `event_type` 값에 따라 두 갈래(`project_started`, `project_step_started`)로 분기.

4. **Set nodes (Project Started Payload / Step Started Payload)**  
   - n8n → MCP로 넘길 공통 payload 형태를 맞춤.  
   - `metadata`가 없을 경우 기본값을 추가하여 이후 노드에서 null 체크를 피함.

5. **Build MCP Request (Function)**  
   - MCP 서버에 전달할 contract 생성.  
   - 예시에서는 `server: "content-orchestrator"`와 `tool: "prepare_step_context"`를 사용했습니다.  
   - 실제 MCP 엔드포인트나 tool signature에 맞춰 수정하세요.

6. **Mock MCP Response (Function)**  
   - 아직 MCP 서버가 준비되지 않았다는 가정으로 가짜 응답을 생성.  
   - 추후 `HTTP Request` 노드로 교체하여 MCP Gateway(예: `https://mcp.your-domain.dev/run`)에 POST 하세요.

7. **Respond to Webhook**  
   - 즉시 200 OK 및 `status: "queued"` 등을 반환하여 프론트엔드가 다음 단계로 진행 가능.

## 3. 목데이터 흐름

**요청 예시 (`project_step_started`)**

```json
{
  "event_type": "project_step_started",
  "timestamp": "2025-01-10T12:35:00.000Z",
  "project_id": "proj_abc123",
  "owner_profile_id": "profile_xyz",
  "step_key": "narration",
  "step_status": "in_progress",
  "metadata": {
    "regenerated_at": "2025-01-10T12:35:00.000Z",
    "action": "regenerate"
  }
}
```

**Mock MCP 응답 예시**

```json
{
  "status": "queued",
  "mcp_request": {
    "server": "content-orchestrator",
    "tool": "prepare_step_context",
    "arguments": {
      "projectId": "proj_abc123",
      "stepKey": "narration",
      "metadata": {
        "action": "regenerate"
      }
    }
  },
  "mcp_response_sample": {
    "taskId": "mock-task-001",
    "nextAction": "synthesize_narration"
  }
}
```

## 4. 사용 방법

1. **워크플로우 가져오기**  
   - n8n UI → *Import from file* → `docs/n8n/project-step-mcp-sample.workflow.json` 선택.
2. **Webhook URL 노출**  
   - 가져온 후 `Webhook` 노드의 Test URL/Production URL을 확인하고 `.env`의 `N8N_WEBHOOK_URL`에 지정.
3. **MCP Gateway 연결**  
   - `Mock MCP Response` 노드 대신 `HTTP Request` 노드를 추가하고, Body에 `{{$json["mcpRequest"]}}`를 넣어 MCP 서버에 전달.  
   - n8n 1.45+에서는 *Settings → AI → Tooling*에서 MCP 서버 자격 증명을 등록할 수 있으므로, 등록 후 `AI Agent` 노드에서 바로 호출할 수도 있습니다.
4. **응답 포맷 조정**  
   - `Respond to Webhook` 노드에서 `status`, `taskId`, `debug` 등의 필드를 자유롭게 조절.

## 5. 다음 단계 아이디어

- Supabase RPC 또는 Storage에서 추가 컨텍스트를 읽어오는 `HTTP Request`/`Supabase` 노드를 `Build MCP Request` 이전에 배치하면, MCP가 더 풍부한 데이터를 받을 수 있습니다.
- 단계 완료 후 n8n이 `project_messages`에 결과를 역으로 push해야 한다면, Supabase Service Role 키를 사용하는 별도 워크플로우(또는 같은 플로우의 후반부)를 만들어 `project_step_completed` 이벤트를 앱에 되돌려 주는 Webhook을 마련하세요.
- 에러/재시도 히스토리를 위해 `Workflow History → Save Data Error Execution`을 켜고, `Mock MCP Response` 노드를 실제 MCP 호출로 바꾼 뒤 실패 시 Slack/Email 알림을 연결하면 운영 가시성이 좋아집니다.

워크플로우 JSON과 본 문서를 기반으로, 실제 MCP 연동 전에 목킹된 상태에서 end-to-end 테스트를 진행할 수 있습니다.

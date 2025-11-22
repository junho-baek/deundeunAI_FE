/**
 * n8n 웹훅 호출 유틸리티
 * 프로젝트 시작 시 n8n 워크플로우를 트리거합니다.
 */

/**
 * n8n 웹훅 호출
 * @param eventType - 이벤트 타입 (예: 'project_started', 'project_step_started')
 * @param data - 전송할 데이터
 */
export async function triggerN8nWebhook(
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  // 환경 변수에서 n8n 웹훅 URL 가져오기
  // 서버 사이드: process.env 사용 (React Router가 주입)
  // 클라이언트 사이드: import.meta.env 사용
  const isServer = typeof window === "undefined";
  const webhookUrl = isServer
    ? process.env?.N8N_WEBHOOK_URL || process.env?.VITE_N8N_WEBHOOK_URL
    : import.meta.env?.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "n8n 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_WEBHOOK_URL 또는 VITE_N8N_WEBHOOK_URL을 설정해주세요."
    );
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...data,
      }),
    });

    if (!response.ok) {
      console.error(
        "n8n 웹훅 호출 실패:",
        response.status,
        response.statusText
      );
    } else {
      console.log("n8n 웹훅 호출 성공:", eventType);
    }
  } catch (error) {
    // n8n 호출 실패가 프로젝트 생성 실패로 이어지지 않도록 에러를 무시
    console.error("n8n 웹훅 호출 중 에러:", error);
  }
}

/**
 * 프로젝트 시작 이벤트 트리거
 * @param projectData - 프로젝트 데이터
 */
export async function triggerProjectStartWebhook(projectData: {
  project_id: string;
  project_title: string;
  owner_profile_id: string;
  status: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await triggerN8nWebhook("project_started", {
    project_id: projectData.project_id,
    project_title: projectData.project_title,
    owner_profile_id: projectData.owner_profile_id,
    status: projectData.status,
    created_at: projectData.created_at,
    metadata: projectData.metadata || {},
  });
}

/**
 * 프로젝트 단계 시작 이벤트 트리거
 * @param stepData - 단계 데이터
 */
export async function triggerProjectStepStartWebhook(stepData: {
  project_id: string;
  step_key: string;
  step_status: string;
  started_at?: string;
}): Promise<void> {
  await triggerN8nWebhook("project_step_started", {
    project_id: stepData.project_id,
    step_key: stepData.step_key,
    step_status: stepData.step_status,
    started_at: stepData.started_at || new Date().toISOString(),
  });
}

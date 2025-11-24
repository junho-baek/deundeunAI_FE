import type { ShortWorkflowJobRecord } from "~/features/projects/short-workflow";

/**
 * n8n 웹훅 호출 유틸리티
 * 프로젝트 시작 시 n8n 워크플로우를 트리거합니다.
 */

const serverEnv =
  (typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) : {}) ??
  {};
const clientEnv =
  (typeof import.meta !== "undefined"
    ? (import.meta.env as Record<string, string | undefined>)
    : {}) ?? {};

function resolveWebhookUrl(serverKey: string, clientKey: string) {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return serverEnv[serverKey] || serverEnv[clientKey];
  }
  return clientEnv[clientKey];
}

async function postJsonWebhook(
  url: string,
  payload: Record<string, unknown>,
  label: string
) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`${label} 웹훅 호출 실패:`, response.status, response.statusText);
    } else {
      console.log(`${label} 웹훅 호출 성공`);
    }
  } catch (error) {
    console.error(`${label} 웹훅 호출 중 에러:`, error);
  }
}

/**
 * n8n 웹훅 호출
 * @param eventType - 이벤트 타입 (예: 'project_started', 'project_step_started')
 * @param data - 전송할 데이터
 */
export async function triggerN8nWebhook(
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  const webhookUrl = resolveWebhookUrl("N8N_WEBHOOK_URL", "VITE_N8N_WEBHOOK_URL");

  if (!webhookUrl) {
    console.warn(
      "n8n 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_WEBHOOK_URL 또는 VITE_N8N_WEBHOOK_URL을 설정해주세요."
    );
    return;
  }

  await postJsonWebhook(
    webhookUrl,
    {
      event_type: eventType,
      timestamp: new Date().toISOString(),
      ...data,
    },
    `n8n:${eventType}`
  );
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
  shortWorkflowKeyword?: Record<string, unknown> | null;
}): Promise<void> {
  await triggerN8nWebhook("project_started", {
    project_id: projectData.project_id,
    project_title: projectData.project_title,
    owner_profile_id: projectData.owner_profile_id,
    status: projectData.status,
    created_at: projectData.created_at,
    metadata: projectData.metadata || {},
    short_workflow_keyword: projectData.shortWorkflowKeyword || undefined,
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
  metadata?: Record<string, unknown>;
  shortWorkflowKeyword?: Record<string, unknown> | null;
}): Promise<void> {
  await triggerN8nWebhook("project_step_started", {
    project_id: stepData.project_id,
    step_key: stepData.step_key,
    step_status: stepData.step_status,
    started_at: stepData.started_at || new Date().toISOString(),
    ...(stepData.metadata && { metadata: stepData.metadata }),
    short_workflow_keyword: stepData.shortWorkflowKeyword || undefined,
  });
}

/**
 * 선택한 쇼츠 초안을 n8n step2 웹훅으로 전달
 */
export async function triggerShortWorkflowStepTwoWebhook(
  job: ShortWorkflowJobRecord
): Promise<void> {
  const webhookUrl = resolveWebhookUrl(
    "N8N_STEP2_WEBHOOK_URL",
    "VITE_N8N_STEP2_WEBHOOK_URL"
  );

  if (!webhookUrl) {
    console.warn(
      "n8n step2 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_STEP2_WEBHOOK_URL 또는 VITE_N8N_STEP2_WEBHOOK_URL을 설정해주세요."
    );
    return;
  }

  await postJsonWebhook(
    webhookUrl,
    {
      ...job,
    },
    "n8n:short_workflow_step2"
  );
}

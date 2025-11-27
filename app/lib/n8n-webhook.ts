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

/**
 * 개발 환경인지 확인
 */
function isDevelopment(): boolean {
  const nodeEnv = serverEnv.NODE_ENV || clientEnv.MODE || "development";
  return nodeEnv === "development" || nodeEnv === "dev";
}

function resolveWebhookUrl(serverKey: string, clientKey: string) {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return serverEnv[serverKey] || serverEnv[clientKey];
  }
  return clientEnv[clientKey];
}

/**
 * AbortController를 사용한 타임아웃 설정
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

async function postJsonWebhook(
  url: string,
  payload: Record<string, unknown>,
  label: string,
  options?: { timeout?: number; skipInDev?: boolean }
) {
  // 개발 환경에서 건너뛰기 옵션이 있으면 건너뛰기
  if (options?.skipInDev && isDevelopment()) {
    console.warn(
      `[개발 환경] ${label} 웹훅 호출을 건너뜁니다. (URL: ${url})`
    );
    return;
  }

  const timeout = options?.timeout ?? 15000; // 기본 15초

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: createTimeoutSignal(timeout),
    });

    if (!response.ok) {
      console.error(
        `${label} 웹훅 호출 실패:`,
        response.status,
        response.statusText
      );
    } else {
      console.log(`${label} 웹훅 호출 성공`);
    }
  } catch (error: any) {
    // 개발 환경에서는 경고만 표시하고 계속 진행
    if (isDevelopment()) {
      if (error?.name === "AbortError" || error?.code === "UND_ERR_CONNECT_TIMEOUT") {
        console.warn(
          `[개발 환경] ${label} 웹훅 호출 타임아웃 (${timeout}ms). 개발 환경에서는 무시됩니다.`,
          { url }
        );
      } else {
        console.warn(
          `[개발 환경] ${label} 웹훅 호출 중 에러 (무시됨):`,
          error?.message || error,
          { url, errorName: error?.name, errorCode: error?.code }
        );
      }
    } else {
      // 프로덕션 환경에서는 에러 로깅
      console.error(`${label} 웹훅 호출 중 에러:`, error, { url });
    }
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
    `n8n:${eventType}`,
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
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
    "n8n:short_workflow_step2",
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
  );
}

/**
 * 선택한 쇼츠 초안을 n8n step3 웹훅으로 전달 (나레이션 확인 완료 시)
 * body는 step2와 동일하게 job 전체를 전송
 */
export async function triggerShortWorkflowStepThreeWebhook(
  job: ShortWorkflowJobRecord
): Promise<void> {
  const webhookUrl = resolveWebhookUrl(
    "N8N_STEP3_WEBHOOK_URL",
    "VITE_N8N_STEP3_WEBHOOK_URL"
  );

  if (!webhookUrl) {
    console.error(
      "❌ n8n step3 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_STEP3_WEBHOOK_URL 또는 VITE_N8N_STEP3_WEBHOOK_URL을 설정해주세요."
    );
    throw new Error("step3 웹훅 URL이 설정되지 않았습니다.");
  }

  console.log("🔗 [Step3] 웹훅 호출 시작:", {
    url: webhookUrl,
    jobId: job.id,
    jobStatus: job.status,
  });

  await postJsonWebhook(
    webhookUrl,
    {
      ...job,
    },
    "n8n:short_workflow_step3",
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
  );
}

/**
 * 선택한 쇼츠 초안을 n8n step4 웹훅으로 전달 (이미지 확인 완료 시)
 * body는 step2, step3와 동일하게 job 전체를 전송
 */
export async function triggerShortWorkflowStepFourWebhook(
  job: ShortWorkflowJobRecord
): Promise<void> {
  const webhookUrl = resolveWebhookUrl(
    "N8N_STEP4_WEBHOOK_URL",
    "VITE_N8N_STEP4_WEBHOOK_URL"
  );

  if (!webhookUrl) {
    console.error(
      "❌ n8n step4 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_STEP4_WEBHOOK_URL 또는 VITE_N8N_STEP4_WEBHOOK_URL을 설정해주세요."
    );
    throw new Error("step4 웹훅 URL이 설정되지 않았습니다.");
  }

  console.log("🔗 [Step4] 웹훅 호출 시작:", {
    url: webhookUrl,
    jobId: job.id,
    jobStatus: job.status,
  });

  await postJsonWebhook(
    webhookUrl,
    {
      ...job,
    },
    "n8n:short_workflow_step4",
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
  );
}

/**
 * 선택한 쇼츠 초안을 n8n step5 웹훅으로 전달 (영상 확인 완료 시)
 * body는 step2, step3, step4와 동일하게 job 전체를 전송
 */
export async function triggerShortWorkflowStepFiveWebhook(
  job: ShortWorkflowJobRecord
): Promise<void> {
  const webhookUrl = resolveWebhookUrl(
    "N8N_STEP5_WEBHOOK_URL",
    "VITE_N8N_STEP5_WEBHOOK_URL"
  );

  if (!webhookUrl) {
    console.error(
      "❌ n8n step5 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_STEP5_WEBHOOK_URL 또는 VITE_N8N_STEP5_WEBHOOK_URL을 설정해주세요."
    );
    throw new Error("step5 웹훅 URL이 설정되지 않았습니다.");
  }

  console.log("🔗 [Step5] 웹훅 호출 시작:", {
    url: webhookUrl,
    jobId: job.id,
    jobStatus: job.status,
  });

  await postJsonWebhook(
    webhookUrl,
    {
      ...job,
    },
    "n8n:short_workflow_step5",
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
  );
}

/**
 * 선택한 쇼츠 초안을 n8n step6 웹훅으로 전달 (유튜브 업로드 요청 시)
 * body는 step2, step3, step4, step5와 동일하게 job 전체를 전송
 */
export async function triggerShortWorkflowStepSixWebhook(
  job: ShortWorkflowJobRecord
): Promise<void> {
  const webhookUrl = resolveWebhookUrl(
    "N8N_STEP6_WEBHOOK_URL",
    "VITE_N8N_STEP6_WEBHOOK_URL"
  );

  if (!webhookUrl) {
    console.error(
      "❌ n8n step6 웹훅 URL이 설정되지 않았습니다. 환경 변수 N8N_STEP6_WEBHOOK_URL 또는 VITE_N8N_STEP6_WEBHOOK_URL을 설정해주세요."
    );
    throw new Error("step6 웹훅 URL이 설정되지 않았습니다.");
  }

  console.log("🔗 [Step6] 웹훅 호출 시작:", {
    url: webhookUrl,
    jobId: job.id,
    jobStatus: job.status,
  });

  await postJsonWebhook(
    webhookUrl,
    {
      ...job,
    },
    "n8n:short_workflow_step6",
    {
      timeout: 15000, // 15초 타임아웃
      skipInDev: false, // 개발 환경에서도 호출 (필요시 true로 변경)
    }
  );
}

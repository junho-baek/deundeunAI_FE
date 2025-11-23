/**
 * 이미지 재생성 Action
 * 선택한 이미지들을 재생성하기 위해 n8n 웹훅을 호출합니다.
 */

import { type ActionFunctionArgs, data } from "react-router";
import { z } from "zod";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { updateProjectStep } from "../mutations";
import { triggerProjectStepStartWebhook } from "~/lib/n8n-webhook";

const formSchema = z.object({
  imageIds: z
    .string()
    .min(1, "재생성할 이미지를 선택해주세요.")
    .transform((val) => {
      try {
        const parsed = JSON.parse(val);
        if (!Array.isArray(parsed)) {
          throw new Error("Invalid imageIds format");
        }
        return parsed;
      } catch {
        throw new Error("잘못된 이미지 ID 형식입니다.");
      }
    })
    .pipe(z.array(z.coerce.number()).min(1, "최소 1개 이상의 이미지를 선택해주세요.")),
});

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  const { client } = makeSSRClient(request);
  const projectId = params.projectId;

  if (!projectId || projectId === "create") {
    return data({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    await getLoggedInUserId(client);

    const formData = await request.formData();
    const formObject = Object.fromEntries(formData.entries());
    
    // Zod 스키마로 검증
    const { success, data: validatedData, error } = formSchema.safeParse(formObject);

    if (!success) {
      return data(
        {
          error: error.errors[0]?.message || "잘못된 요청 데이터입니다.",
        },
        { status: 400 }
      );
    }

    const imageIds = validatedData.imageIds;

    // images 단계를 in_progress로 변경 (재생성 시작)
    await updateProjectStep(client, projectId, "images", "in_progress", {
      regenerated_image_ids: imageIds,
      regenerated_at: new Date().toISOString(),
    });

    // n8n 웹훅 재호출 (이미지 재생성)
    await triggerProjectStepStartWebhook({
      project_id: projectId,
      step_key: "images",
      step_status: "in_progress",
      started_at: new Date().toISOString(),
      metadata: {
        action: "regenerate",
        image_ids: imageIds,
      },
    });

    return data({
      success: true,
      message: `${imageIds.length}개의 이미지 재생성이 시작되었습니다.`,
    });
  } catch (error) {
    console.error("이미지 재생성 실패:", error);
    return data(
      {
        error:
          error instanceof Error
            ? error.message
            : "이미지 재생성에 실패했습니다.",
      },
      { status: 500 }
    );
  }
}

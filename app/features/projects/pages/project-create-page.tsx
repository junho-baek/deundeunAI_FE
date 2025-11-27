import {
  redirect,
  Route,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  useNavigation,
} from "react-router";
import { z } from "zod";
import { generateProjectUUID, getCurrentUserName } from "~/lib/uuid-utils";
import { createProject, createInitialProjectSteps } from "~/features/projects/mutations";
import { makeSSRClient } from "~/lib/supa-client";
import { getLoggedInProfileId } from "~/features/users/queries";
import { saveProjectMessages } from "~/features/projects/queries";
import ProjectDetailLayout from "~/features/projects/layouts/project-detail-layout";
import ProjectWorkspacePage from "~/features/projects/pages/project-workspace-page";
import { LoaderCircle } from "lucide-react";
import { upsertShortWorkflowKeyword } from "../short-workflow";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 생성",
    },
    {
      name: "description",
      content: "새 프로젝트를 준비하고 워크스페이스로 자동 이동합니다.",
    },
  ];
};

/**
 * 프로젝트 생성 폼 스키마
 * mutations.ts에서도 사용할 수 있도록 export
 */
export const formSchema = z.object({
  keyword: z
    .string()
    .min(1, "프로젝트 키워드를 입력해주세요.")
    .max(100, "프로젝트 키워드는 100자 이하여야 합니다.")
    .trim(),
  aspectRatio: z.enum(["9:16", "16:9", "1:1"]).optional(),
  projectId: z.string().uuid("유효하지 않은 프로젝트 ID 형식입니다.").optional(),
  images: z.array(z.instanceof(File)).optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  // 인증 체크 (로그인하지 않은 경우 자동으로 /auth/login으로 리다이렉트)
  const { client } = makeSSRClient(request);
  await getLoggedInProfileId(client);

  // GET 요청으로 접근한 경우 프로젝트를 생성하지 않고
  // 워크스페이스 레이아웃의 loader를 호출 (프로젝트는 첫 메시지 제출 시 생성됨)
  // project-detail-layout.tsx의 loader를 재사용하되 projectId는 "create"로 설정
  const url = new URL(request.url);
  
  // project-detail-layout.tsx의 loader를 호출하되 projectId를 "create"로 설정
  // 이를 위해 request URL을 수정하여 projectId를 "create"로 설정
  const modifiedRequest = new Request(
    url.toString().replace("/project/create", "/project/create"),
    request
  );

  // project-detail-layout.tsx의 loader를 직접 호출
  // 하지만 params를 전달할 수 없으므로, 직접 loader 로직을 재사용
  const keyword = url.searchParams.get("keyword");
  const aspectRatio = url.searchParams.get("aspectRatio");
  
  // project-detail-layout.tsx의 extractInitialChatPayload와 동일한 로직
  const initialChatPayload = keyword && keyword.trim() 
    ? {
        message: keyword.trim(),
        images: [],
        aspectRatio: (aspectRatio as "9:16" | "16:9" | "1:1") || "9:16",
      }
    : null;

  // 프로젝트는 아직 생성하지 않음 (null 반환)
  // ProjectWorkspacePage의 loader 형식에 맞춰 workspaceData도 포함
  return {
    initialChatPayload,
    project: null,
    projectSteps: [],
    workspaceData: null, // ProjectWorkspacePage의 loader 형식에 맞춤
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const { client } = makeSSRClient(request);
  
  // 로그인한 사용자의 프로필 ID 가져오기 (인증 체크 포함)
  let ownerProfileId: string;
  try {
    ownerProfileId = await getLoggedInProfileId(client);
  } catch (error) {
    // getLoggedInProfileId는 redirect를 throw하거나 에러를 throw함
    if (error && typeof error === "object" && "status" in error) {
      throw error; // redirect 에러는 그대로 전파
    }
    return {
      fieldErrors: {
        keyword: ["로그인이 필요합니다."],
      },
    };
  }

  const formData = await request.formData();
  
  // FormData를 객체로 변환 (Zod 검증을 위해)
  const formObject: Record<string, unknown> = {};
  const images: File[] = [];
  
  for (const [key, value] of formData.entries()) {
    if (key === "images") {
      // images는 배열로 처리
      if (value instanceof File) {
        images.push(value);
      }
    } else {
      formObject[key] = value;
    }
  }
  
  // images 배열이 있으면 추가
  if (images.length > 0) {
    formObject.images = images;
  }

  // Zod 스키마로 유효성 검사
  const { success, data, error } = formSchema.safeParse(formObject);

  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  // 프로젝트 ID 생성 (폼에서 전달된 것이 있으면 사용, 없으면 새로 생성)
  const userName = getCurrentUserName();
  const projectId = data.projectId || generateProjectUUID(userName, data.keyword);

  // 프로젝트 생성
  try {
    const keywordText = data.keyword.trim();
    const projectTitle = keywordText || "새 프로젝트";
    const projectDescription =
      `콘텐츠 키워드: ${keywordText}`.trim();

    const project = await createProject(client, {
      project_id: projectId, // 생성한 UUID 사용
      owner_profile_id: ownerProfileId, // 실제 사용자 프로필 ID 사용
      title: projectTitle,
      description: projectDescription,
      status: "draft",
      visibility: "private",
      config: {
        aspectRatio: data.aspectRatio || "9:16",
      },
      metadata: {
        keyword: data.keyword,
      },
    });

    const shortWorkflowKeyword = await upsertShortWorkflowKeyword(client, {
      projectRowId: project.id,
      ownerProfileId,
      keyword: data.keyword,
      reference: JSON.stringify({
        keyword: data.keyword,
        aspectRatio: data.aspectRatio || "9:16",
      }),
    });

    // 프로젝트 단계 초기화 (serial ID 사용)
    await createInitialProjectSteps(client, project.id);

    // 초기 채팅 내역 저장 (DB에 저장하여 나중에 복원 가능하도록)
    try {
      await saveProjectMessages(client, {
        projectId: project.project_id,
        messages: [
          {
            role: "user",
            content: data.keyword,
            aspectRatio: data.aspectRatio || "9:16",
            attachments: images.map((img) => ({
              name: img.name,
              size: img.size,
            })),
            metadata: {
              isInitialMessage: true,
            },
          },
          {
            role: "assistant",
            content: `네, "${data.keyword}" 주제로 ${data.aspectRatio || "9:16"} 비율의 수익형 쇼츠를 만들어드릴게요! 몇 가지 정보를 더 알려주시면 더 정확한 기획서를 작성할 수 있어요.`,
            stepKey: "brief",
            metadata: {
              isInitialResponse: true,
            },
          },
        ],
      });
    } catch (error) {
      console.error("초기 채팅 내역 저장 실패 (프로젝트 생성은 계속 진행):", error);
    }

    const params = new URLSearchParams();
    params.set("keyword", data.keyword);
    if (data.aspectRatio) {
      params.set("aspectRatio", data.aspectRatio);
    }

    const next = `/my/dashboard/project/${project.project_id}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    throw redirect(next);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }

    console.error("프로젝트 생성 실패:", error);
    
    return {
      fieldErrors: {
        keyword: [
          error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다.",
        ],
      },
    };
  }
}

export default function ProjectCreatePage({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // fieldErrors 추출
  const fieldErrors =
    actionData && "fieldErrors" in actionData
      ? (actionData.fieldErrors as Record<string, string[] | undefined>)
      : undefined;

  // project-detail-layout.tsx를 재사용하여 워크스페이스 UI 표시
  // 프로젝트는 아직 생성되지 않았으므로 null로 전달
  // ProjectWorkspacePage에 workspaceData: null을 props로 전달
  return (
    <ProjectDetailLayout loaderData={loaderData}>
      {fieldErrors && (
        <div className="p-4 mb-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="space-y-1">
            {Object.entries(fieldErrors).map(([field, errors]) =>
              errors?.map((error, index) => (
                <p key={`${field}-${index}`} className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ))
            )}
          </div>
        </div>
      )}
      {isSubmitting && (
        <div className="p-4 mb-4 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <p className="text-sm text-blue-600 dark:text-blue-400">프로젝트를 생성하는 중...</p>
          </div>
        </div>
      )}
      <ProjectWorkspacePage workspaceData={null} />
    </ProjectDetailLayout>
  );
}

import {
  redirect,
  Route,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  useNavigation,
} from "react-router";
import { generateProjectUUID, getCurrentUserName } from "~/lib/uuid-utils";
import { createProject, createInitialProjectSteps } from "~/features/projects/queries";
import { makeSSRClient } from "~/lib/supa-client";
import { getUserById } from "~/features/users/queries";
import ProjectDetailLayout from "~/features/projects/layouts/project-detail-layout";
import ProjectWorkspacePage from "~/features/projects/pages/project-workspace-page";
import { LoaderCircle } from "lucide-react";

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

export async function loader({ request }: LoaderFunctionArgs) {
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
  
  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return {
      error: "로그인이 필요합니다.",
    };
  }

  // 사용자 프로필 정보 가져오기
  let ownerProfileId: string;
  try {
    const profile = await getUserById(client, { id: user.id });
    if (!profile?.id) {
      return {
        error: "프로필을 찾을 수 없습니다.",
      };
    }
    ownerProfileId = profile.id;
  } catch (error) {
    console.error("프로필 조회 실패:", error);
    return {
      error: "프로필을 불러오는데 실패했습니다.",
    };
  }

  const formData = await request.formData();
  const keyword = formData.get("keyword");
  const aspectRatio = formData.get("aspectRatio");
  const projectIdFromForm = formData.get("projectId") as string | null;

  // 유효성 검사
  if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
    return {
      error: "프로젝트 키워드를 입력해주세요.",
    };
  }

  // 프로젝트 ID 생성 (폼에서 전달된 것이 있으면 사용, 없으면 새로 생성)
  const userName = getCurrentUserName();
  const projectId = projectIdFromForm || generateProjectUUID(userName, keyword.trim());

  // 프로젝트 생성
  try {
    const project = await createProject(client, {
      project_id: projectId, // 생성한 UUID 사용
      owner_profile_id: ownerProfileId, // 실제 사용자 프로필 ID 사용
      title: keyword.trim(),
      description: undefined,
      status: "draft",
      visibility: "private",
      config: {
        aspectRatio: typeof aspectRatio === "string" ? aspectRatio : "9:16",
      },
      metadata: {
        keyword: keyword.trim(),
      },
    });

    // 프로젝트 단계 초기화 (serial ID 사용)
    await createInitialProjectSteps(client, project.id);

    const params = new URLSearchParams();
    params.set("keyword", keyword.trim());
    if (typeof aspectRatio === "string" && aspectRatio) {
      params.set("aspectRatio", aspectRatio);
    }

    const next = `/my/dashboard/project/${project.project_id}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    throw redirect(next);
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    
    // redirect 에러는 그대로 전파
    if (error && typeof error === "object" && "status" in error) {
      throw error;
    }
    
    // 다른 에러는 actionData로 반환
    return {
      error: error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다.",
    };
  }
}

export default function ProjectCreatePage({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  // project-detail-layout.tsx를 재사용하여 워크스페이스 UI 표시
  // 프로젝트는 아직 생성되지 않았으므로 null로 전달
  // ProjectWorkspacePage에 workspaceData: null을 props로 전달
  return (
    <ProjectDetailLayout loaderData={loaderData}>
      {actionData?.error && (
        <div className="p-4 mb-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{actionData.error}</p>
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

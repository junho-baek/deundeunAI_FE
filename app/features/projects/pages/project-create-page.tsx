import {
  redirect,
  Route,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { generateProjectUUID, getCurrentUserName } from "~/lib/uuid-utils";
import { createProject, createInitialProjectSteps } from "~/features/projects/queries";
import { DEFAULT_PROFILE_ID } from "~/features/users/services/constants";
import ProjectDetailLayout from "~/features/projects/layouts/project-detail-layout";
import ProjectWorkspacePage from "~/features/projects/pages/project-workspace-page";

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
  const formData = await request.formData();
  const keyword = formData.get("keyword");
  const aspectRatio = formData.get("aspectRatio");
  const projectIdFromForm = formData.get("projectId") as string | null;

  // 프로젝트 ID 생성 (폼에서 전달된 것이 있으면 사용, 없으면 새로 생성)
  const userName = getCurrentUserName();
  const projectId = projectIdFromForm || generateProjectUUID(userName, typeof keyword === "string" ? keyword : undefined);

  // 프로젝트 생성
  try {
    const project = await createProject({
      project_id: projectId, // 생성한 UUID 사용
      owner_profile_id: DEFAULT_PROFILE_ID, // TODO: 실제 인증 시스템에서 가져오기
      title: typeof keyword === "string" && keyword.trim() ? keyword.trim() : "새 프로젝트",
      description: undefined,
      status: "draft",
      visibility: "private",
      config: {
        aspectRatio: typeof aspectRatio === "string" ? aspectRatio : "9:16",
      },
      metadata: {
        keyword: typeof keyword === "string" ? keyword : undefined,
      },
    });

    // 프로젝트 단계 초기화 (serial ID 사용)
    await createInitialProjectSteps(project.id);

    const params = new URLSearchParams();
    if (typeof keyword === "string" && keyword.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (typeof aspectRatio === "string" && aspectRatio) {
      params.set("aspectRatio", aspectRatio);
    }

    const next = `/my/dashboard/project/${project.project_id}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    throw redirect(next);
  } catch (error) {
    console.error("프로젝트 생성 실패:", error);
    // 에러 발생 시에도 리다이렉트 (임시 프로젝트 ID 사용)
    const params = new URLSearchParams();
    if (typeof keyword === "string" && keyword.trim()) {
      params.set("keyword", keyword.trim());
    }
    if (typeof aspectRatio === "string" && aspectRatio) {
      params.set("aspectRatio", aspectRatio);
    }

    const next = `/my/dashboard/project/${projectId}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    throw redirect(next);
  }
}

export default function ProjectCreatePage({ loaderData }: Route.ComponentProps) {
  // project-detail-layout.tsx를 재사용하여 워크스페이스 UI 표시
  // 프로젝트는 아직 생성되지 않았으므로 null로 전달
  // ProjectWorkspacePage에 workspaceData: null을 props로 전달
  return (
    <ProjectDetailLayout loaderData={loaderData}>
      <ProjectWorkspacePage workspaceData={null} />
    </ProjectDetailLayout>
  );
}

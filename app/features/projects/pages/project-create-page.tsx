import {
  redirect,
  Route,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";

function generateTempProjectId() {
  // 서버 연동 전 임시 ID (예: base36 타임스탬프)
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

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
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const keyword = url.searchParams.get("keyword");
  const aspectRatio = url.searchParams.get("aspectRatio");

  if (keyword) params.set("keyword", keyword);
  if (aspectRatio) params.set("aspectRatio", aspectRatio);

  const pid = generateTempProjectId();
  const next = `/my/dashboard/project/${pid}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  throw redirect(next);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const keyword = formData.get("keyword");
  const aspectRatio = formData.get("aspectRatio");

  const pid = generateTempProjectId();
  const params = new URLSearchParams();

  if (typeof keyword === "string" && keyword.trim()) {
    params.set("keyword", keyword.trim());
  }

  if (typeof aspectRatio === "string" && aspectRatio) {
    params.set("aspectRatio", aspectRatio);
  }

  const next = `/my/dashboard/project/${pid}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  throw redirect(next);
}

export default function ProjectCreatePage() {
  return (
    <section>
      <h1>프로젝트 생성 중...</h1>
      <p>잠시만 기다려 주세요. 곧 편집 페이지로 이동합니다.</p>
    </section>
  );
}

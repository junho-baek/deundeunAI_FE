import { useEffect } from "react";
import { type MetaFunction, useNavigate } from "react-router";

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

export default function ProjectCreatePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: 서버에서 실제 생성 API로 교체 후, 응답의 projectId로 navigate
    const pid = generateTempProjectId();
    navigate(`/my/dashboard/project/${pid}`, { replace: true });
  }, [navigate]);

  return (
    <section>
      <h1>프로젝트 생성 중...</h1>
      <p>잠시만 기다려 주세요. 곧 편집 페이지로 이동합니다.</p>
    </section>
  );
}

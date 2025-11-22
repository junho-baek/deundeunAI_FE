import * as React from "react";
import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
  useParams,
} from "react-router";

import { ProjectAccordion } from "~/features/projects/components/project-accordion";
import ProjectPrd from "~/features/projects/components/project-prd";
import ProjectScript from "~/features/projects/components/project-script";
import ProjectScriptAudio from "~/features/projects/components/project-script-audio";
import ProjectImageSelect from "~/features/projects/components/project-image-select";
import ProjectVideoSelect from "~/features/projects/components/project-video-select";
import ProjectFinalVideo from "~/features/projects/components/project-final-video";
import { useProjectDetail } from "~/features/projects/layouts/project-detail-layout";
import { getProjectWorkspaceData } from "~/features/projects/queries";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 프로젝트 워크스페이스",
    },
    {
      name: "description",
      content:
        "생성된 기획서와 대본, 이미지, 영상 자산을 검토하고 최종 편집을 완료하세요.",
    },
  ];
};

/**
 * 프로젝트 워크스페이스 데이터 로더
 * 프로젝트의 문서, 미디어 자산, 오디오 세그먼트 등을 조회합니다
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const projectId = params.projectId;

  if (!projectId || projectId === "create") {
    return {
      workspaceData: null,
    };
  }

  try {
    const workspaceData = await getProjectWorkspaceData(projectId);
    return {
      workspaceData,
    };
  } catch (error) {
    console.error("워크스페이스 데이터 로드 실패:", error);
    return {
      workspaceData: null,
    };
  }
}

export default function ProjectWorkspacePage({
  workspaceData: workspaceDataProp,
}: {
  workspaceData?: Awaited<ReturnType<typeof loader>>["workspaceData"];
} = {}) {
  // useLoaderData는 항상 호출해야 함 (React 규칙)
  // props로 workspaceData가 전달되면 그것을 우선 사용
  // project-create-page.tsx의 loader 데이터도 처리 가능하도록 any 타입 사용
  const loaderData = useLoaderData<any>();

  // loaderData에서 workspaceData 추출 (여러 형식 지원)
  const loaderWorkspaceData = loaderData?.workspaceData ?? null;
  const workspaceData = workspaceDataProp ?? loaderWorkspaceData ?? null;

  // projectId는 optional (project-create-page.tsx에서는 없을 수 있음)
  const params = useParams();
  const projectId = params?.projectId;
  const {
    imageTimelines,
    selectedImages,
    toggleSelectImage,
    videoTimelines,
    selectedVideos,
    toggleSelectVideo,
    loading,
    done,
    narrationSegments: defaultNarrationSegments,
  } = useProjectDetail();

  // 데이터베이스에서 가져온 문서 데이터 사용
  const briefDocument = React.useMemo(() => {
    if (!workspaceData?.documents) return null;
    return workspaceData.documents.find(
      (doc: { type: string }) => doc.type === "brief"
    );
  }, [workspaceData]);

  const scriptDocument = React.useMemo(() => {
    if (!workspaceData?.documents) return null;
    return workspaceData.documents.find(
      (doc: { type: string }) => doc.type === "script"
    );
  }, [workspaceData]);

  // 기획서 마크다운 (데이터베이스에서 가져오거나 기본값)
  const projectBriefMd = React.useMemo(() => {
    if (briefDocument?.content) {
      return briefDocument.content;
    }
    return `# 영상 프로젝트 기획서

**목표**: 수익형 쇼츠 제작

## 콘셉트
- 강렬한 훅으로 시작
- 정보 전달형 전개
- 마지막에 명확한 CTA

## 타깃
- 20-30대 직장인

## 포맷
- 비율 9:16
- 길이 00:30`;
  }, [briefDocument]);

  // 대본 단락 (데이터베이스에서 가져오거나 기본값)
  const scriptParagraphs = React.useMemo(() => {
    if (
      scriptDocument?.content_json &&
      Array.isArray(scriptDocument.content_json)
    ) {
      return scriptDocument.content_json;
    }
    if (scriptDocument?.content) {
      // content를 단락으로 분리 (공백 제거 및 빈 값 필터링)
      return scriptDocument.content
        .split("\n\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0);
    }
    return [
      "00:00 / 00:10 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
      "00:11 / 00:20 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    ];
  }, [scriptDocument]);

  // 오디오 세그먼트 (데이터베이스에서 가져오거나 기본값)
  const narrationSegmentsFromDb = React.useMemo(() => {
    if (
      workspaceData?.audioSegments &&
      workspaceData.audioSegments.length > 0
    ) {
      return workspaceData.audioSegments.map((seg: any, index: number) => ({
        id: seg.id || index + 1,
        label:
          seg.label ||
          seg.timeline_label ||
          `00:${index * 10}–00:${(index + 1) * 10}`,
        src: seg.audio_url || `/audio/seg-${index + 1}.mp3`,
      }));
    }
    return null; // 기본값은 useProjectDetail에서 가져옴
  }, [workspaceData]);

  // 데이터베이스에서 가져온 오디오 세그먼트가 있으면 사용, 없으면 기본값 사용
  const narrationSegments = narrationSegmentsFromDb || defaultNarrationSegments;

  // 이미지 URL 목록 (미디어 자산에서 가져오기)
  const imageUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "image")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);

  // 비디오 URL 목록 (미디어 자산에서 가져오기)
  const videoUrls = React.useMemo(() => {
    if (!workspaceData?.mediaAssets) return null;
    return workspaceData.mediaAssets
      .filter((asset: any) => asset.type === "video")
      .map((asset: any) => asset.source_url || asset.preview_url)
      .filter((url: string | null) => url);
  }, [workspaceData]);

  // 최종 비디오 URL
  const finalVideoUrl = React.useMemo(() => {
    if (workspaceData?.project?.video_url) {
      return workspaceData.project.video_url;
    }
    if (videoUrls && videoUrls.length > 0) {
      return videoUrls[0];
    }
    return null;
  }, [workspaceData, videoUrls]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        <ProjectAccordion defaultValue="step-1">
          <ProjectPrd
            value="step-1"
            title="step 1: 수익형 콘텐츠 기획서"
            markdownHtml={renderMarkdown(projectBriefMd)}
            loading={loading.brief}
            done={done.brief}
          />

          <ProjectScript
            value="step-2"
            title="step 2: 대본 작성"
            paragraphs={scriptParagraphs}
            loading={loading.script}
            done={done.script}
          />

          <ProjectScriptAudio
            value="step-3"
            title="step 3: 나레이션 확인하기"
            segments={narrationSegments}
            loading={loading.narration}
            done={done.narration}
          />

          <ProjectImageSelect
            value="step-4"
            title="step 4: 생성된 이미지"
            images={
              imageUrls && imageUrls.length > 0
                ? imageUrls
                : [
                    "https://github.com/openai.png",
                    "https://github.com/openai.png",
                    "https://github.com/openai.png",
                    "https://github.com/openai.png",
                    "https://github.com/openai.png",
                    "https://github.com/openai.png",
                  ]
            }
            timelines={imageTimelines}
            selected={selectedImages}
            onToggle={toggleSelectImage}
            loading={loading.images}
            done={done.images}
          />

          <ProjectVideoSelect
            value="step-5"
            title="step 5: 생성된 영상 확인하기"
            sources={
              videoUrls && videoUrls.length > 0
                ? videoUrls
                : [
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                  ]
            }
            timelines={videoTimelines}
            selected={selectedVideos}
            onToggle={toggleSelectVideo}
            loading={loading.videos}
            done={done.videos}
          />

          <ProjectFinalVideo
            value="step-6"
            title="step 6: 편집된 영상 확인 및 업로드"
            videoSrc={
              finalVideoUrl ||
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            }
            headline={workspaceData?.project?.title || "바이럴될만한 제목"}
            description={
              workspaceData?.project?.description || "바이럴될만한 설명들"
            }
            durationText="영상 길이 01:00"
            loading={loading.final}
            done={done.final}
          />
        </ProjectAccordion>
      </div>
    </div>
  );
}

function renderMarkdown(md: string): string {
  const safe = md.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = safe.split(/\n/);
  let html = "";
  let inList = false;
  const flush = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  for (const l of lines) {
    let line = l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (/^#\s+/.test(line)) {
      flush();
      html += `<h3>${line.replace(/^#\s+/, "")}</h3>`;
      continue;
    }
    if (/^##\s+/.test(line)) {
      flush();
      html += `<h4>${line.replace(/^##\s+/, "")}</h4>`;
      continue;
    }
    if (/^\-\s+/.test(line)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.replace(/^\-\s+/, "")}</li>`;
      continue;
    }
    if (line.trim() === "") {
      flush();
      html += "<br/>";
    } else {
      flush();
      html += `<p>${line}</p>`;
    }
  }
  flush();
  return html;
}

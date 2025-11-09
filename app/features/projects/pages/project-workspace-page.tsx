import * as React from "react";
import { type MetaFunction } from "react-router";

import { ProjectAccordion } from "~/features/projects/components/project-accordion";
import ProjectPrd from "~/features/projects/components/project-prd";
import ProjectScript from "~/features/projects/components/project-script";
import ProjectScriptAudio from "~/features/projects/components/project-script-audio";
import ProjectImageSelect from "~/features/projects/components/project-image-select";
import ProjectVideoSelect from "~/features/projects/components/project-video-select";
import ProjectFinalVideo from "~/features/projects/components/project-final-video";
import { useProjectDetail } from "~/features/projects/layouts/project-detail-layout";

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

export default function ProjectWorkspacePage() {
  const {
    imageTimelines,
    selectedImages,
    toggleSelectImage,
    videoTimelines,
    selectedVideos,
    toggleSelectVideo,
    loading,
    done,
    narrationSegments,
  } = useProjectDetail();

  const projectBriefMd = React.useMemo(
    () =>
      `# 영상 프로젝트 기획서

**목표**: 수익형 쇼츠 제작

## 콘셉트
- 강렬한 훅으로 시작
- 정보 전달형 전개
- 마지막에 명확한 CTA

## 타깃
- 20-30대 직장인

## 포맷
- 비율 9:16
- 길이 00:30`,
    []
  );

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
            paragraphs={[
              "00:00 / 00:10 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
              "00:11 / 00:20 Lorem ipsum dolor sit amet consectetur adipisicing elit...",
            ]}
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
            images={[
              "https://github.com/openai.png",
              "https://github.com/openai.png",
              "https://github.com/openai.png",
              "https://github.com/openai.png",
              "https://github.com/openai.png",
              "https://github.com/openai.png",
            ]}
            timelines={imageTimelines}
            selected={selectedImages}
            onToggle={toggleSelectImage}
            loading={loading.images}
            done={done.images}
          />

          <ProjectVideoSelect
            value="step-5"
            title="step 5: 생성된 영상 확인하기"
            sources={[
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
              "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            ]}
            timelines={videoTimelines}
            selected={selectedVideos}
            onToggle={toggleSelectVideo}
            loading={loading.videos}
            done={done.videos}
          />

          <ProjectFinalVideo
            value="step-6"
            title="step 6: 편집된 영상 확인 및 업로드"
            videoSrc="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            headline="바이럴될만한 제목"
            description="바이럴될만한 설명들"
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


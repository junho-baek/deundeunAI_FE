import { Link } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Volume2, Plus } from "lucide-react";

export type ProjectCardProps = {
  id: string | number;
  to: string;
  title: string;
  description?: string;
  likes?: string;
  ctr?: string;
  budget?: string;
  tiktokUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  className?: string;
  isCreate?: boolean;
  ctaText?: string;
};

function getYouTubeEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    const qs = "rel=0&controls=0&modestbranding=1&playsinline=1&mute=1";

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        if (id) return `https://www.youtube.com/embed/${id}?${qs}`;
      }
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}?${qs}`;
      }
    }

    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube.com/embed/${id}?${qs}`;
    }
  } catch (_) {
    return null;
  }
  return null;
}

function getTikTokEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("tiktok.com")) {
      const match = u.pathname.match(/\/video\/(\d+)/);
      if (match && match[1]) {
        return `https://www.tiktok.com/embed/v2/video/${match[1]}`;
      }
      const qpId = u.searchParams.get("video_id") || u.searchParams.get("videoId");
      if (qpId) {
        return `https://www.tiktok.com/embed/v2/video/${qpId}`;
      }
    }
  } catch (_) {
    return null;
  }
  return null;
}

function getEmbedSrcFromAny(url: string): string | null {
  return getTikTokEmbedSrc(url) ?? getYouTubeEmbedSrc(url);
}

export default function ProjectCard(props: ProjectCardProps) {
  const { id, to, title, description, likes, ctr, budget, tiktokUrl, videoUrl, thumbnail, className, isCreate, ctaText } = props;

  return (
    <Card className={"p-0 overflow-hidden " + (className ?? "")}> 
      {/* 미디어 프리뷰 (9:16) */}
      <CardContent className="px-0">
        <Link to={to} className="block" aria-label={`${title} 상세보기`}>
          <div className="relative aspect-9/16 w-full overflow-hidden bg-muted">
            {isCreate ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="rounded-xl border-2 border-dashed border-border p-6 bg-background/60 backdrop-blur">
                  <Plus className="size-8" />
                </div>
                <Button className="rounded-full shadow" variant="default">{ctaText ?? "프로젝트 생성"}</Button>
              </div>
            ) : null}
            {/* 영상 또는 이미지 프리뷰 */}
            {!isCreate && tiktokUrl ? (
              <iframe
                className="h-full w-full"
                src={getTikTokEmbedSrc(tiktokUrl) ?? tiktokUrl}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                frameBorder={0}
                allowFullScreen
              />
            ) : !isCreate && videoUrl ? (
              <iframe
                className="h-full w-full"
                src={getYouTubeEmbedSrc(videoUrl) ?? videoUrl}
                title={title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameBorder={0}
                allowFullScreen
              />
            ) : !isCreate && thumbnail ? (
              getEmbedSrcFromAny(thumbnail) ? (
                <iframe
                  className="h-full w-full"
                  src={getEmbedSrcFromAny(thumbnail) as string}
                  title={title}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  frameBorder={0}
                  allowFullScreen
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
              )
            ) : !isCreate ? (
              <div className="h-full w-full bg-linear-to-b from-muted/40 to-muted-foreground/10" />
            ) : null}

            {/* 우상단 볼륨 버튼 (장식용) */}
            {!isCreate && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-3 rounded-full bg-background/70 backdrop-blur"
              aria-label="sound"
            >
              <Volume2 className="size-4" />
            </Button>
            )}

            {/* 좌하단 Recreate 버튼 */}
            {!isCreate && (<Button className="absolute left-3 bottom-3 rounded-full shadow">Recreate →</Button>)}
          </div>
        </Link>
      </CardContent>

      {/* 텍스트 영역 */}
      <CardHeader className="pt-4">
        <Link to={to} className="block">
          <CardTitle className="text-base leading-tight line-clamp-2">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </Link>
        <CardAction />
      </CardHeader>

      {/* 메트릭 영역 */}
      {!isCreate && (
        <CardFooter className="border-t text-sm text-muted-foreground">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium text-foreground">{likes}</span>
              <span>좋아요</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium text-foreground">{ctr}</span>
              <span>클릭률</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium text-foreground">{budget}</span>
              <span>예산</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}



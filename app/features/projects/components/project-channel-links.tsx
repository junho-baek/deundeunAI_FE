import { Youtube, Instagram, Linkedin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Button } from "~/common/components/ui/button";
import { Typography } from "~/common/components/typography";

export type ChannelLink = {
  channel: "youtube" | "instagram" | "linkedin";
  url: string;
};

export type ProjectChannelLinksProps = {
  channelLinks: ChannelLink[];
  title?: string;
  description?: string;
  emptyMessage?: string;
};

export function ProjectChannelLinks({
  channelLinks,
  title = "채널 링크",
  description = "해당 영상이 게시된 채널로 바로 이동해 실시간 반응을 확인하세요.",
  emptyMessage = "등록된 채널 링크가 없습니다.",
}: ProjectChannelLinksProps) {
  const youtubeUrl = channelLinks.find((link) => link.channel === "youtube")?.url;
  const instagramUrl = channelLinks.find((link) => link.channel === "instagram")?.url;
  const linkedinUrl = channelLinks.find((link) => link.channel === "linkedin")?.url;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {youtubeUrl ? (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <a href={youtubeUrl} target="_blank" rel="noreferrer">
              <Youtube className="size-4 text-red-500" />
              YouTube
            </a>
          </Button>
        ) : null}
        {instagramUrl ? (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <Instagram className="size-4 text-pink-500" />
              Instagram
            </a>
          </Button>
        ) : null}
        {linkedinUrl ? (
          <Button
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <a href={linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin className="size-4 text-blue-500" />
              LinkedIn
            </a>
          </Button>
        ) : null}
        {channelLinks.length === 0 && (
          <Typography variant="muted" className="text-sm">
            {emptyMessage}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}


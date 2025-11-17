import * as React from "react";
import { type MetaFunction, useFetcher } from "react-router";
import { ShortsHero } from "~/common/components/shorts-hero";
import type { ChatFormData } from "~/common/components/chat-form";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 쇼츠 제작",
    },
    {
      name: "description",
      content:
        "아이디어를 입력하면 자동으로 쇼츠 스크립트와 자산을 생성하는 체험을 시작하세요.",
    },
  ];
};

export default function ShortsCreatePage() {
  const fetcher = useFetcher();
  const submitting = fetcher.state !== "idle";

  const handleSubmit = React.useCallback(
    async (payload: ChatFormData) => {
      const formData = new FormData();
      formData.append("keyword", payload.message);
      formData.append("aspectRatio", payload.aspectRatio);
      for (const image of payload.images) {
        formData.append("images", image);
      }

      fetcher.submit(formData, {
        method: "post",
        action: "/my/dashboard/project/create",
        encType: "multipart/form-data",
      });
    },
    [fetcher]
  );

  return (
    <section className="min-h-screen w-screen bg-background text-foreground">
      <div className="px-20 space-y-40 min-w-[400px]">
        <ShortsHero
          onSubmit={handleSubmit}
          disabled={submitting}
          className="mt-20"
        />
      </div>
    </section>
  );
}

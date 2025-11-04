import { useNavigate } from "react-router";
import { Typography } from "~/common/components/typography";
import * as React from "react";
import ChatForm from "~/common/components/chat-form";

export default function ShortsCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="px-20 space-y-40 min-w-[400px]">
      <div className="flex flex-col items-center gap-6">
        {/* <Typography variant="h1">든든 AI</Typography> */}
        <Typography variant="muted" className="text-base">
          #1 shorts 제작 도구
        </Typography>

        <h2 className="text-center text-5xl md:text-7xl font-extrabold tracking-tight text-balance bg-linear-to-r from-blue-400 via-cyan-300 via-40% to-fuchsia-400 bg-clip-text text-transparent">
          간단한 아이디어를 수익형 쇼츠로 바꿔보세요
        </h2>
        <div className="w-full flex justify-center">
          <ChatForm onSubmit={() => navigate("/my/dashboard/project/1")} />
        </div>
      </div>
    </div>
  );
}

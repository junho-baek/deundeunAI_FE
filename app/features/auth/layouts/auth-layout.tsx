import { Outlet } from "react-router";

import { FlickeringGrid } from "~/common/components/ui/flickering-grid";
import { Highlighter } from "~/common/components/ui/highlighter";

export default function AuthLayout() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left visual panel */}
      <section className="relative hidden items-center justify-center overflow-hidden bg-primary text-primary-foreground lg:flex">
        <FlickeringGrid
          className="absolute inset-0 opacity-40"
          color="rgb(255, 255, 255)"
          squareSize={6}
          gridGap={10}
          maxOpacity={0.25}
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/80 to-background/40" />
        <div className="relative z-10 flex max-w-xl flex-col items-start justify-center gap-6 p-12 text-start">
          <h1 className="text-5xl font-extrabold leading-tight text-balance text-start">
            <Highlighter action="highlight" color="#87CEFA">
              수익형 콘텐츠
            </Highlighter>{" "}
            제작을 위한
            <br />
            든든한 AI 도구
          </h1>
          <p className="text-lg opacity-90">
            <Highlighter action="underline" color="#FF9800">
              시니어
            </Highlighter>
            와{" "}
            <Highlighter action="underline" color="#FF9800">
              컨텐츠
            </Highlighter>
            를 잇다
          </p>
        </div>
      </section>

      {/* Right auth panel */}
      <section className="flex items-center justify-center py-16 px-6 overflow-y-auto max-h-screen bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

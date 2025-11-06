import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left visual panel */}
      <section className="hidden lg:flex items-center justify-center bg-primary text-primary-foreground p-12">
        <div className="max-w-xl space-y-6">
          <div className="text-sm tracking-widest opacity-80">든든 AI</div>
          <h1 className="text-5xl font-extrabold leading-tight">
            수익형 콘텐츠 제작을 위한
            <br /> 든든한 AI 도구
          </h1>
          <p className="opacity-90">시니어와 컨텐츠를 잇다</p>
        </div>
      </section>

      {/* Right auth panel */}
      <section className="flex items-center justify-center py-16 px-6 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

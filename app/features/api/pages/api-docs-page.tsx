import {
  ArrowRightIcon,
  CircuitBoardIcon,
  KeyIcon,
  ShieldIcon,
} from "lucide-react";
import { Link, type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";

const endpoints = [
  {
    method: "POST",
    path: "/v1/projects",
    description:
      "새 프로젝트를 생성하고 기본 콘텐츠 파이프라인을 초기화합니다.",
  },
  {
    method: "POST",
    path: "/v1/projects/{projectId}/shorts",
    description:
      "설명과 자료를 입력하면 쇼츠 스크립트, 썸네일, 음성을 생성합니다.",
  },
  {
    method: "GET",
    path: "/v1/projects/{projectId}/analytics",
    description: "노출, 클릭, 전환 데이터와 추천 액션을 반환합니다.",
  },
  {
    method: "POST",
    path: "/v1/projects/{projectId}/publish",
    description: "YouTube, TikTok 등 연결된 채널로 예약 업로드를 실행합니다.",
  },
];

const sdks = [
  {
    name: "TypeScript / Node",
    description: "서버리스 · 백엔드 환경에서 빠르게 연동할 수 있는 공식 SDK",
    docs: "https://ddeundeun.ai/docs/sdk/node",
  },
  {
    name: "Python",
    description: "데이터 파이프라인 및 분석 자동화를 위한 경량 클라이언트",
    docs: "https://ddeundeun.ai/docs/sdk/python",
  },
  {
    name: "No-code Connectors",
    description: "Zapier, Make 등 주요 자동화 플랫폼용 프리빌트 커넥터 컬렉션",
    docs: "https://ddeundeun.ai/docs/connectors",
  },
];

type WebhookEvent = {
  name: string;
  description: string;
};

const webhookEvents: WebhookEvent[] = [
  {
    name: "project.generated",
    description:
      "AI 생성 작업이 완료되면 호출됩니다. 결과물 URL이 payload에 포함됩니다.",
  },
  {
    name: "project.published",
    description:
      "콘텐츠가 채널에 업로드되었을 때 전달됩니다. 게시물 상태를 동기화하세요.",
  },
  {
    name: "project.analytics.ready",
    description:
      "지난 24시간 동안의 지표와 추천 액션이 준비되었을 때 호출됩니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - API 문서",
    },
    {
      name: "description",
      content:
        "프로젝트 생성부터 쇼츠 자동 제작, 업로드, 분석까지 든든AI API 연동 가이드와 엔드포인트를 확인하세요.",
    },
  ];
};

export default function ApiDocsPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <CircuitBoardIcon className="size-4" />
            DDEUNDEUN API
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            AI 콘텐츠 워크플로우를 여러분의 서비스에 연결하세요
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            프로젝트 생성, 쇼츠 자동 제작, 업로드 예약, 성과 분석까지 모든
            기능을 API 한 번으로 통합할 수 있습니다. OAuth 기반 인증과 세분화된
            권한으로 엔터프라이즈 환경에서도 안전하게 사용할 수 있습니다.
          </Typography>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="mailto:hello@ddeundeun.ai">
                API 키 발급 신청
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/resources/free">구축 체크리스트 받기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
          <Card className="border-muted/50 bg-background/70">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <KeyIcon className="size-4" />
                Authentication
              </span>
              <CardTitle className="text-2xl font-bold">
                API 인증 방식
              </CardTitle>
              <CardDescription>
                OAuth 2.0 Client Credentials Flow를 기본으로 사용하며, 서버 간
                통신을 위해 전용 서비스 계정 발급을 지원합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left text-sm text-muted-foreground">
              <ol className="list-decimal space-y-3 pl-6">
                <li>파트너 콘솔에서 애플리케이션을 등록합니다.</li>
                <li>
                  Client ID / Secret을 발급받아 토큰 엔드포인트로 액세스 토큰을
                  요청합니다.
                </li>
                <li>
                  요청 헤더에 `Authorization: Bearer &lt;token&gt;`을 포함하여
                  API를 호출합니다.
                </li>
              </ol>
              <pre className="overflow-auto rounded-xl border border-muted/40 bg-muted/10 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                {`POST https://api.ddeundeun.ai/oauth/token
Content-Type: application/json

{
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "audience": "https://api.ddeundeun.ai",
  "grant_type": "client_credentials"
}`}
              </pre>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <ShieldIcon className="size-4" />
                Security
              </span>
              <CardTitle className="text-2xl font-bold">
                보안 및 거버넌스
              </CardTitle>
              <CardDescription>
                GDPR, 국내 개인정보 보호법을 준수하며, 고객 자료는 서울 리전에서
                암호화되어 저장됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>모든 API는 TLS 1.2 이상에서만 통신합니다.</li>
                <li>
                  필요 시 IP 화이트리스트와 요청 서명 기능을 활성화할 수
                  있습니다.
                </li>
                <li>
                  감사 로그를 12개월간 보관하고 CSV로 내보내기할 수 있습니다.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            주요 엔드포인트
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            콘텐츠 제작과 운영을 자동화하기 위해 가장 많이 사용하는
            엔드포인트입니다.
          </Typography>
          <div className="mt-12 space-y-4">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex flex-col gap-2 rounded-2xl border border-muted/40 bg-background/80 p-5 text-left md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    {endpoint.method}
                  </span>
                  <Typography variant="large" className="font-mono text-sm">
                    {endpoint.path}
                  </Typography>
                </div>
                <Typography variant="muted" className="md:max-w-lg">
                  {endpoint.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr]">
          <Card className="border-muted/50 bg-background/70">
            <CardHeader className="gap-4">
              <CardTitle className="text-2xl font-bold">샘플 요청</CardTitle>
              <CardDescription>
                프로젝트를 생성하고 쇼츠를 만드는 과정을 단일 스크립트로
                살펴보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <pre className="overflow-auto rounded-2xl border border-muted/40 bg-muted/10 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
                {`import { DdeundeunAI } from "@ddeundeunai/sdk";

const client = new DdeundeunAI({ apiKey: process.env.DDEUNDEUN_API_KEY });

const project = await client.projects.create({
  title: "시니어 건강 콘텐츠",
  targetAudience: "활동적인 60대",
  primaryGoal: "구독자 전환",
});

const short = await client.shorts.generate(project.id, {
  topic: "무릎 스트레칭 루틴",
  assets: [
    "https://cdn.ddeundeun.ai/reference/mobility.pdf",
    "https://cdn.ddeundeun.ai/reference/stretching.jpg",
  ],
});

await client.shorts.publish(project.id, short.id, {
  channel: "youtube",
  scheduledAt: "2024-11-15T09:00:00+09:00",
});

console.log("Published!", short.previewUrl);`}
              </pre>
              <Button asChild variant="outline">
                <Link to="https://ddeundeun.ai/docs">전체 API 문서 열기</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <CardTitle className="text-2xl font-bold">SDK & 커넥터</CardTitle>
              <CardDescription>
                다양한 환경에서 빠르게 통합할 수 있도록 공식 SDK와 커넥터를
                제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                {sdks.map((sdk) => (
                  <li
                    key={sdk.name}
                    className="rounded-xl border border-primary/20 bg-background/70 p-4"
                  >
                    <p className="font-medium text-foreground">{sdk.name}</p>
                    <p className="text-sm">{sdk.description}</p>
                    <Button asChild variant="link" className="px-0">
                      <a href={sdk.docs} target="_blank" rel="noreferrer">
                        문서 보기
                        <ArrowRightIcon className="ml-2 size-4" />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            Webhook 이벤트
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            워크플로우 자동화를 위해 주요 이벤트를 웹훅으로 전달합니다.
          </Typography>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {webhookEvents.map((event) => (
              <Card
                key={event.name}
                className="border-muted/40 bg-background/80"
              >
                <CardHeader className="gap-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {event.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-xl backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            지금 든든AI API를 도입해 보세요
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            사용 목적과 기존 시스템 환경을 알려주시면 적합한 통합 전략과 PoC
            일정, 요금제를 제안해 드립니다.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="mailto:hello@ddeundeun.ai">
                엔터프라이즈 담당자에게 문의하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/resources/about">든든AI 철학 더 알아보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

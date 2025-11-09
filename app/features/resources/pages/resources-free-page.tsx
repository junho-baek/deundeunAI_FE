import {
  ArrowRightIcon,
  DownloadIcon,
  GiftIcon,
  LightbulbIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
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

const starterKits = [
  {
    title: "시니어 첫 쇼츠 제작 패키지",
    description:
      "폰트가 크게 적용된 스크립트 템플릿, 촬영 체크리스트, 음성 더빙 가이드가 포함되어 있습니다.",
    items: [
      "AI 스크립트 프롬프트 12종",
      "촬영 준비 체크리스트",
      "음성 더빙 따라 읽기 가이드",
    ],
  },
  {
    title: "부업인을 위한 자동화 스타터",
    description:
      "노션과 구글시트에서 바로 사용할 수 있는 콘텐츠 캘린더와 자동화 시나리오를 제공합니다.",
    items: [
      "콘텐츠 캘린더 템플릿",
      "Zapier 시나리오 3종",
      "DM 자동 응답 스크립트",
    ],
  },
  {
    title: "엔터프라이즈 거버넌스 킷",
    description:
      "승인 프로세스, 보안 정책, 템플릿 관리 규정을 정리한 문서를 통해 조직 도입을 준비하세요.",
    items: [
      "콘텐츠 승인 플로우 차트",
      "보안 · 개인정보 관리 가이드",
      "템플릿 버전 관리 시트",
    ],
  },
];

const steps = [
  {
    title: "리소스 선택",
    description:
      "필요한 패키지를 고르면 이메일로 자료와 함께 전용 가이드를 보내드립니다.",
  },
  {
    title: "워크플로우 적용",
    description:
      "자료에 포함된 스텝을 따라 설정하면 바로 콘텐츠 제작과 자동화를 실행할 수 있습니다.",
  },
  {
    title: "코치 피드백 받기",
    description:
      "자료를 사용하다 궁금한 점이 생기면 뉴스레터 답장으로 질문을 보내주세요. 전담 코치가 답변합니다.",
  },
];

const faqs = [
  {
    question: "정말 무료인가요?",
    answer:
      "네. 자료 다운로드와 뉴스레터 구독은 모두 무료입니다. 추가적인 컨설팅이나 맞춤 세팅이 필요할 때에만 별도의 유료 서비스가 제공됩니다.",
  },
  {
    question: "자료는 어떤 형식으로 제공되나요?",
    answer:
      "PDF, Google 문서, 노션, 스프레드시트 등 실무에서 바로 사용할 수 있는 형태로 제공되며, 필요에 따라 복제하여 사용할 수 있습니다.",
  },
  {
    question: "자료 업데이트는 어떻게 받나요?",
    answer:
      "자료가 업데이트되면 이메일로 안내해 드립니다. 뉴스레터를 구독하고 계시면 최신 버전으로 자동 안내됩니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 무료 자료",
    },
    {
      name: "description",
      content:
        "시니어, 부업인, 기업 고객을 위한 든든AI 무료 템플릿과 체크리스트를 이메일로 받아보세요.",
    },
  ];
};

export default function ResourcesFreePage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <GiftIcon className="size-4" />
            Free Resources
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            누구나 시작할 수 있도록, 든든AI 무료 자료를 공개합니다
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            처음 콘텐츠 제작을 시작해도 문제없도록 기획, 촬영, 자동화,
            수익화까지 필요한 리소스를 하나의 패키지로 정리했습니다. 뉴스레터
            구독과 함께 항상 최신 버전을 제공해 드립니다.
          </Typography>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/resources/newsletter">
                무료 뉴스레터 구독하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/auth/join">든든AI 계정 만들기</Link>
            </Button>
          </div>
          <div className="w-full max-w-4xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/20 via-background to-muted/40 p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 무료 자료 패키지 미리보기 이미지가 들어갈 자리입니다.
          </Typography>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Typography variant="h3" className="text-center md:text-3xl">
          무료 스타터 킷 구성
        </Typography>
        <Typography
          variant="muted"
          className="mx-auto mt-3 max-w-2xl text-center"
        >
          시니어, 부업인, 기업 고객을 위한 맞춤 패키지를 선택해 다운로드하세요.
        </Typography>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {starterKits.map((kit) => (
            <Card key={kit.title} className="border-muted/50 bg-background/70">
              <CardHeader className="gap-4">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DownloadIcon className="size-5" />
                </span>
                <CardTitle className="text-xl font-semibold">
                  {kit.title}
                </CardTitle>
                <CardDescription>{kit.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  {kit.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full">
                  <Link to="/resources/newsletter">
                    이메일로 받기
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            세 단계로 빠르게 활용해 보세요
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            자료를 받은 뒤 어떻게 활용하면 좋을지 단계별로 안내해 드립니다.
          </Typography>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="border-muted/40 bg-background/80"
              >
                <CardHeader className="gap-3">
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-semibold">{index + 1}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr]">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <LightbulbIcon className="size-4" />
                Practice
              </span>
              <CardTitle className="text-2xl font-bold">
                실습 영상과 PDF 매뉴얼 함께 제공
              </CardTitle>
              <CardDescription>
                자료에 포함된 QR 코드를 스캔하면 단계별 실습 영상을 시청하실 수
                있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <PlayCircleIcon className="mt-0.5 size-4 text-primary" />
                  <span>15분 길이의 실습 영상으로 함께 따라하기</span>
                </li>
                <li className="flex items-start gap-2">
                  <PlayCircleIcon className="mt-0.5 size-4 text-primary" />
                  <span>문제가 생겼을 때 확인할 수 있는 트러블슈팅 가이드</span>
                </li>
                <li className="flex items-start gap-2">
                  <PlayCircleIcon className="mt-0.5 size-4 text-primary" />
                  <span>커뮤니티 Q&A 게시판 링크 및 오픈 채팅 참여 코드</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              자주 묻는 질문
            </Typography>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-muted/40 bg-muted/10 p-6"
                >
                  <Typography
                    variant="h4"
                    className="text-lg font-semibold text-foreground"
                  >
                    {item.question}
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {item.answer}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-xl backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            자료를 다운받고 첫 번째 결과물을 만들어 보세요
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            어려움이 생기면 언제든지{" "}
            <Link
              to="mailto:hello@ddeundeun.ai"
              className="text-primary underline"
            >
              hello@ddeundeun.ai
            </Link>
            로 문의하거나 커뮤니티에 질문을 남겨 주세요. 든든AI 팀이 직접
            도와드리겠습니다.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/resources/newsletter">
                무료 자료 받기
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link to="/usecases/company">기업 도입 사례 보기</Link>
            </Button>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <ShieldCheckIcon className="size-4" />
            100% 무료 · 언제든지 해지 가능
          </div>
        </div>
      </section>
    </div>
  );
}

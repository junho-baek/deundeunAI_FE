import { ArrowRightIcon, CalendarIcon, MailIcon, TvIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link, useNavigate, type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import { Typography } from "~/common/components/typography";

const weeklySchedule = [
  {
    day: "월요일",
    highlight: "AI 전략 & 데이터 인사이트",
    description:
      "지난주 채널 데이터 분석과 함께 이번 주에 테스트할 콘텐츠 포맷을 제안합니다.",
  },
  {
    day: "수요일",
    highlight: "제작 자동화 템플릿",
    description:
      "쇼츠 스크립트, 썸네일, 프롬프트 등 바로 사용할 수 있는 템플릿을 첨부합니다.",
  },
  {
    day: "금요일",
    highlight: "수익화 · 커뮤니티 소식",
    description:
      "수익 책임 프로그램 소식, 고객 사례, 오프라인 밋업 정보를 공유합니다.",
  },
];

type SampleIssue = {
  title: string;
  description: string;
};

const sampleIssues: SampleIssue[] = [
  {
    title: "72세 김정자 님이 6주 만에 구독자를 10배 늘린 전략",
    description:
      "시니어 맞춤 온보딩과 콘텐츠 A/B 테스트 과정, 실제 대본과 썸네일 프롬프트를 공개합니다.",
  },
  {
    title: "부업인의 시간을 아끼는 자동화 레시피 5선",
    description:
      "노코드 자동화 시나리오, 추천 툴, 워크플로우 템플릿을 한 번에 받아보세요.",
  },
  {
    title: "엔터프라이즈 고객을 위한 거버넌스 체크리스트",
    description:
      "승인 워크플로우, 보안 정책, 사내 시스템과의 연동 가이드를 정리했습니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 뉴스레터",
    },
    {
      name: "description",
      content:
        "매주 수요일 발송되는 든든AI 뉴스레터로 콘텐츠 수익화 전략과 템플릿, 이벤트 소식을 받아보세요.",
    },
  ];
};

export default function ResourcesNewsletterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-8 px-6 pb-16 pt-24 text-center md:pt-28">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <MailIcon className="size-4" />
            Newsletter
          </span>
          <Typography
            variant="h1"
            className="text-balance text-4xl md:text-5xl"
          >
            매주 수요일, 콘텐츠 수익화를 위한 전략과 템플릿을 보내드려요
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            든든AI 뉴스레터는 시니어, 부업인, 브랜드 팀이 실제로 성과를 만든
            운영 전략과 템플릿, 오프라인 이벤트 소식을 전해 드립니다.
          </Typography>
          <Card className="mx-auto w-full max-w-3xl border-primary/20 bg-primary/5">
            <CardHeader className="gap-3 text-left">
              <CardTitle className="text-lg font-semibold">
                지금 이메일을 남기시면 최신 호부터 받아보실 수 있어요
              </CardTitle>
              <CardDescription>
                이메일을 입력하면 뉴스레터와 함께 무료 리소스 키트를
                보내드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-6 text-left">
                  <Typography
                    variant="h4"
                    className="text-lg font-semibold text-primary"
                  >
                    구독 신청이 완료되었습니다!
                  </Typography>
                  <Typography variant="muted" className="mt-2">
                    받은 편지함을 확인해 주세요. 스팸함에 메일이 도착한 경우
                    “스팸 아님”으로 표시해 주시면 안정적으로 받아보실 수
                    있습니다.
                  </Typography>
                </div>
              ) : (
                <Form
                  method="post"
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                    setTimeout(() => {
                      navigate("/resources/free");
                    }, 600);
                  }}
                >
                  <label className="sr-only" htmlFor="newsletter-email">
                    이메일 주소
                  </label>
                  <Input
                    id="newsletter-email"
                    required
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12"
                  />
                  <Button type="submit" size="lg" className="h-12">
                    무료로 구독하기
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Button>
                </Form>
              )}
            </CardContent>
          </Card>
          <div className="w-full max-w-3xl rounded-3xl border border-dashed border-muted/40 bg-linear-to-br from-muted/25 via-background to-muted/40 p-1">
            <div className="aspect-video w-full rounded-[calc(var(--radius-3xl)-4px)] bg-background/80" />
          </div>
          <Typography variant="muted" className="text-xs text-muted-foreground">
            ※ 뉴스레터 미리보기 이미지나 구독자 후기 사진을 위한 공간입니다.
          </Typography>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.6fr_0.4fr] md:items-start">
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              뉴스레터에서 받아보실 수 있는 것
            </Typography>
            <Typography variant="muted">
              든든AI 팀이 매주 큐레이션하는 정보와 실전 자료를 정리해 드립니다.
            </Typography>
            <div className="space-y-4">
              {sampleIssues.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-muted/40 bg-muted/10 p-6"
                >
                  <Typography variant="h4" className="text-lg font-semibold">
                    {item.title}
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {item.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <TvIcon className="size-4" />
                Bonus Content
              </span>
              <CardTitle className="text-2xl font-bold">
                구독자 전용 라이브 세션
              </CardTitle>
              <CardDescription>
                월 1회 진행되는 온라인 라이브와 오프라인 밋업 초대장을 가장 먼저
                받아보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>AI 코치와 함께하는 실시간 워크플로우 점검</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>구독자 전용 템플릿·체크리스트 배포</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRightIcon className="mt-0.5 size-4 text-primary" />
                  <span>시니어·부업인·기업 전용 커뮤니티 초대</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Typography variant="h3" className="text-center md:text-3xl">
            주간 발행 스케줄
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-3 max-w-2xl text-center"
          >
            한 주의 흐름에 맞춰 전략, 실행, 피드백을 단계적으로 제공해 드립니다.
          </Typography>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {weeklySchedule.map((item) => (
              <Card key={item.day} className="border-muted/40 bg-background/80">
                <CardHeader className="gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    <CalendarIcon className="size-4" />
                    {item.day}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {item.highlight}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-lg backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            구독만으로도 든든AI의 운영 자료를 매주 받아보세요
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            뉴스레터 구독자에게만 제공되는 리소스 모음과 이벤트 소식을 놓치지
            마세요. 구독은 언제든지 버튼 한 번으로 취소할 수 있습니다.
          </Typography>
          {submitted ? (
            <div className="mt-8 rounded-xl border border-primary/40 bg-primary/15 p-6 text-left">
              <Typography
                variant="h4"
                className="text-lg font-semibold text-primary"
              >
                이미 구독 신청이 완료되었습니다.
              </Typography>
              <Typography variant="muted" className="mt-2">
                추가 자료가 필요하시면 언제든지{" "}
                <Link
                  to="mailto:hello@ddeundeun.ai"
                  className="text-primary underline"
                >
                  hello@ddeundeun.ai
                </Link>
                에 연락해 주세요.
              </Typography>
            </div>
          ) : (
            <Form
              method="post"
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
                setTimeout(() => {
                  navigate("/resources/free");
                }, 600);
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email-bottom">
                이메일 주소
              </label>
              <Input
                id="newsletter-email-bottom"
                required
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 max-w-lg"
              />
              <Button type="submit" size="lg" className="h-12">
                뉴스레터 시작하기
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </Form>
          )}
        </div>
      </section>
    </div>
  );
}

import {
  ArrowRightIcon,
  BriefcaseIcon,
  Building2Icon,
  ChartSplineIcon,
  ClipboardCheckIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import { Link, type MetaFunction } from "react-router";

import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Typography } from "~/common/components/typography";

const stats = [
  { label: "캠페인 제작 기간 단축", value: "83%" },
  { label: "캠페인별 ROI 향상", value: "3.4배" },
  { label: "협업 인원 동시 작업", value: "최대 20명" },
];

const enterpriseStories = [
  {
    company: "오래살아요 라이프케어",
    result: "헬스케어 쇼츠 캠페인 3주 만에 리드 2,900건 확보",
    description:
      "시니어 고객을 대상으로 건강 정보를 전달하는 기업입니다. 든든AI의 멀티 채널 배포와 safe zone 템플릿을 활용하여 의료 광고 심의를 준수하면서도 35% 높은 전환율을 기록했습니다.",
    solution: [
      "심의 키워드 감지 및 자동 수정",
      "지점별 맞춤 콘텐츠 자동 생성",
      "CRM 연동 리드 자동 배분",
    ],
  },
  {
    company: "해빗 리빙프랜차이즈",
    result: "매장 운영자가 직접 참여하는 로컬 콘텐츠로 월 매출 27% 성장",
    description:
      "지점 점주들이 손쉽게 콘텐츠를 제작하도록 QR 온보딩과 템플릿 라이브러리를 제공했습니다. AI가 수집한 매장별 데이터를 기반으로 지역 맞춤 프로모션까지 자동으로 생성합니다.",
    solution: [
      "점주 전용 모바일 스튜디오",
      "브랜드 가이드 위반 자동 차단",
      "프로모션 성과 리포트 자동화",
    ],
  },
  {
    company: "씨엘 교육그룹",
    result: "AI 튜터 캐릭터 도입으로 신규 수강 문의 4배 증가",
    description:
      "프랜차이즈 학원을 운영하는 기업으로, AI 음성과 캐릭터를 활용해 학습 콘텐츠를 제작했습니다. LMS와 연동하여 학부모에게 맞춤 메시지를 자동 발송하고 있습니다.",
    solution: [
      "LMS · CRM 이중 연동",
      "콘텐츠 승인 워크플로우",
      "지표 기반 A/B 테스트 자동화",
    ],
  },
];

const governance = [
  {
    icon: ShieldCheckIcon,
    title: "컴플라이언스 가드",
    description:
      "금융·의료 등 규제가 필요한 업종을 위해 민감 키워드 필터링과 사전 검수 알림을 제공합니다.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "승인 워크플로우",
    description:
      "기획·제작·검수·배포 단계를 정의하고 역할별 권한을 부여해 브랜드 가이드를 준수합니다.",
  },
  {
    icon: UsersIcon,
    title: "역할 기반 협업",
    description:
      "마케터, 디자이너, 외주 파트너 계정을 분리해버리고 작업 로그와 버전 관리를 자동으로 기록합니다.",
  },
];

const implementation = [
  {
    phase: "1주 차",
    title: "킥오프 & 데이터 정리",
    detail:
      "브랜드 가이드, 기존 캠페인, CRM 연동 범위를 정리하고 AI 학습 데이터를 업로드합니다.",
  },
  {
    phase: "2-3주 차",
    title: "PoC 제작 & 승인 체계 구축",
    detail:
      "파일럿 캠페인을 제작하면서 승인 프로세스를 정교화하고 필요한 통합을 설정합니다.",
  },
  {
    phase: "4주 차 이후",
    title: "전사 확장 & 최적화",
    detail:
      "성과 지표를 대시보드로 모니터링하고, 팀별로 템플릿을 분화해 운영 효율을 높입니다.",
  },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 기업 활용 사례",
    },
    {
      name: "description",
      content:
        "엔터프라이즈 조직이 든든AI로 캠페인을 확장하고 거버넌스를 지킨 실제 도입 사례와 로드맵을 확인하세요.",
    },
  ];
};

export default function UsecasesCompanyPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 mx-auto h-72 max-w-6xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-16 pt-24 md:flex-row md:items-center md:justify-between md:gap-12 md:pt-28">
          <div className="space-y-6 md:w-3/5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              <Building2Icon className="size-4" />
              Enterprise
            </span>
            <Typography variant="h1" className="text-left text-4xl md:text-5xl">
              브랜드 거버넌스를 지키면서도 빠르게 실행하는 기업형 AI 스튜디오
            </Typography>
            <Typography variant="lead" className="text-muted-foreground">
              든든AI는 여러 지점과 파트너가 참여하는 대규모 조직을 위해 승인
              프로세스, 보안, 거버넌스를 갖춘 전용 워크플로우를 제공합니다.
              캠페인 기획부터 리드 전환까지 하나의 대시보드에서 관리해 보세요.
            </Typography>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="mailto:hello@ddeundeun.ai">
                  엔터프라이즈 상담 예약하기
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/api/docs">
                  API 통합 가이드 살펴보기
                  <ArrowRightIcon className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 rounded-2xl border border-primary/20 bg-background/70 p-6 backdrop-blur md:w-2/5">
            <div className="w-full rounded-2xl border border-dashed border-muted/40 bg-linear-to-br from-muted/30 via-background to-muted/40 p-1">
              <div className="aspect-video w-full rounded-[calc(var(--radius-2xl)-4px)] bg-background/80" />
            </div>
            <Typography
              variant="muted"
              className="text-xs text-muted-foreground"
            >
              ※ 향후 엔터프라이즈 대시보드나 파트너 사진이 들어갈 자리입니다.
            </Typography>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-5 text-center"
              >
                <Typography
                  variant="large"
                  className="text-3xl font-bold text-primary"
                >
                  {stat.value}
                </Typography>
                <Typography variant="muted">{stat.label}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Typography variant="h3" className="md:text-3xl">
              엔터프라이즈 도입 사례
            </Typography>
            <Typography variant="muted">
              규제가 있는 산업과 전국 단위 조직이 든든AI로 캠페인을 확장한
              방법을 확인해 보세요.
            </Typography>
          </div>
          <Button asChild variant="ghost">
            <Link to="/usecases/freelancer">부업/크리에이터 사례 보기</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {enterpriseStories.map((story) => (
            <Card key={story.company} className="h-full border-muted/60">
              <CardHeader className="gap-3">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {story.result}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-foreground/80">
                  {story.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{story.description}</p>
                <ul className="space-y-2">
                  {story.solution.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <BriefcaseIcon className="mt-0.5 size-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[0.95fr_1.05fr] md:py-20">
          <Card className="border-primary/25 bg-primary/5">
            <CardHeader className="gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <ShieldCheckIcon className="size-4" />
                Governance Toolkit
              </span>
              <CardTitle className="text-2xl font-bold">
                브랜드 및 규제 거버넌스를 지키는 도구 세트
              </CardTitle>
              <CardDescription>
                다수의 이해관계자가 협업할 때도 안전하고 일관된 콘텐츠가
                제작되도록 설계했습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {governance.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl bg-background/80 p-4"
                >
                  <span className="mt-1 flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" size="lg">
                <Link to="/resources/free">거버넌스 체크리스트 받기</Link>
              </Button>
            </CardFooter>
          </Card>
          <div className="space-y-6">
            <Typography variant="h3" className="md:text-3xl">
              4주 안에 전사 도입을 완료하는 로드맵
            </Typography>
            <Typography variant="muted">
              구축형 프로젝트가 아닌 SaaS형 도입으로, 내부 IT 리소스를 최소화한
              채 빠르게 적용할 수 있습니다.
            </Typography>
            <div className="space-y-5">
              {implementation.map((step) => (
                <div
                  key={step.phase}
                  className="rounded-xl border border-muted/40 bg-background/70 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {step.phase}
                    </span>
                    <ChartSplineIcon className="size-5 text-primary" />
                  </div>
                  <Typography
                    variant="h4"
                    className="mt-2 text-lg font-semibold"
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-sm">
                    {step.detail}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-primary/30 bg-primary/10 p-10 text-center shadow-xl backdrop-blur">
          <Typography variant="h3" className="text-3xl">
            전사 도입을 위한 맞춤 워크숍을 제공해 드립니다.
          </Typography>
          <Typography variant="muted" className="mx-auto mt-4 max-w-3xl">
            엔터프라이즈 상담을 신청하시면 현업 실무자와 함께하는 90분 워크숍과
            PoC 지원을 무료로 제공합니다. 브랜드 거버넌스를 지키며 빠르게 실행해
            보세요.
          </Typography>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="ghost">
              <Link to="/usecases/senior">시니어 파트너십 사례 보기</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="mailto:hello@ddeundeun.ai">
                엔터프라이즈 미팅 예약
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

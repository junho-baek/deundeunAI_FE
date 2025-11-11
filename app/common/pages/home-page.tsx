import {
  Link,
  Outlet,
  type MetaFunction,
  useNavigate,
  useOutlet,
} from "react-router";
import { Button } from "~/common/components/ui/button";
import { ShortsHero } from "~/common/components/shorts-hero";

export const meta: MetaFunction = () => {
  return [
    { title: "든든AI - 시니어도 쉽게 제작하는 수익형 컨텐츠" },
    { name: "description", content: "든든AI 홈페이지에 오신 것을 환영합니다." },
  ];
};

export default function HomePage() {
  const navigate = useNavigate();
  const outlet = useOutlet();
  return (
    <div className="bg-background text-foreground">
      <section className="pb-40 w-screen bg-background text-foreground">
        <div className="px-20 space-y-40 min-w-[400px]">
          <ShortsHero
            onSubmit={() => navigate("/my/dashboard/project/create")}
            className="mt-20"
          />
        </div>
      </section>
      {outlet ?? <SeniorShowcase />}
    </div>
  );
}

function SeniorShowcase() {
  return (
    <section className="border-t bg-muted/10">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Senior Makers
          </p>
          <h3 className="text-3xl font-bold text-foreground md:text-4xl">
            시니어도 첫 수익을 만드는 든든AI 파트너십
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            전화 온보딩부터 자동 제작, 수익 분석까지 전 과정을 대신하는 ‘수익
            파트너’ 모델을 만나보세요. 디지털이 낯설어도 4주 안에 첫 쇼츠 수익을
            만드는 시니어 고객 사례를 소개합니다.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 rounded-full bg-primary" />
              <span>평균 첫 수익 달성 기간 4.5주, 만족도 92%</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 rounded-full bg-primary" />
              <span>온·오프라인 코치 전담제와 가족 협업 초대 지원</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 size-1.5 rounded-full bg-primary" />
              <span>다음 수익 제안까지 자동으로 추천하는 리포트</span>
            </li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/usecases/senior">시니어 성공 사례 바로 보기</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/resources/about">든든AI 소개 읽어보기</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-muted/30 bg-background/70 p-6 shadow-sm">
          <div className="aspect-4/3 w-full rounded-2xl border border-dashed border-muted/40 bg-linear-to-br from-primary/10 via-background to-muted/20" />
          <p className="mt-3 text-xs text-muted-foreground">
            ※ 향후 실제 고객 온보딩 장면이나 성과 대시보드 이미지가 들어갈
            자리입니다.
          </p>
        </div>
      </div>
    </section>
  );
}

import { CheckCircle2, PartyPopper } from "lucide-react";
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

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 구독 완료",
    },
    {
      name: "description",
      content:
        "든든 수익 책임제 구독이 완료되었습니다. 전담 코치가 곧 연락드리며 첫 수익 달성을 함께 준비합니다.",
    },
  ];
};

export default function SubscribeSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-20">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            든든 수익 책임제가 시작됐어요!
          </CardTitle>
          <CardDescription>
            시니어 전담 코치가 24시간 내에 연락드려 첫 수익 목표를 함께
            설계합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-dashed bg-background/70 p-4 text-sm text-muted-foreground">
            <p>
              14일 체험 기간 동안 진행 사항을 체크하고, 목표 달성 여부를
              안내해드립니다. 제시된 가이드를 충족했는데도 수익이 나지 않으면
              전액 환불을 도와드릴게요.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 text-sm font-semibold text-primary">
            <PartyPopper className="size-4" />첫 번째 수익형 쇼츠 제작, 든든AI가
            끝까지 책임집니다.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link to="/my/dashboard">대시보드로 이동</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <Link to="/my/dashboard/project/create">
              새로운 프로젝트 바로 만들기
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

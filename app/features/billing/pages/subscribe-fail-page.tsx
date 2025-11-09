import { AlertTriangle, Headset, RotateCcw } from "lucide-react";
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
      title: "든든AI - 결제 실패",
    },
    {
      name: "description",
      content:
        "결제 과정에서 오류가 발생했습니다. 안내에 따라 다시 시도하거나 고객 지원을 통해 도움을 받으세요.",
    },
  ];
};

export default function SubscribeFailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-20">
      <Card className="w-full max-w-md text-center shadow-md">
        <CardHeader className="items-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-8" />
          </div>
          <CardTitle className="text-2xl font-bold">
            결제에 실패했어요
          </CardTitle>
          <CardDescription>
            수익 책임제가 시작되기 전 단계에서 오류가 발생했습니다. 아래 안내를
            확인하고 다시 결제하면 혜택을 그대로 적용받을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left text-sm text-muted-foreground">
          <ul className="space-y-3">
            <li>· 카드 한도 및 유효기간을 다시 한번 확인해주세요.</li>
            <li>· 간헐적인 장애일 수 있으니 잠시 후 다시 시도해보세요.</li>
            <li>
              · 계속 실패한다면 다른 결제 수단을 사용하거나 고객 지원에
              문의해주세요.
            </li>
            <li>
              · 문제 해결 후 동일한 링크로 접속하면 수익 책임제가 바로
              적용됩니다.
            </li>
          </ul>
          <div className="rounded-lg border border-dashed bg-background/80 p-4">
            <p className="font-semibold text-foreground">
              도움이 필요하신가요?
            </p>
            <p>
              <a
                href="mailto:hello@ddeundeun.ai"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                hello@ddeundeun.ai
              </a>{" "}
              로 연락 주시면 빠르게 도와드리고, 수익 책임제 시작도 함께
              도와드립니다.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link to="/subscribe">
              <RotateCcw className="size-4" />
              다시 시도하기
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full">
            <a href="mailto:hello@ddeundeun.ai">
              <Headset className="size-4" />
              고객 지원에 문의
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

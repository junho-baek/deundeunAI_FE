import { Button } from "~/common/components/ui/button";
import { Link, type MetaFunction } from "react-router";

import { Typography } from "../components/typography";

export const meta: MetaFunction = () => {
  return [
    { title: "든든AI - 시니어도 쉽게 제작하는 수익형 컨텐츠" },
    { name: "description", content: "든든AI 홈페이지에 오신 것을 환영합니다." },
  ];
};

export default function HomePage() {
  return (
    <div className="px-20 space-y-40 min-w-[400px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch content-start">
        <div className="flex flex-col">
          <Typography variant="h2">든든</Typography>
          <Typography variant="lead">
            시니어도 쉽게 제작하는
            <Typography variant="inlineCode">수익형</Typography> 컨텐츠
          </Typography>
          <Button variant="link" asChild className="text-lg p-0 self-end">
            <Link to="/products/leaderboards">
              <Typography variant="small" className="ml-2">
                Explore all products &rarr;
              </Typography>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

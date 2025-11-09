import { type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 오류 안내",
    },
    {
      name: "description",
      content:
        "요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도하거나 지원팀에 문의하세요.",
    },
  ];
};

export default function ErrorPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>문제가 발생했어요</h1>
      <p>요청을 처리하는 중 오류가 발생했습니다.</p>
    </main>
  );
}

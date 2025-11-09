import { Link, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    {
      title: "든든AI - 페이지를 찾을 수 없습니다",
    },
    {
      name: "description",
      content: "요청하신 페이지가 존재하지 않습니다. 홈으로 이동해 주세요.",
    },
  ];
};

export default function NotFoundPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않아요.</p>
      <p>
        <Link to="/">홈으로 돌아가기</Link>
      </p>
    </main>
  );
}



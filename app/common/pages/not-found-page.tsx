import { Link } from "react-router";

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



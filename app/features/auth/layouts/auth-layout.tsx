import { Outlet, Link } from "react-router";

export default function AuthLayout() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <Link to="/">든든 AI</Link>
      </header>
      <Outlet />
    </main>
  );
}

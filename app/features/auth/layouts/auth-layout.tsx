import { Outlet, Link } from "react-router";

export default function AuthLayout() {
  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <Outlet />
    </main>
  );
}

import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin</h1>
      <Outlet />
    </div>
  );
}



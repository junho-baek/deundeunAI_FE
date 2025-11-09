import { Outlet } from "react-router";

export default function ResourcesLayout() {
  return (
    <div className="bg-background text-foreground">
      <Outlet />
    </div>
  );
}


import { Outlet } from "react-router";

export default function UsecasesLayout() {
  return (
    <div className="bg-background text-foreground">
      <Outlet />
    </div>
  );
}


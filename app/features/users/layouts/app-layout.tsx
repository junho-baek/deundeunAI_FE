import { Outlet, useLocation } from "react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";
import AppSidebar from "~/features/users/components/app-sidebar";

export default function AppLayout() {
  const location = useLocation();
  const overlaySidebar = location.pathname.startsWith("/my/dashboard/project/");
  return (
    <SidebarProvider className={overlaySidebar ? "overlay-sidebar" : undefined}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center gap-2 p-4">
          <span className="font-bold">든든 AI</span>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

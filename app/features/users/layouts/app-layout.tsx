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
    <SidebarProvider
      defaultOpen={false}
      className={`h-screen w-screen overflow-hidden ${overlaySidebar ? "overlay-sidebar" : ""}`}
    >
      <AppSidebar />
      <SidebarInset className="flex h-full flex-col overflow-hidden">
        <div className="flex items-center gap-2 p-4">
          <SidebarTrigger className="-ml-1" />
          <span className="font-bold">든든 AI</span>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <div className="h-full w-full overflow-hidden rounded-lg bg-background">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

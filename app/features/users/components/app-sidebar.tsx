import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarRail,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";
import {
  FolderPlus,
  LayoutDashboard,
  Settings,
  User,
  CreditCard,
  Home,
} from "lucide-react";
import { AnimatedThemeToggler } from "~/common/components/ui/animated-theme-toggler";
import { cn } from "~/lib/utils";

export function AppSidebar() {
  const location = useLocation();

  // 정확한 경로 매칭을 위한 isActive 함수
  const isActive = (to: string) => {
    // 정확히 일치하는 경우
    if (location.pathname === to) {
      return true;
    }
    // /my/dashboard는 /my/dashboard/project와 구분
    if (to === "/my/dashboard") {
      return location.pathname === "/my/dashboard";
    }
    // 나머지는 startsWith 사용
    return location.pathname.startsWith(to);
  };

  // 현재 경로와 동일한 링크 클릭 방지 (더 정확한 매칭)
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    to: string
  ) => {
    // 정확히 일치하거나, 이미 해당 경로의 하위 경로에 있는 경우 방지
    if (location.pathname === to) {
      e.preventDefault();
      return;
    }
    // /my/dashboard는 정확히 일치해야 함
    if (
      to === "/my/dashboard" &&
      location.pathname.startsWith("/my/dashboard")
    ) {
      // 이미 대시보드나 그 하위 경로에 있으면 방지하지 않음 (하위 경로로 이동 허용)
      return;
    }
  };

  return (
    <Sidebar collapsible="icon" mobileMode="icon-rail" overlay>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="justify-end"
              tooltip="사이드바 토글"
            >
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === "/"}>
              <Link to="/" onClick={(e) => handleLinkClick(e, "/")}>
                <Home />
                <span>홈</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/my/dashboard")}>
              <Link
                to="/my/dashboard"
                onClick={(e) => handleLinkClick(e, "/my/dashboard")}
              >
                <LayoutDashboard />
                <span>대시보드</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/my/dashboard/project")}
            >
              <Link
                to="/my/dashboard/project"
                onClick={(e) => handleLinkClick(e, "/my/dashboard/project")}
              >
                <FolderPlus />
                <span>프로젝트</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/my/dashboard/settings/profile")}
            >
              <Link
                to="/my/dashboard/settings/profile"
                onClick={(e) =>
                  handleLinkClick(e, "/my/dashboard/settings/profile")
                }
              >
                <User />
                <span>프로필</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/my/dashboard/settings/billing")}
            >
              <Link
                to="/my/dashboard/settings/billing"
                onClick={(e) =>
                  handleLinkClick(e, "/my/dashboard/settings/billing")
                }
              >
                <CreditCard />
                <span>결제/플랜</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/my/dashboard/settings")}
            >
              <Link
                to="/my/dashboard/settings/profile"
                onClick={(e) =>
                  handleLinkClick(e, "/my/dashboard/settings/profile")
                }
              >
                <Settings />
                <span>설정</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <AnimatedThemeToggler
              className={cn(
                "peer/menu-button flex w-full items-center justify-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full"
              )}
              aria-label="테마 전환"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;

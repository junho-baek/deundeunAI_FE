import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/common/components/ui/sidebar";
import type { SidebarNavItem } from "./sidebar-data";

export default function SidebarMain({ items }: { items: SidebarNavItem[] }) {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    if (url === "/my/dashboard") {
      // 대시보드 메인 페이지만 정확히 일치해야 함
      // /my/dashboard/project 같은 하위 경로는 제외
      return location.pathname === "/my/dashboard";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        메인
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.url)}
              tooltip={item.title}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

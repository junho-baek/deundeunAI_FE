import { Link, useLocation } from "react-router";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/common/components/ui/sidebar";
import type { SidebarNavItem } from "./sidebar-data";

export default function SidebarProjects({
  items,
}: {
  items: SidebarNavItem[];
}) {
  const location = useLocation();

  const isActive = (url: string) => {
    // 프로젝트 페이지는 정확히 일치하거나 하위 경로일 때 활성화
    return location.pathname === url || location.pathname.startsWith(`${url}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        프로젝트
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


import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/common/components/ui/sidebar";
import { cn } from "~/lib/utils";
import type { SidebarNavItem } from "./sidebar-data";

export default function SidebarSettings({ item }: { item: SidebarNavItem }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(() => {
    // 설정 관련 경로에 있으면 기본적으로 열림
    return location.pathname.startsWith("/my/dashboard/settings");
  });

  // location이 변경될 때 설정 경로에 있으면 자동으로 열림
  React.useEffect(() => {
    if (location.pathname.startsWith("/my/dashboard/settings")) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const hasActiveSubItem = item.items?.some((subItem) => isActive(subItem.url));

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        설정
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setIsOpen(!isOpen)}
            isActive={hasActiveSubItem}
            tooltip={item.title}
            className="w-full"
          >
            <item.icon />
            <span className="group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            <ChevronRight
              className={cn(
                "ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                isOpen && "rotate-90"
              )}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
        {isOpen && item.items && (
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                  <Link to={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

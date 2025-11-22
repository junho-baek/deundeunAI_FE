import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "~/common/components/ui/sidebar";
import { AnimatedThemeToggler } from "~/common/components/ui/animated-theme-toggler";
import { cn } from "~/lib/utils";
import SidebarMain from "./sidebar-main";
import SidebarProjects from "./sidebar-projects";
import SidebarSettings from "./sidebar-settings";
import {
  sidebarNavMain,
  sidebarNavProjects,
  sidebarNavSettings,
} from "./sidebar-data";

export function AppSidebar() {
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
      </SidebarHeader>

      <SidebarContent>
        <SidebarMain items={sidebarNavMain} />
        <SidebarSeparator />
        <SidebarProjects items={sidebarNavProjects} />
        <SidebarSeparator />
        <SidebarSettings item={sidebarNavSettings} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
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

import {
  Bell,
  FolderPlus,
  LayoutDashboard,
  Settings,
  Home,
  type LucideIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
};

export const sidebarNavMain: SidebarNavItem[] = [
  {
    title: "홈",
    url: "/",
    icon: Home,
  },
  {
    title: "대시보드",
    url: "/my/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "알림",
    url: "/my/notifications",
    icon: Bell,
  },
];

export const sidebarNavProjects: SidebarNavItem[] = [
  {
    title: "프로젝트",
    url: "/my/dashboard/project",
    icon: FolderPlus,
  },
];

export const sidebarNavSettings: SidebarNavItem = {
  title: "설정",
  url: "/my/dashboard/settings/profile",
  icon: Settings,
  items: [
    {
      title: "프로필",
      url: "/my/dashboard/settings/profile",
    },
    {
      title: "결제/플랜",
      url: "/my/dashboard/settings/billing",
    },
  ],
};

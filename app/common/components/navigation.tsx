import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Typography } from "./typography";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  BarChart3Icon,
  BellIcon,
  LogOutIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

// 📁 navigation.tsx (excerpt)
const menus = [
  {
    name: "사용 사례",
    to: "/usecases",
    items: [
      {
        name: "시니어",
        description: "든든AI를 사용해서 수익화에 성공한 시니어들의 사례",
        to: "/usecases/senior",
      },
      {
        name: "부업인",
        description: "든든AI를 사용해서 수익화에 성공한 부업인들의 사례",
        to: "/usecases/freelancer",
      },
      {
        name: "기업",
        description: "든든AI를 사용해서 수익화에 성공한 기업들의 사례",
        to: "/usecases/company",
      },
    ],
  },
  {
    name: "수익화 AI도구",
    to: "/service/shorts",
    items: [
      {
        name: "수익형 쇼츠",
        description:
          "다양한 템플릿을 활용하여 수익형 쇼츠를 자동으로 생성합니다.",
        to: "/service/shorts/create",
      },
    ],
  },

  {
    name: "리소스",
    to: "/resources",
    items: [
      {
        name: "든든AI 소개",
        description: "Manage your personal information",
        to: "/resources/about",
      },
      {
        name: "든든AI 블로그",
        description: "든든AI 블로그에 대한 소개 및 사용 방법",
        to: "/resources/blog",
      },
      {
        name: "뉴스레터",
        description: "든든AI 뉴스레터에 대한 소개 및 사용 방법",
        to: "/resources/newsletter",
      },
      {
        name: "무료 든든 AI 사용법",
        description: "든든AI 채용에 대한 소개 및 사용 방법",
        to: "/resources/free",
      },
    ],
  },
  {
    name: "API",
    description: "추천 도구 목록",
    to: "/api/docs",
  },
  {
    name: "가격",
    description: "추천 도구 목록",
    to: "/pricing",
  },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
  compact,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
  compact?: boolean;
}) {
  return (
    <nav
      className={cn(
        "flex px-20 h-16 items-center justify-between fixed top-0 left-0 right-0 z-50",
        compact ? "bg-transparent" : "backdrop-blur bg-background/50"
      )}
    >
      <div className="flex items-center min-w-[50px]">
        <Link to="/" className="font-bold tracking-tighter text-lg">
          든든AI
        </Link>
      </div>
      {!compact && (
        <div className="flex items-center">
          <Separator orientation="vertical" className="h-6 mx-4" />
          <NavigationMenu>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.name}>
                  {menu.items ? (
                    <>
                      <Link to={menu.to}>
                        <NavigationMenuTrigger>
                          {menu.name}
                        </NavigationMenuTrigger>
                      </Link>
                      <NavigationMenuContent>
                        <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                          {menu.items?.map((item) => (
                            <NavigationMenuItem
                              key={item.name}
                              className={cn([
                                "select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
                                (item.to === "/products/promote" ||
                                  item.to === "/jobs/submit") &&
                                  "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                              ])}
                            >
                              <NavigationMenuLink>
                                <Link
                                  className="p-3 space-y-1 block leading-none no-underline outline-none"
                                  to={item.to}
                                >
                                  <Typography variant="small">
                                    {item.name}
                                  </Typography>
                                  <Typography variant="muted">
                                    {item.description}
                                  </Typography>
                                </Link>
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                      {menu.name}
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          {!compact && (
            <>
              <Button size="icon" variant="ghost" asChild className="relative">
                <Link to="/my/notifications">
                  <BellIcon className="size-4" />
                  {hasNotifications && (
                    <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              </Button>
              <Button size="icon" variant="ghost" asChild className="relative">
                <Link to="/my/messages">
                  <MessageCircleIcon className="size-4" />
                  {hasMessages && (
                    <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
                  )}
                </Link>
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/junho-baek.png" />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <Typography variant="small">John Doe</Typography>
                <Typography variant="muted">@username</Typography>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/dashboard">
                    <BarChart3Icon className="size-4 mr-2" />
                    <Typography variant="small">Dashboard</Typography>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings/profile">
                    <UserIcon className="size-4 mr-2" />
                    <Typography variant="small">Profile</Typography>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    <Typography variant="small">Settings</Typography>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  <Typography variant="small">Logout</Typography>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        !compact && (
          <div className="flex items-center gap-4">
            <Button asChild variant="secondary">
              <Link to="/auth/login">
                <Typography variant="small">Login</Typography>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/auth/join">
                <Typography variant="small">Join</Typography>
              </Link>
            </Button>
          </div>
        )
      )}
    </nav>
  );
}

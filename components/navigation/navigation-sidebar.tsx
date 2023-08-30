import { Home, Plus, Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";

import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { FreeCounter } from "@/components/free-counter";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
interface SidebarProps {
  isPro: boolean;
  apiLimitCount: number;
}

const routes = [
  {
    label: "Companions",
    name: "Home",
    icon: Home,
    href: '/',
    pro: false,
  },/*
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500",
    pro: false,
  },*/
  {
    label: 'AI Helper',
    name: "AIHelper",
    icon: MessageSquare,
    href: '/conversation',
    color: "text-violet-500",
    pro: false,
  },
  {
    label: 'Image',
    name: "Image",
    icon: ImageIcon,
    color: "text-pink-700",
    href: '/image',
    pro: false,
  },
  {
    label: 'Video',
    name: "Video",
    icon: VideoIcon,
    color: "text-orange-700",
    href: '/video',
    pro: false,
  },
  {
    label: 'Music',
    name: "Music",
    icon: Music,
    color: "text-emerald-500",
    href: '/music',
    pro: false,
  },
  {
    label: 'Code',
    name: "Code",
    icon: Code,
    color: "text-green-700",
    href: '/code',
    pro: false,
  },
  {
    label: "Create",
    name: "Create",
    icon: Plus,
    href: '/companion/new',
    pro: true,
  },
  {
    label: 'Settings',
    name: "Settings",
    icon: Settings,
    href: '/settings',
    pro: false,
  },
];

export const NavigationSidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: SidebarProps) => {
  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {routes.map((route) => (
          <div key={route.name} className="mb-4">
            <NavigationItem
              name={route.name}
              icon={route.icon}
              label={route.label}
              href={route.href}
              proRequired={route.pro}
              color={route.color}
              isPro={isPro}
            />
          </div>
        ))}
      </ScrollArea>
      <FreeCounter 
            apiLimitCount={apiLimitCount} 
            isPro={isPro}
      />
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  )
}
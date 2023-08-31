
import { UserButton } from "@clerk/nextjs";
import { FreeCounter } from "@/components/free-counter";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { NavigationItemServer } from "./navigation-item-server";
interface SidebarProps {
  isPro: boolean;
  apiLimitCount: number;
}

const routes = [
  {
    label: "Companions",
    name: "Home",
    href: '/',
    pro: false,
    enabled: false,
  },
  {
    label: 'AI Helper',
    name: "AIHelper",
    href: '/conversation',
    color: "text-violet-500",
    pro: false,
    enabled: false,
  },
  {
    label: 'Image',
    name: "Image",
    color: "text-pink-700",
    href: '/image',
    pro: false,
    enabled: false,
  },
  {
    label: 'Video',
    name: "Video",
    color: "text-orange-700",
    href: '/video',
    pro: false,
    enabled: false,
  },
  {
    label: 'Music',
    name: "Music",
    color: "text-emerald-500",
    href: '/music',
    pro: false,
    enabled: false,
  },
  {
    label: 'Code',
    name: "Code",
    color: "text-green-700",
    href: '/code',
    pro: false,
    enabled: false,
  },
  {
    label: "Create",
    name: "Create",
    href: '/companion/new',
    pro: true,
    enabled: true,
  },
  {
    label: 'Settings',
    name: "Settings",
    href: '/settings',
    pro: false,
    enabled: true,
  },
];

export const NavigationSidebar = async ({
  apiLimitCount = 0,
  isPro = false,
}: SidebarProps) => {
  const profile = await currentProfile();

  let servers: any[] = [];
  if (profile) {
    servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id
          }
        }
      }
    });
  }

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItemServer
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {routes.filter(route => route.enabled).map((route) => (
          <div key={route.name} className="mb-4">
            <NavigationItem
              route={route}
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
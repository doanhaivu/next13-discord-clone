"use client";
import { Home, Paperclip, Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";

import { useProModal } from "@/hooks/use-pro-modal";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

const routes = [
  {
    name: "Home",
    icon: Home,
  },
  {
    name: "AIHelper",
    icon: MessageSquare,
  },
  {
    name: "Image",
    icon: ImageIcon,
  },
  {
    name: "Video",
    icon: VideoIcon,
  },
  {
    name: "Music",
    icon: Music,
  },
  {
    name: "Code",
    icon: Code,
  },
  {
    name: "Create",
    icon: Paperclip,
  },
  {
    name: "Settings",
    icon: Settings,
  },
];

interface NavigationItemProps {
  route: any;
  // imageUrl: string;
  isPro: boolean;
};

export const NavigationItem = ({
  route,
  // imageUrl,
  isPro,
}: NavigationItemProps) => {
  const proModal = useProModal();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const onNavigate = (url: string, proRequired: boolean) => {
    if (proRequired && !isPro) {
      return proModal.onOpen();
    }

    return router.push(url);
  }
  let thisRoute = routes.find(o => o.name === route.name) ?? routes[0];

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={route.label}
    >
      <button
        onClick={() => onNavigate(route.href, route.proRequired)}
        className="group relative flex items-center"
      >
        <div className={cn(
          "relative group flex mx-6 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all",
        )}>
          <thisRoute.icon className={cn("group-hover:text-white transition text-emerald-500", route.color)} />
        </div>
      </button>
    </ActionTooltip>
  )
}
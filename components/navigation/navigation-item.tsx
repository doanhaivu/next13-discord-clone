"use client";

import { FreeCounter } from "@/components/free-counter";
import { useProModal } from "@/hooks/use-pro-modal";

import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { LucideIcon, icons } from 'lucide-react';

interface NavigationItemProps {
  name: string;
  icon: any;
  color?: string;
  // imageUrl: string;
  label: string;
  href: string;
  proRequired: boolean;
  isPro: boolean;
};

export const NavigationItem = ({
  name,
  icon,
  // imageUrl,
  label,
  href,
  proRequired,
  color = "text-primary",
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

  const LucideIcon = icon;
 
  return (
    <ActionTooltip
      side="right"
      align="center"
      label={label}
    >
      <button
        onClick={() => onNavigate(href, proRequired)}
        className="group relative flex items-center"
      >
        <div className={cn(
          "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
          // params?.routeName !== name && "group-hover:h-[20px]",
          // params?.routeName === name ? "h-[36px]" : "h-[8px]"
          pathname !== href && "group-hover:h-[20px]",
          pathname === href ? "h-[36px]" : "h-[8px]"
        )} />
        <div className={cn(
          "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.routeName === name && "bg-primary/10 text-primary rounded-[16px]"
        )}>
          <LucideIcon className={cn("h-5 w-5 mr-0", color)} />
          {label}
        </div>
      </button>
    </ActionTooltip>
  )
}
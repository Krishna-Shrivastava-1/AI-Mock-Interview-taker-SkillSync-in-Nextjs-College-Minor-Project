'use client'

import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({ items }) {
  const pathname = usePathname();
  console.log('pathname', pathname);

  return (
    <SidebarGroup className='dark'>
      <SidebarGroupContent className="flex flex-col dark gap-2">
        <SidebarMenu className='dark'>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link className="w-full" href={'/home'}>
              <SidebarMenuButton
                tooltip="Home"
                className={`
                  min-w-8 duration-200 ease-linear cursor-pointer
                  ${pathname === '/home' 
                    ? 'bg-primary text-primary-foreground'
                    : ''
                  }
                `}>
                <House />
                <span>Home</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className='dark'>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={`
                    min-w-8 duration-200 ease-linear cursor-pointer
                    ${pathname === item.url 
                      ? 'bg-primary text-primary-foreground'
                      : ''
                    }
                  `}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
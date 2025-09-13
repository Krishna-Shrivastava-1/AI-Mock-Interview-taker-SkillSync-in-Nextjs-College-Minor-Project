"use client";
import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useWholeApp } from "./AuthContextApi";
import Link from "next/link";
import { Search } from "lucide-react";
export function NavSecondary({
  items,
  ...props
}) {
  const { setuserQuery, nameFilter, userQuery } = useWholeApp()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>

          <Dialog>
            <DialogTrigger> {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url || null}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}</DialogTrigger>
            <DialogContent className='dark text-white max-h-[75%] noside overflow-y-auto'>
              <DialogHeader>
                <DialogTitle className='text-lg'>Search</DialogTitle>
                <div className=' sticky top-0  z-30 p-2 px-2 w-full  ' >
                  <div className='bg-zinc-800 rounded-full p-2 w-full  flex items-center justify-center group focus-within:border border-sky-600 focus-within:bg-black' >
                    <Search className='text-2xl text-zinc-500 group-focus-within:text-sky-600' />
                    <input onChange={(e) => setuserQuery(e.target.value)?.trim()} className='border-none outline-none bg-transparent w-full placeholder:text-zinc-500 text-white px-2' placeholder='Search' type="search" />
                  </div>
                </div>
                {userQuery.length > 0 && <div className=' my-2 rounded-xl mx-3 p-2'>

                  {
                    userQuery.length > 0 && nameFilter.length > 0 ? nameFilter?.map((e) => (
                      <div key={e?.id}>
                        <Link href={`/profile/${e?.id}`}>
                          <div className='flex items-center justify-start hover:bg-neutral-800'>
                            <div className='rounded-full font-semibold text-center text-xl m-2 px-4 p-2 bg-neutral-800 border border-neutral-600'>{e?.name?.[0]} </div>
                            <h1 className='text-lg font-semibold'>{e?.name}</h1>

                          </div>
                        </Link>
                      </div>
                    ))
                      :
                      userQuery.length > 0 && nameFilter.length === 0 &&
                      <p>No User Found</p>
                  }
                </div>}
                {/* <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription> */}
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

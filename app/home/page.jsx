'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
// import MagicBento from '@/components/MagicBento'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'

import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import ProfileComplete from '@/components/ProfileComplete'
import MockDataCards from '@/components/MockDataCards'


import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DiscoverSectionNews from '@/components/DiscoverSectionNews'
import { Skeleton } from '@/components/ui/skeleton'


const page = () => {
  const { fetchedUserData, userId, setfetchedUserData } = useWholeApp()

  const router = useRouter()
  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    setfetchedUserData([])
    router.push('/')
    router.refresh()
  }

  // if (!fetchedUserData?.user) {
  //   return (
  //     <div className='flex items-center justify-center h-screen bg-red-600'>
  //       <h1 className='text-2xl font-bold text-white'>Loadin</h1>
  //     </div>
  //   )
  // }



  return (
    <div className=''>
     
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className='w-full flex items-center  justify-end'>

                <Button onClick={handleLogout} className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button>
              </div>
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
          </header>
          {fetchedUserData?.user ? <div className="flex flex-1 flex-col gap-4 p-4">
            <div className='w-full text-white font-bold text-center text-4xl'>
              <h1>Hi, <span className='text-sky-500 textshad'>{fetchedUserData?.user?.name}</span>  </h1>
            </div>
            <ProfileComplete />
            <div>
              <MockDataCards fetchedUser={fetchedUserData} />
            </div>

            <Link href={`/mock-test`}>

              <Button variant="destructive">Mock Test</Button>
            </Link>
            <DiscoverSectionNews />
            <div className='h-screen'></div>
          </div>
            :
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className='w-full text-white font-bold flex justify-center text-4xl'>
                <Skeleton className="h-10 w-sm rounded-3xl" />
              </div>
              <div className='flex items-center justify-center flex-wrap  gap-4 mt-4'>
                <Skeleton className="h-32 w-sm rounded-3xl" />
                <Skeleton className="h-32 w-sm rounded-3xl" />
                <Skeleton className="h-32 w-sm rounded-3xl" />
              </div>
            </div>

          }
        </SidebarInset>
      </SidebarProvider>




    </div>
  )
}

export default page

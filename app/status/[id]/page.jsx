'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import PostareOnExploreRoute from '@/components/PostareOnExploreRoute'
import { ChartColumn, Heart, MessageCircle, Search, Share } from 'lucide-react'
import { useWholeApp } from '@/components/AuthContextApi'
import axios from 'axios'
const page = () => {
    const {id} = useParams()
    const [postDataById, setpostDataById] = useState([])
const {fetchedUserData} = useWholeApp()
const handleFetchPostbyId = async () => {
   try {
     const repos = await axios.get(`/api/post/getpostbyid/${id}`)
    setpostDataById(repos?.data?.post)
   } catch (error) {
    console.log(error)
   }
}
useEffect(() => {
 handleFetchPostbyId()
}, [id])
console.log(postDataById)
  return (
    <div>
        <SidebarProvider className='dark'>
                <AppSidebar fetchedUser={fetchedUserData} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <div className='w-full flex items-center justify-end'>
                                <Button className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button>
                            </div>
                        </div>
                    </header>
                    <div className='w-full flex items-center justify-center my-8 mt-0'>
                        <div className='w-[90%]  flex items-center justify-center p-1 '>
                            <div className='flex w-full items-start justify-center '>
                                <div className='flex flex-col items-start justify-center w-full md:w-[80%]'>

                                  
                                    
                                </div>
                                <div className=' sticky top-[70px] hidden  md:block border w-[40%]' >
                                    <div className=' sticky top-0  z-30 p-2 px-2 w-full  ' >
                                        <div className='bg-zinc-800 rounded-full p-2 w-full  flex items-center justify-center group focus-within:border border-sky-600 focus-within:bg-black' >
                                            <Search className='text-2xl text-zinc-500 group-focus-within:text-sky-600' />
                                            <input className='border-none outline-none bg-transparent w-full placeholder:text-zinc-500 text-white px-2' placeholder='Search' type="search" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
    </div>
  )
}

export default page

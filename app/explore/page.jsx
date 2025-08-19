'use client'
import { useWholeApp } from '@/components/AuthContextApi'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import PostareOnExploreRoute from '@/components/PostareOnExploreRoute'
import { Search } from 'lucide-react'
import axios from 'axios'
const page = () => {
    const {fetchedUserData} = useWholeApp()
    const [page, setpage] = useState(1)
    const [postData, setpostData] = useState([])
     const [hasMore, setHasMore] = useState(true);
  const fetchpostData = async () => {
        if (!hasMore) return; 

        try {
            const respo = await axios.get(`/api/post/getallpost?page=${page}&limit=10`);
            const newPosts = respo?.data?.posts || [];

            // console.log('psot, -', newPosts);

            if (newPosts.length === 0) {
             
                setHasMore(false);
            } else {
                setpostData(prevpost => [...prevpost, ...newPosts]);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setHasMore(false);
        }
    };
    const handleLoadMore = () => {
        setpage(prevPage => prevPage + 1);
    };

    
    useEffect(() => {
    fetchpostData()
    }, [page])
    // console.log(postData)
  
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
                        <div className='w-[90%] flex items-center justify-center p-1 '>
                          <div className='flex w-full items-start justify-center '>
<div className='flex flex-col items-start justify-center w-full md:w-[80%]'>

                                <PostareOnExploreRoute />
                                  <div className='w-full '>
                                      {
                                          postData?.map((e) => (
                                              <div className='text-white border border-t-0 p-2 w-full' key={e?._id}>
                                                  <div className='flex items-center w-full justify-start'>
                                                      <div className='rounded-full font-semibold text-center text-xl m-2 px-4 p-2 bg-neutral-800'>{e?.user?.name[0]}</div>

                                                      <h1 className='text-lg font-semibold'>{e?.user?.name}</h1>
                                                  </div>
                                                  <p className='whitespace-pre-wrap pl-16'>{e?.message}</p>
                                              </div>
                                          ))
                                      }
                                      <button className='text-white' onClick={handleLoadMore} >
                                          load more
                                      </button>
                                  </div>
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




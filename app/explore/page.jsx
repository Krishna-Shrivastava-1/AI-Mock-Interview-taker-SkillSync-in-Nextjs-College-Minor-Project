'use client'
import { useWholeApp } from '@/components/AuthContextApi'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import PostareOnExploreRoute from '@/components/PostareOnExploreRoute'
import { ChartColumn, Heart, MessageCircle, Search, Share } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'
import { io } from 'socket.io-client'
const socket = io("https://ai-mock-interview-minor-project-socket.onrender.com");
const page = () => {
    const { fetchedUserData, postData, handleLoadMore, hasMore, setpostData } = useWholeApp()
    useEffect(() => {
        const handlescroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const scrollTop = window.scrollY;

            if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore) {
                handleLoadMore();
            }
        };

        window.addEventListener('scroll', handlescroll);
        return () => window.removeEventListener('scroll', handlescroll);
    }, []);

    console.log(postData)


    useEffect(() => {
        // listen for updates
        socket.on("postLiked", (data) => {
            console.log("Live update:", data);
            if (data) {
                setpostData(prevpost => prevpost.map(e => e?._id === data?.updatedPost?._id ? data?.updatedPost : e))
            }
        });

        return () => {
            socket.off("postLiked");
        };
    }, []);
    const handleLike = (id,userid) => {
        socket.emit("likePost", { postId: id, userId: userid });
    };
  



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
                        <div className='sm:w-[90%] w-full flex items-center justify-center p-1 '>
                            <div className='flex w-full items-start justify-center '>
                                <div className='flex flex-col items-start justify-center w-full md:w-[80%]'>

                                    <PostareOnExploreRoute />
                                    <div className='w-full '>
                                        {
                                            postData?.map((e, index) => (
                                                <div className='text-white border border-t-0 p-2 w-full hover:bg-neutral-900' key={index}>
                                                    <div className='flex group cursor-pointer select-none items-center w-fit justify-start'>
                                                        <div className='rounded-full font-semibold text-center text-xl m-2 px-4 p-2 bg-neutral-800'>{e?.user?.name?.[0]} </div>

                                                        <h1 className='text-lg group-hover:underline font-semibold'>{e?.user?.name}</h1>
                                                        <span className='text-sm text-neutral-500 mx-2'>{new Date(e?.createdAt).toDateString()}</span>
                                                    </div>
                                                    <Link href={`/status/${e?._id}`}>
                                                        <p className='whitespace-pre-wrap line-clamp-5 sm:pl-16'>{e?.message}</p>
                                                    </Link>

                                                    <div className='flex justify-around w-full mt-5'>
                                                        <div>
                                                            <MessageCircle className='text-neutral-600' />
                                                        </div>
                                                        <div onClick={() => handleLike(e._id, fetchedUserData?.user?._id)} className='flex items-center justify-center group cursor-pointer select-none relative'>
                                                            <div className='p-2 rounded-full group-hover:bg-pink-800/20  transition-all duration-150 flex items-center text-sm'>
                                                                {
                                                                    e?.likes.includes(fetchedUserData?.user?._id) ?
                                                                        <Heart className=' group-hover:text-pink-700 text-pink-700 ' fill='currentColor' />
                                                                        :
                                                                        <Heart className='text-neutral-600 group-hover:text-pink-700' />
                                                                }
                                                            </div>
                                                            {e?.likes.length > 0 && <p className={`group-hover:text-pink-600 text-neutral-600 absolute left-[35px] `}>{e?.likes.length}</p>}
                                                        </div>

                                                        <div className='flex items-center justify-center group cursor-pointer select-none relative'>
                                                            <div className='p-2 rounded-full group-hover:bg-sky-800/20  transition-all duration-150 flex items-center text-sm'>
                                                                <ChartColumn className=' group-hover:text-sky-700 text-neutral-700 ' />
                                                            </div>
                                                            <p className={`group-hover:text-sky-600 text-neutral-600 absolute left-[35px] `}>{e?.views}</p>
                                                        </div>
                                                        <div className='flex items-center justify-center group cursor-pointer select-none relative'>
                                                            <div className='p-2 rounded-full group-hover:bg-sky-800/20  transition-all duration-150 flex items-center text-sm'>
                                                                <Share className=' group-hover:text-sky-700 text-neutral-700 ' />
                                                            </div>

                                                        </div>
                                                        {/* <div>
                                                            <Share className='text-neutral-600' />
                                                        </div> */}
                                                    </div>
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




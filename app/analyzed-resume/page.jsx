"use client";
import { useState } from "react";
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Check, LoaderCircle, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import Link from "next/link";
import GetisOpenOrNot from "@/components/GetisOpenOrNot";



const page = () => {
    const { fetchedUserData, sideBarOpen } = useWholeApp()
    const [loading, setloading] = useState(true)
    // console.log(fetchedUserData)
    useEffect(() => {
        if (fetchedUserData) {
            setloading(false)
        }

    }, [fetchedUserData])
    useEffect(() => {
        if (!fetchedUserData?.user?.analyzedResume?.length > 0) {
            <div>
                <h3 className="text-center text-sky-600 text-xl font-semibold">No Resume Uploaded to Analyzed.</h3>
            </div>
        }
    }, [loading, fetchedUserData])

    return (
        <div className="text-white">
            <SidebarProvider className='dark'>
                <AppSidebar fetchedUser={fetchedUserData} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center  gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
                        <div className="flex items-center gap-2 w-full px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <div className='w-full flex items-center  justify-between'>
                                {
                                    !sideBarOpen &&
                                    <Link href={'/'}>

                                        <h1 className='text-white font-semibold cursor-pointer select-none text-xl'>SkillSync</h1>
                                    </Link>
                                }
                                <Link href={'/'}>

                                    <h1 className='text-white md:hidden block font-semibold cursor-pointer select-none text-xl'>SkillSync</h1>
                                </Link>
                                {/* <Button className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button> */}
                            </div>

                        </div>
                    </header>
                    <GetisOpenOrNot />
                    <div className='w-full flex justify-center items-center flex-col gap-3 text-white'>
                        <div className='sm:w-[90%] w-full p-2'>
                            {loading ?
                                <div className='w-full text-white flex items-center justify-center h-[70vh]'>
                                    <LoaderCircle size={45} className='animate-spin' />
                                </div>
                                //         :
                                // fetchedUserData?.user?.analyzedResume?.length > 0 ? (
                                //     <div>
                                //         <h1 className="text-xl font-semibold">Your Anayzed Resumes</h1>

                                //     </div>
                                // )
                                :
                                <div className="w-full">
                                    <h1 className="text-xl mb-6 font-semibold">Your Analyzed Resumes</h1>
                                    {fetchedUserData?.user?.analyzedResume ?
                                        <div className="flex items-center justify-around flex-wrap w-full">
                                            {
                                                fetchedUserData?.user?.analyzedResume?.map((e, index) => (

                                                    <Link href={`/analyzed-resume/${e?._id}`} key={e?._id}>
                                                        <div className="md:w-md w-full group border-[0.5px] border-neutral-700 rounded-lg m-2 p-2 cursor-pointer hover:bg-neutral-800" >
                                                            <div className="flex items-center justify-between text-center">

                                                                <h1>{index + 1}. Resume Report </h1>
                                                                <h1>Created at- {new Date(e?.createdAt).toDateString()}</h1>
                                                            </div>
                                                            <div className="relative w-full">
                                                                <iframe className="z-10 overflow-y-hidden " src={`https://docs.google.com/gview?url=${e?.uploadedResumeUrl}&embedded=true`} width="100%"
                                                                    height="400px"
                                                                    title="PDF Preview" frameBorder="0"></iframe>
                                                                <div className="absolute top-0 left-0 w-full  h-full group-hover:bg-black/10 transition-all duration-200 bg-black/50 z-30"></div>
                                                            </div>



                                                            <p className="line-clamp-3 text-balance">{e?.overall_assessment}</p>
                                                            {/* <Link href={`/analyzed-resume/${e?._id}`}></Link> */}
                                                        </div>
                                                    </Link>


                                                ))
                                            }
                                        </div>
                                        :
                                        <div className="flex items-center gap-3 mt-3 justify-around flex-wrap">
                                            {
                                                Array(9).fill(null)?.map((_, index) => (
                                                    <div key={index}>
                                                        <Skeleton className="h-[450px] w-full md:max-w-sm  rounded-3xl" />
                                                    </div>

                                                ))
                                            }
                                        </div>
                                    }

                                </div>


                            }

                            <div>

                            </div>

                        </div>
                    </div>








                </SidebarInset>
            </SidebarProvider>

        </div>
    )
}

export default page

'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { fetchedUserData } = useWholeApp()
    const [alluserData, setalluserData] = useState([])
    const [loading, setloading] = useState(true)
    const fetchAllUser = async () => {
        try {
            const repo = await axios.get('/api/auth/getalluser')
            if (repo?.data) {
                setalluserData(repo?.data?.user)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchAllUser()
    }, [])
    // console.log(alluserData)
    const totalscoreofuser = alluserData?.map((e) => {
        const userScores = e?.mockAttempts?.map((g) => g?.score)
        const validUserScore = userScores?.filter((t) => typeof t === 'number')
        const totalofValidScore = validUserScore?.reduce((acc, curr) => acc + curr, 0)
        return {
            user: e,
            totalscore: totalofValidScore
        }
    })
    const sortedDataofScore = totalscoreofuser.sort((a, b) => b.totalscore - a.totalscore)
    const splicedSortedScore = sortedDataofScore.slice(0, 10)
    console.log(sortedDataofScore)

    const findUserRank = (userId) => {
        return sortedDataofScore.findIndex((e) => e?.user?._id === userId)
    }
    console.log(findUserRank(fetchedUserData?.user?._id) + 1)
    useEffect(() => {
if(splicedSortedScore && sortedDataofScore && fetchedUserData?.user){
    setloading(false)
}
    }, [splicedSortedScore,sortedDataofScore,fetchedUserData])

    return (
        <div>
            <SidebarProvider className='dark'>
                <AppSidebar fetchedUser={fetchedUserData} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <div className='w-full flex items-center  justify-end'>

                                <Button className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button>
                            </div>

                        </div>
                    </header>
                    <div className='w-full flex items-center justify-center my-8 '>
                        <div className='w-[90%]  p-1 '>
                            {
                                loading ?
                                    <div className='w-full flex-col flex-wrap flex items-center justify-center'>

                                        <div className='w-[90%] border-[0.5px] border-zinc-800 rounded-md p-1'>
                                            {
                                                Array(10).fill(null)?.map((_, e) => (
                                                    <Skeleton key={e} className="h-6 w-full rounded-sm my-2 p-4" />
                                                ))
                                            }

                                        </div>
                                        <div className='w-[90%] flex items-start'>

                                             <Skeleton  className="h-4 w-[250px] rounded-sm my-2 p-4" />
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className='flex p-2 text-white items-center justify-between w-full'>
                                            <h1 className='text-lg font-semibold'>Rank</h1>
                                            <h1 className='text-lg font-semibold'> Name</h1>
                                            <h1 className='text-lg font-semibold'>Total Score</h1>
                                        </div>
                                        {
                                            splicedSortedScore?.map((e, index) => (
                                                <div className={`flex flex-col items-center ${index === 0 ? 'bg-yellow-700' : index === 1 ? 'bg-zinc-700' : index === 2 ? 'bg-sky-700' : ''} border-[0.5px] p-2 border-zinc-800 rounded-md my-2 text-white justify-between`} key={index}>

                                                    <div className='flex items-center justify-between w-full'>
                                                        <h1 className='text-lg font-semibold'>{index === 0 ? index+1 +'st' : index === 1 ? index+1+'nd' : index === 2 ? index+1+'rd' :index+1}. </h1>
                                                        <h1 className='text-lg font-semibold'> {e?.user?.name}</h1>
                                                        <h1> {e?.totalscore}</h1>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className='flex text-white items-center justify-between w-full'>
                                            <h1 className='font-semibold text-lg'>Your rank is <span className='font-semibold text-lg text-green-500'>{findUserRank(fetchedUserData?.user?._id) + 1}</span></h1>
                                        </div>
                                    </div>
                            }


                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default page

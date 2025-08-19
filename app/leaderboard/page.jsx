'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { fetchedUserData } = useWholeApp()
    const [alluserData, setAllUserData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAllUser = async () => {
        try {
            const repo = await axios.get('/api/auth/getalluser')
            if (repo?.data?.user) {
                setAllUserData(repo.data.user)
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        setLoading(true); // Set loading to true before fetching data
        fetchAllUser()
    }, [])

    // Memoize the sorted and spliced data to prevent unnecessary re-calculations
    const totalScoreOfUser = alluserData.map((e) => {
        const totalScore = e?.mockAttempts?.reduce((acc, curr) => acc + (curr?.score || 0), 0) || 0;
        return {
            user: e,
            totalscore: totalScore
        }
    })

    const sortedDataOfScore = totalScoreOfUser.sort((a, b) => b.totalscore - a.totalscore);

    const splicedSortedScore = sortedDataOfScore.slice(0, 10);

    const findUserRank = (userId) => {
        const rankIndex = sortedDataOfScore.findIndex((e) => e?.user?._id === userId);
        return rankIndex !== -1 ? rankIndex + 1 : 'N/A';
    };

    const userRank = findUserRank(fetchedUserData?.user?._id);

    useEffect(() => {
        // This useEffect runs whenever alluserData changes.
        if (alluserData.length > 0 && fetchedUserData?.user) {
            setLoading(false);
        }
    }, [alluserData, fetchedUserData,splicedSortedScore])

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
                    <div className='w-full flex items-center justify-center my-8 '>
                        <div className='w-[90%] p-1 '>
                            {loading ? (
                                <div className='w-full flex-col flex-wrap flex items-center justify-center'>
                                    <div className='w-[90%] border-[0.5px] border-zinc-800 rounded-md p-1'>
                                        {Array(10).fill(null).map((_, e) => (
                                            <Skeleton key={e} className="h-6 w-full rounded-sm my-2 p-4" />
                                        ))}
                                    </div>
                                    <div className='w-[90%] flex items-start'>
                                        <Skeleton className="h-4 w-[250px] rounded-sm my-2 p-4" />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className='flex p-2 text-white items-center justify-between w-full'>
                                        <h1 className='text-lg font-semibold'>Rank</h1>
                                        <h1 className='text-lg font-semibold'>Name</h1>
                                        <h1 className='text-lg font-semibold'>Total Score</h1>
                                    </div>
                                    {splicedSortedScore?.map((e, index) => (
                                        <div
                                            className={`flex flex-col items-center border-[0.5px] p-2 border-zinc-800 rounded-md my-2 text-white justify-between ${index === 0 ? 'bg-yellow-700' : index === 1 ? 'bg-zinc-700' : index === 2 ? 'bg-sky-700' : ''}`}
                                            key={index}
                                        >
                                            <div className='flex items-center justify-between w-full'>
                                                <h1 className='text-lg font-semibold'>
                                                    {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}.`}
                                                </h1>
                                                <Link href={`/profile/${e?.user?._id}`}>
                                                
                                                <h1 className='text-lg font-semibold'> {e?.user?.name}</h1>
                                                </Link>
                                                <h1> {e?.totalscore}</h1>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='flex text-white items-center justify-between w-full mt-4'>
                                        <h1 className='font-semibold text-lg'>Your rank is <span className='font-semibold text-lg text-green-500'>{userRank}</span></h1>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default page

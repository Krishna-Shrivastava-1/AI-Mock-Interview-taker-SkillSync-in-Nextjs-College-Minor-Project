'use client'
import AnalysticsChart from '@/components/AnalysticsChart'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import GetisOpenOrNot from '@/components/GetisOpenOrNot'
import PreviousMockTable from '@/components/PreviousMockTable'
import SpotlightCard from '@/components/SpotlightCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const { fetchedUserData,sideBarOpen } = useWholeApp()
  const param = useParams()
  const [laoding, setlaoding] = useState(true)
  const allScores = fetchedUserData?.user?.mockAttempts.map((e) => e.score)
  // console.log('allscore num - ', allScores)
  // console.log('allscore num len - ', allScores.length)
  const validScores = allScores?.filter(score => typeof score === 'number');
  // console.log('validScores - ', validScores.length)
  const additionOfTotalScore = validScores?.reduce((acc, curr) => acc + curr, 0)
  let countEasy = 0
  let countMedium = 0
  let countHard = 0

  fetchedUserData?.user?.mockAttempts.map((e) => {
    if (e?.questions?.[0]?.difficulty == 'easy') {
      countEasy++
    }
    else if (e?.questions?.[0]?.difficulty == 'medium') {
      countMedium++
    } else if (e?.questions?.[0]?.difficulty == 'hard') {
      countHard++
    }
  })
  // console.log('easy - ', countEasy)
  // console.log('medium - ', countMedium)
  // console.log('hard - ', countHard)
  useEffect(() => {
    if (fetchedUserData && fetchedUserData?.user?.mockAttempts?.length > 0 && additionOfTotalScore) {
      setlaoding(false)
    }
  }, [additionOfTotalScore, fetchedUserData?.user?.mockAttempts])
  // console.log(fetchedUserData?.user?.mockAttempts?.length)
  // console.log(sideBarOpen)
  return (
    <div>
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2  border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
            <div className="flex items-center w-full gap-2 px-3">
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
          {
            laoding ?
              fetchedUserData?.user?.mockAttempts?.length === 0 ?
                <div className='w-full flex items-center justify-center my-8 '>
                  <div className='w-[90%] select-none p-1 text-center text-sky-600 text-lg font-semibold rounded-md'>

                    <p className='text-white'>There is no analytics to show <span>
                      <Link className='text-sky-500 underline cursor-pointer ' href={'/mock-test'}>
                      Give your First Mock Test
                      </Link>
                      </span></p>
                  </div>
                </div>
                :
                <div className="flex flex-1 flex-col gap-4 p-4">

                  <div className='flex items-center justify-center flex-wrap  gap-4 mt-4'>
                    <Skeleton className="h-32 w-sm rounded-3xl" />
                    <Skeleton className="h-32 w-sm rounded-3xl" />
                    <Skeleton className="h-32 w-sm rounded-3xl" />
                  </div>
                  <div className='w-full text-white font-bold flex justify-center text-4xl'>
                    <Skeleton className=" w-[95%] h-[500px] rounded-3xl" />
                  </div>
                </div>
              :
              <div>
                <div className='flex items-center justify-center mx-3 flex-wrap gap-4 mt-4 mb-4'>

                  <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all duration-300 shadow-cyan-500 text-white" spotlightColor="#024f61">
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col items-center justify-between text-cyan-500'>  <h1 className='font-bold text-2xl'>Average Score</h1>
                        <p className='text-muted-foreground'>Average mock score.</p></div>

                      <div>
                        {
                          additionOfTotalScore && <h1 className='font-bold text-2xl text-cyan-500'>{Math.round(additionOfTotalScore / fetchedUserData?.user?.mockAttempts.length || 0)}</h1>
                        }
                      </div>
                    </div>
                  </SpotlightCard>
                  <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all duration-300 shadow-green-500 text-white" spotlightColor="#02610a">
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col items-center justify-between text-green-600'>  <h1 className='font-bold text-2xl'>Total Questions</h1>
                        <p className='text-muted-foreground'>Total mock questions.</p></div>

                      <div>
                        <h1 className='font-bold text-2xl text-green-600'>{fetchedUserData?.user?.mockAttempts.length * 10 || 0}</h1>
                      </div>
                    </div>
                  </SpotlightCard>
                  <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all  duration-300 shadow-yellow-500 text-white" spotlightColor="#574002">
                    <div className='flex items-center  justify-between'>
                      <div className='flex flex-col items-center  justify-start  text-yellow-400'>  <h1 className='font-bold text-2xl text-left w-full'>Difficulty Stats</h1>
                        <p className='text-muted-foreground pl-3'>Question count as per difficulty.</p></div>

                      <div>
                        <h1 className='font-bold text-lg text-nowrap text-green-500'>Easy {countEasy}</h1>
                        <h1 className='font-bold text-lg text-nowrap text-yellow-500'>Medium {countMedium}</h1>
                        <h1 className='font-bold text-lg text-nowrap text-orange-500'>Hard {countHard}</h1>
                      </div>
                    </div>
                  </SpotlightCard>


                </div>
                <AnalysticsChart />
              </div>
          }

{
     fetchedUserData?.user?.mockAttempts?.length > 0 &&   <PreviousMockTable data={fetchedUserData?.user?.mockAttempts} />
}
       
        </SidebarInset>
      </SidebarProvider>

    </div>
  )
}

export default page

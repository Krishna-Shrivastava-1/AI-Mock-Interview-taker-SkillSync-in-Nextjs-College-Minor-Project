'use client'
import AnalysticsChart from '@/components/AnalysticsChart'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import SpotlightCard from '@/components/SpotlightCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const {fetchedUserData} = useWholeApp()
    const param = useParams()
  
    const allScores = fetchedUserData?.user?.mockAttempts.map((e) => e.score)
    // console.log('allscore num - ', allScores)
    // console.log('allscore num len - ', allScores.length)
    const validScores = allScores?.filter(score => typeof score === 'number');
    // console.log('validScores - ', validScores.length)
    const additionOfTotalScore = validScores?.reduce((acc, curr) => acc + curr, 0)
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
           <div className='flex items-center justify-center mx-3 flex-wrap gap-4 mt-4 mb-4'>

            <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all duration-300 shadow-cyan-500 text-white" spotlightColor="#024f61">
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between text-cyan-500'>  <h1 className='font-bold text-2xl'>Average Score</h1>
                        <p className='text-muted-foreground'>Average mock score.</p></div>

                    <div>
                       {
                        additionOfTotalScore &&<h1 className='font-bold text-2xl text-cyan-500'>{Math.round(additionOfTotalScore/fetchedUserData?.user?.mockAttempts.length || 0) }</h1>
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
            {/* <SpotlightCard className="w-sm max-h-32 hover:shadow-md transition-all  duration-300 shadow-yellow-500 text-white" spotlightColor="#446102">
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between text-yellow-500'>  <h1 className='font-bold text-2xl'>Unfinished Mock Test</h1>
                        <p className='text-muted-foreground'>Total mock test that you you not submitted.</p></div>

                    <div>
                        <h1 className='font-bold text-2xl text-yellow-500'>{allScores.length - validScores.length}</h1>
                    </div>
                </div>
            </SpotlightCard> */}


        </div>
          <AnalysticsChart />
          {/* <div>
            {
                fetchedUserData?.user?.mockAttempts?.reverse().filter((q)=>q.score !== null)?.map((e)=>(
                    <div className='text-white' key={e._id}>
                        <h1>{e?.questions?.[0]?.difficulty}</h1>
                        <h1>{e?.score || 0}</h1>
                    </div>
                ))
            }
          </div> */}
        </SidebarInset>
      </SidebarProvider>
    
    </div>
  )
}

export default page

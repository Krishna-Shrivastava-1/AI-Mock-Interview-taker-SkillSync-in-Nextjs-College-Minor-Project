'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import GetisOpenOrNot from '@/components/GetisOpenOrNot'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import axios from 'axios'
import { Check, LoaderCircle, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { userid, testid } = useParams()
    const [loading, setloading] = useState(false)
    const { fetchedUserData ,sideBarOpen} = useWholeApp()
    // console.log(userid)
    // console.log(testid)
    console.log(fetchedUserData?.user?.mockAttempts)
    const findQuestionObjectfromId = fetchedUserData?.user?.mockAttempts?.filter((e) => e._id === testid)
    console.log('find some - ', findQuestionObjectfromId?.[0])
    useEffect(() => {
        if (findQuestionObjectfromId) {
            setloading(true)
        }
    }, [testid, findQuestionObjectfromId])

    return (
        <div>
            <SidebarProvider className='dark'>
                <AppSidebar fetchedUser={fetchedUserData} />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center  gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
                        <div className="flex items-center gap-2 px-3 w-full">
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
                       loading && userid !== fetchedUserData?.user?._id ?
                            <div className='w-full flex items-center justify-center text-sky-500 text-lg font-semibold h-[60vh] '>
                                <h1>This Quiz result is not Belongs to you...</h1>
                            </div>
                            : loading ?
                            <div className='w-full flex justify-center items-center flex-col gap-3 text-white'>
                                <div className='w-[90%] p-2'>

                                    <div className='my-3'>
                                        <h1 className='text-xl font-semibold text-sky-500'>Mock Test Details</h1>
                                        {
                                            findQuestionObjectfromId?.[0]?.score ?
                                                <p className='text-lg'>In this mocktest your score is - {findQuestionObjectfromId?.[0]?.score}</p>
                                                :
                                                <p className='text-lg'>You have not submitted this mock test so there is no score.</p>
                                        }

                                    </div>
                                    {findQuestionObjectfromId?.[0] ?
                                        findQuestionObjectfromId?.[0]?.questions?.map((question, index) => (
                                            <div key={index}>
                                                <h1 className='text-xl font-bold'>{index + 1}. {question.questionText}</h1>
                                                {
                                                    question?.options?.map((opt, ind) => (
                                                        <div className={`hover:bg-zinc-900 cursor-pointer '}`} key={ind}>
                                                            <div className='flex items-center gap-2 p-1'>
                                                               <p className='text-gray-300'><span className="font-semibold">{String.fromCharCode(97 + ind)}.</span> {opt}</p>
                                                                {opt === question?.correctAnswer.trim() ? <Check strokeWidth='2.5' className='text-green-500 text-lg font-bold' />
                                                                    :
                                                                    question?.userAnswer === opt !== !question?.correctAnswer &&
                                                                    <X strokeWidth='2.5' className='text-red-500 text-lg font-bold' />
                                                                }
                                                            </div>

                                                        </div>
                                                    ))
                                                }
                                                <p key={index} className='text-orange-400 text-lg'><span className='text-white font-semibold text-lg'>Explaination -</span> {question?.explaination}</p>

                                            </div>
                                        ))
                                        :
                                           <div className='w-full flex items-center justify-center text-sky-500 text-lg font-semibold h-[60vh] '>
                                <h1>This is not your mocktest Result.</h1>
                            </div>
                                    }
                                </div>

                            </div>
                            :
                            <div className='w-full flex justify-center items-center flex-col gap-3 text-white'>

                                <div className='w-[90%] p-2'>
                                   <div className='w-full text-white flex items-center justify-center h-[70vh]'>
              <LoaderCircle size={45} className='animate-spin' />
            </div>
                                </div>
                            </div>
                    }




                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default page

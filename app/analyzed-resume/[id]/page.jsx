'use client'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from "react";
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import GetisOpenOrNot from '@/components/GetisOpenOrNot';
import Link from 'next/link';
const page = () => {
  const { id } = useParams()
  const [resumeData, setresumeData] = useState([])
  const [loading, setloading] = useState(true)
  const { fetchedUserData,sideBarOpen } = useWholeApp()
  const fetchResumeAnalysisbyId = async () => {
    try {
      const respo = await axios.get(`/api/resumeanalysis/getanlyzedresumebyid/${id}`)
      setresumeData(respo?.data?.getanalysisbyid)

    } catch (error) {
      console.log(error.message)
    } finally {
      setloading(false)
    }
  }


  useEffect(() => {
    if (id) {
      fetchResumeAnalysisbyId()
    }
  }, [id])

  // console.log(resumeData)
  // console.log(fetchedUserData)
  return (
    <div className="text-white">
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className='w-full flex items-center  justify-end'>
 {
                  !sideBarOpen &&
                  <Link href={'/'}>
                  
<h1 className='text-white font-semibold cursor-pointer select-none text-xl'>SkillSync</h1>
                  </Link>
                }
                <Button className='text-muted-foreground font-semibold text-md cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Logout</Button>
              </div>

            </div>
          </header>
    <GetisOpenOrNot />
          <div className='w-full flex justify-center items-center flex-col gap-3 text-white'>
            <div className='sm:w-[90%] w-full p-2'>
              { loading ?
                
                  <div className='w-full text-white flex items-center justify-center h-[70vh]'>
                    <LoaderCircle size={45} className='animate-spin' />
                  </div>
                  :
                  fetchedUserData?.user?._id === resumeData?.user ?
                  <div>
                    <h1 className='text-2xl font-semibold'>Detaled Resume Analysis Report</h1>
                    {
                      [resumeData]?.map((e, index) => (
                        <div key={index}>
                          <div className='bg-neutral-900 p-2 rounded-xl my-3'>
                            <h2 className='text-xl font-semibold'>Overall Analysis</h2>
                            <p>{e?.overall_assessment}</p>
                            <p className={`${e?.skill_relevance_and_match?.jd_match_percentage > 70 ? 'text-green-500' : e?.skill_relevance_and_match?.jd_match_percentage > 30 ? 'text-orange-500' : 'text-red-600'} font-semibold text-lg`}>Your Job Description Match- {e?.skill_relevance_and_match?.jd_match_percentage}%</p>
                          </div>
                          <div className='bg-neutral-900 p-2 rounded-xl my-3'>

                            <h2 className='text-xl font-semibold'>Your Job Description</h2>
                            <div className='overflow-y-auto max-h-56 noside'>
                              <p className=' whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: e?.jobDescription || 'No Job Description Provided' }} />
                            </div>

                          </div>
                          <div className='bg-neutral-900 p-2 rounded-xl my-3'>

                            <h2 className='text-xl font-semibold'>Interview Question on Your Resume?</h2>
                            {e?.interview_questions?.map((q, index) => (
                              <div key={index}>
                                <h3><span className='font-semibold text-lg'>Q {index + 1}.</span>  {q.replace('.', '?')}</h3>
                              </div>
                            ))}
                          </div>
                          <div className='bg-neutral-900 p-2 rounded-xl my-3'>

                            <h2 className='text-xl font-semibold'>Self Improvement Tips</h2>
                            {e?.improvement_tips?.map((q, index) => (
                              <div key={index}>
                                <h3><span className='font-semibold text-lg'>#Tip {index + 1}.</span> {q}</h3>
                              </div>
                            ))}
                          </div>
                          <div className='bg-neutral-900 w-full p-2 flex items-start justify-between md:flex-nowrap flex-wrap rounded-xl my-3'>
                            <div className='w-full'>
                              <h2 className='text-xl font-semibold'>Your Strengths</h2>
                              {e?.future_guidance?.strength_guide?.map((q, index) => (
                                <div key={index}>
                                  <h3><span className='font-semibold text-lg'>{index + 1}.</span> {q}</h3>
                                </div>
                              ))}
                            </div>
                            <div className='w-full'>
                              <h2 className='text-xl font-semibold'>Skills togather</h2>
                              {e?.future_guidance?.skill_acquisition?.map((q, index) => (
                                <div key={index}>
                                  <h3><span className='font-semibold text-lg'>{index + 1}.</span> {q}</h3>
                                </div>
                              ))}
                            </div>


                          </div>
                          <div className='bg-neutral-900 p-2 rounded-xl my-3'>

                            <h2 className='text-xl font-semibold'>Skill Relevance and Match</h2>


                            <p>{e?.skill_relevance_and_match?.skill_relevance}</p>


                          </div>
                          <div className='flex items-center justify-center'>
                            <a href={e?.uploadedResumeUrl} download>
                              <Button className='cursor-pointer select-none font-semibold text-lg' type='download'>Download Your Resume</Button>
                            </a>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                   :
               <div className='w-full text-white flex items-center justify-center h-[70vh]'>
                    <p>Analysis is not Belongs to you.</p>
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

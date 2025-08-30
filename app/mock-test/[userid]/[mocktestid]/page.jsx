'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Check, LoaderCircle, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import GetisOpenOrNot from '@/components/GetisOpenOrNot'
const page = () => {
    const param = useParams()
    const { fetchedUserData,sideBarOpen } = useWholeApp()
    const { userid, mocktestid } = param
    const [mockQuestion, setmockQuestion] = useState([])
    const [optrespo, setoptrespo] = useState({})
    const [loading, setloading] = useState(true)
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);
    // if(userid !== fetchedUserData?.user?._id){
    //     return (
    //         <div className='w-full flex items-center justify-center text-white '>
    //             <h1>This Quiz is not Belongs to you...</h1>
    //         </div>
    //     )
    // }
    const fetchMocktestById = async () => {
        try {
            const rep = await axios.get(`/api/mockgenerator/getmockbyid/${decodeURIComponent(mocktestid)}`)
            if (rep?.data?.mock) {

                setmockQuestion(rep?.data?.mock)
                setloading(false)
            }
        } catch (error) {
            console.log(error.message)
            setloading(false)
        }
    }
    useEffect(() => {
        if (decodeURIComponent(mocktestid)) {
            fetchMocktestById();
        }
    }, [decodeURIComponent(mocktestid),fetchedUserData]);

    // console.log(mockQuestion)

    const handleoptRespo = (quest_id, selectedValue) => {
        setoptrespo(prevRespo => {
            return {
                ...prevRespo,
                [quest_id]: selectedValue
            }
        })
    }
    const objLength = Object.keys(optrespo).length
    console.log('eln =', objLength)
    const sentRespotobackend = async () => {
        if (objLength === 10) {
            await axios.put('/api/mockgenerator/usernassub', {
                userresp: optrespo,
                mockTestId: mocktestid
            })
            setIsOpen(true)
            // router.back()
        } else {
            alert("Please answer all questions before submitting.")

        }

    }

    const mockQuesitonwithans = fetchedUserData?.user?.mockAttempts.filter((e) => e._id === mocktestid)
    // console.log(mockQuesitonwithans?.[0])
    // console.log(mockQuesitonwithans?.[0]?.questions)
    // console.log(optrespo)
    // console.log(optrespo['689d7cfbac4cf6a4ee833da3'])
    const emparr = Object.keys(optrespo)
    // console.log(emparr)
    const quest_id = mockQuestion?.questions?.map((e) => {
        return mockQuesitonwithans?.[0]?.questions?.find((q) => q._id === e._id).explaination


    })

    console.log(quest_id)
    let totalscore = 0
    mockQuesitonwithans?.[0]?.questions?.map((e) => {
        const userAns = optrespo[e._id]
        const correctedAns = e?.correctAnswer
        if (userAns === correctedAns) {
            totalscore++
        }
    })
    // console.log(totalscore)

    const isMockidExist = fetchedUserData?.user?.mockAttempts.some((e) => {
        if(e._id === mocktestid){
            return true
        }else{
           return false
        }
    })
    // console.log('huy',isMockidExist)
    return (
        <div className='text-white'>
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
                            {/* <Breadcrumb>
                                  <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                      <BreadcrumbLink href="#">
                                        Building Your Application
                                      </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                  </BreadcrumbList>
                                </Breadcrumb> */}
                        </div>
                    </header>
                    {/* <div className='w-full flex items-center justify-center'>
                    <div className='text-white w-[90%] sm:w-[70%]'>
                    <h1 className='text-xl font-bold'>Guidelines:</h1>
                 
                      <span className='flex items-start justify-center'><p> Please provide your role, skills, and difficulty level to generate a mock test. The AI will create questions based on the provided information.</p></span>
                      <span  className='flex items-start justify-center text-red-500'><p className='text-red-500'> Note: If you leave the quiz in middle after started you will not able to continue the quiz again and this affect your overall average and score.</p></span>
                  
                  
                   </div>
                 </div> */}
                    <GetisOpenOrNot />
                    {
                           loading ? (
        <div className='w-full flex items-center justify-center h-[70vh]'>
            <LoaderCircle size={45} className='animate-spin' />
        </div>
    )
    :
     mockQuesitonwithans?.[0]?.score ? (
        <div className='w-full flex items-center justify-center text-sky-500 text-lg font-semibold h-[60vh]'>
            <h1>This Quiz has already been attempted.</h1>
        </div>
    ) :
    // userid !== fetchedUserData?.user?._id || !isMockidExist ? (
    //     <div className='w-full flex items-center justify-center text-sky-500 text-lg font-semibold h-[60vh]'>
    //         <h1>This Quiz does not belong to you.</h1>
    //     </div>
    // ) :
                    
                                <div className='w-full flex justify-center items-center flex-col gap-3'>
                                    <div className='w-[90%] p-2'>
                                        {
                                            mockQuestion?.questions?.map((question, index) => (
                                                <div key={index}>
                                                    <h1 className='text-xl font-bold'>{index + 1}. {question.questionText}</h1>
                                                    {
                                                        question?.options?.map((opt, ind) => (
                                                            <div className={`hover:bg-zinc-900 cursor-pointer '}`} key={ind}>
                                                                <div onClick={() => handleoptRespo(question._id, opt)} className='flex items-center gap-2 p-1'>
                                                                    <p className='text-gray-300'><span className="font-semibold">{String.fromCharCode(97 + ind)}.</span> {opt}</p>
                                                                    {optrespo[question?._id] === opt && <Check strokeWidth='2.5' className='text-green-500 text-lg mx-2 font-bold' />}
                                                                </div>

                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className='sticky bottom-0  z-40 mt-5 pb-6  w-full flex items-center justify-center bg-black/30 backdrop-blur-md'>

                                        <Button onClick={sentRespotobackend} className='text-white font-semibold text-md cursor-pointer select-none md:w-md w-[90%] hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 hover:bg-zinc-900' variant="secondary" type='submit'> Submit Quiz</Button>
                                    </div>
                                </div>
                               
                    }
                    <div>
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen} className='dark text-white'>
                            <AlertDialogContent className='dark text-white '>
                                <AlertDialogHeader>
                                    <AlertDialogTitle><div className='w-full flex-wrap flex justify-between items-center text-wrap'><h1>Your Mock Summary </h1><h1 className='text-nowrap'>Your Score - {totalscore}/10</h1></div></AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className='w-[90%] p-1 overflow-y-auto noside h-[70vh]'>
                                            {
                                                mockQuestion?.questions?.map((question, index) => (

                                                    <div key={index}>
                                                        <div className='text-xl text-white font-bold'>{index + 1}. {question.questionText}</div>
                                                        {
                                                            // Map over each option for the current question
                                                            question?.options?.map((opt, ind) => {
                                                                // Find the correct answer for the current question
                                                                const correctAnswer = mockQuesitonwithans?.[0]?.questions?.find(q => q._id === question._id)?.correctAnswer;

                                                                // Find the user's selected answer for the current question
                                                                const userAnswer = optrespo[question._id];

                                                                // This boolean is used to decide which icon to render
                                                                const isUserAnswerCorrect = userAnswer === correctAnswer;

                                                                // This boolean checks if the current option in the loop is the correct one
                                                                const isCorrectOption = opt === correctAnswer;

                                                                // This boolean checks if the current option in the loop is the one the user selected
                                                                const isUserSelectedOption = opt === userAnswer;

                                                                return (

                                                                    <div className={`hover:bg-zinc-900 cursor-pointer`} key={ind}>
                                                                        <div className='flex items-center gap-2 p-1'>
                                                                            <p className='text-gray-300'><span className="font-semibold">{String.fromCharCode(97 + ind)}.</span> {opt}</p>

                                                                            {/* Render the check icon for the correct answer */}
                                                                            {isCorrectOption && (
                                                                                <Check strokeWidth='2.5' className='text-green-500 mx-2 text-lg font-bold' />

                                                                            )}

                                                                            {/* Render the cross icon for a wrong user selection, but only if the option is not correct */}
                                                                            {!isCorrectOption && isUserSelectedOption && (
                                                                                <X strokeWidth='2.5' className='text-red-500 text-lg font-bold' />
                                                                            )}
                                                                        </div>
                                                                    </div>


                                                                );
                                                            })

                                                        }
                                                        {

                                                            <p><span className='text-white font-semibold text-lg'>Explaination -</span> {quest_id[index]}</p>
                                                        }

                                                    </div>
                                                ))


                                            }
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogAction onClick={() => router.back()} variant='ghost'>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                </SidebarInset>
            </SidebarProvider>

        </div>
    )
}

export default page

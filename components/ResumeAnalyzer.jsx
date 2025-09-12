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
import { Input } from "./ui/input";
import { Label } from "./ui/label";


import QuillEditor from "./QuillEditor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ShinyText from "./ShinyText";
import GetisOpenOrNot from "./GetisOpenOrNot";
import Link from "next/link";







export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const { fetchedUserData, jobDescriptionText, setjobDescriptionText, sideBarOpen } = useWholeApp()
  const [previewUrl, setpreviewUrl] = useState(null)
  const [loading, setloading] = useState(false)
  const router = useRouter()
  const [timer, settimer] = useState(1)
  const [mint, setmint] = useState(1)
  const [isTimerRunning, setisTimerRunning] = useState(false)

  useEffect(() => {
    if (isTimerRunning) {
      let tim

      if (timer < 60) {
        tim = setInterval(() => {
          settimer((e) => e + 1)
        }, 1000);

      }
      else if (timer > 59) {

        settimer(1)
        tim = setInterval(() => {
          settimer((e) => e + 1)
        }, 1000);
        setmint(prev => prev + 1)

      }
      //  console.log(timer)

      if (mint === 110) {
        return null
      }

      return () => clearInterval(tim)
    }
  }, [isTimerRunning, timer])


  const handleUpload = async () => {
    if (!file) {

      return toast.warning('Please Select the Resume pdf')

    }
    setisTimerRunning(true)
    setloading(true)
    const formData = new FormData();
    if (file) formData.append("resume", file);
    formData.append("jd", jobDescriptionText);
    formData.append("userID", fetchedUserData?.user?._id)

    const res = await fetch("/api/resumeanalysis", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setjobDescriptionText('')
    if (data) {

      router.push(`/analyzed-resume/${data?.analyzedResume?._id}`)
    }
  };
  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setpreviewUrl(fileUrl);
    }
  }, [file])

  // console.log(result)


  // console.log(timer)
  // console.log(mint)


  // console.log(jobDescriptionText)
  return (
    <div className="text-white">
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
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
          <div className='w-full flex justify-center items-center flex-col gap-3 text-white'>
            {!loading ?
              <div className='w-[90%] p-2'>
                <div>
                  <h1>Analyze Your Resumes:</h1>
                </div>
                <div>
                  <div className="flex items-center justify-start flex-wrap">

                    <div className=" w-full max-w-sm  gap-3 flex items-center ">
                      <Label className='text-lg text-wrap' htmlFor="picture">Select Resume in PDF Format</Label>
                      <Input
                        required
                        id='picture'
                        type="file"
                        accept='.pdf'
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    {/* {previewUrl &&
                  <div className="w-full">
                    <iframe src={previewUrl}
                      width="100%"
                      height="500px"
                      title="PDF Preview"
                    />
                  </div>
                } */}
                  </div>
                  {/* <textarea
                  placeholder="Paste Job Description..."
                  onChange={(e) => setJd(e.target.value)}
                /> */}
                  <h2 className="font-semibold text-red-600 text-lg my-3">Optional* if Job Description</h2>
                  <QuillEditor onChange={(val) => setjobDescriptionText(val)} />
                  {/* <TinyEditor /> */}
                  <div className="w-full flex items-center
               justify-center">
                    <Button variant='secondary' className='cursor-pointer select-none font-semibold w-full' onClick={handleUpload}>Analyze</Button>
                  </div>

                </div>
                {
                  // timer < 60 && mint === 1 ?
                  //   <ShinyText
                  //     text={`Analyzing Your Resume ${Math.floor(timer)}s`}
                  //     disabled={false}
                  //     speed={1.8}
                  //     className='custom-class'
                  //   /> :

                  //   <ShinyText
                  //     text={`Analyzing Your Resume ${mint}m ${timer}s`}
                  //     disabled={false}
                  //     speed={1.8}
                  //     className='custom-class'
                  //   />

                }
              </div>
              :
              <div className='w-full  flex items-center justify-center h-[70vh]'>
                {
                  timer < 60 && mint === 1 ?
                    <ShinyText
                      text={`Analyzing Your Resume ${Math.floor(timer)}s`}
                      disabled={false}
                      speed={1.8}
                      className='custom-class'
                    /> :

                    <ShinyText
                      text={`Analyzing Your Resume ${mint}m ${timer}s`}
                      disabled={false}
                      speed={1.8}
                      className='custom-class'
                    />

                }
              </div>}


          </div>

        </SidebarInset>
      </SidebarProvider>

    </div>
  );
}

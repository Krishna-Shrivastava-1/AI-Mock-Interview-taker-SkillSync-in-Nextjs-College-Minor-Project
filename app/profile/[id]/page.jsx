'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
import { ChartBarStacked, ChartPieLabel } from '@/components/ChartBarStacked'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { io } from 'socket.io-client'
import GetisOpenOrNot from '@/components/GetisOpenOrNot'
import Link from 'next/link'

// const socket = io("http://localhost:5500");
const socket = io("https://ai-mock-interview-minor-project-socket.onrender.com");
const page = () => {
  const { id } = useParams()
  const { fetchedUserData ,sideBarOpen} = useWholeApp()
  const [loading, setloading] = useState(true)
  const [newName, setnewName] = useState('')
  const [newSkill, setnewSkill] = useState('')
  const [newBio, setnewBio] = useState('')
  const [open, setopen] = useState(false)
  const [userDatafromparam, setuserDatafromparam] = useState([])
  const fetchUserDatafromId = async () => {
    try {
       const timestamp = Math.floor(Date.now() / 1000) // seconds
            const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // public part
      const respo = await axios.get(`/api/auth/getuserbyid/${id}?ts=${timestamp}`, {
        withCredentials: true,
        headers: {
          Authorization: `UserId ${id}`,
           "x-client-key": clientKey,
        }
      })

      setuserDatafromparam(respo?.data)
    } catch (error) {
      console.log(error.message)

    }
  }

  useEffect(() => {
    if (userDatafromparam?.user) {
      setloading(false)
      setnewName(userDatafromparam?.user?.name)
      setnewSkill(userDatafromparam?.user?.skills.join(', '))
      setnewBio(userDatafromparam?.user?.descriptionAbout)
    }
  }, [userDatafromparam])
  const handlesubmit = async (e) => {
    try {
      e.preventDefault()
      const cleanedSkills = newSkill
        .split(',')
        .map(skill => skill.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()))
        .filter(skill => skill.length > 0)

      const respo = await axios.put('/api/auth/descandskill', {
        userId: userDatafromparam?.user?._id,
        skills: cleanedSkills,
        description: newBio,
        name: newName.trim()
      })
      // console.log(respo)
      setopen(false)
      if (!respo?.data?.success) {
        toast.warning(respo?.data?.message)
      }
      if (respo?.data?.success) {
        await fetchUserDatafromId()
        toast.success(respo?.data?.message)
      }



    } catch (error) {
      console.log(error.message)
      toast.warning("Something went wrong, but don’t fret — it’s not your fault.")
    }
  }
  // console.log(newName)
  // console.log(userDatafromparam?.user)
  // Medium questions total score
  const mediumMockQuesitonsArr = fetchedUserData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'medium' || e?.questions?.[0]?.difficulty === 'medium')
  const totalMediumScore = mediumMockQuesitonsArr?.reduce((total, quiz) => {

    return total + (quiz.score ?? 0);
  }, 0);
  // console.log('Total score for medium quizzes:', totalMediumScore);


  // Easy questions total score
  const easyMockQuesitonsArr = fetchedUserData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'easy' || e?.questions?.[0]?.difficulty === 'easy')
  const totalEasyScore = easyMockQuesitonsArr?.reduce((total, quiz) => {

    return total + (quiz.score ?? 0);
  }, 0);
  // console.log('Total score for medium quizzes:', totalEasyScore);

  // Hard questions total score
  const hardMockQuesitonsArr = fetchedUserData?.user?.mockAttempts?.filter((e) => e?.difficulty === 'hard' || e?.questions?.[0]?.difficulty === 'hard')
  const totalHardScore = hardMockQuesitonsArr?.reduce((total, quiz) => {

    return total + (quiz.score ?? 0);
  }, 0);
  // console.log('Total score for medium quizzes:', totalHardScore);



  useEffect(() => {
    // listen for updates
    socket.on("userProfilesUpdated", (data) => {
      // console.log("Live update:", data);
      setuserDatafromparam(prev => {
        if (!prev?.user) return data;
        return {
          ...prev,
          user: {
            ...prev.user,
            followers: data?.user?.followers ?? prev.user.followers,
            following: data?.user?.following ?? prev.user.following,
          }
        };
      });

    });

    return () => {
      socket.off("userProfilesUpdated");
    };
  }, []);
  const handlefollowandunfollow = (followerid, followingId) => {
    socket.emit("followUser", { followerId: followerid, followingId: followingId });
  };

  useEffect(() => {

    fetchUserDatafromId()
  }, [id])
  // console.log(userDatafromparam)

  return (
    <div>
      <SidebarProvider className='dark'>
        <AppSidebar fetchedUser={fetchedUserData} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2  border-b backdrop-blur-lg bg-background/30 sticky top-0 z-40">
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
            loading ?
              <div className='w-full text-white flex items-center justify-center h-[70vh]'>
                <LoaderCircle size={45} className='animate-spin' />
              </div>
              :
              <div className='w-full flex items-start  justify-center text-white'>


                <div className=' m-2  w-full border h-auto  border-zinc-800  p-2 rounded-xl max-w-xl text-white'>
                  <div className='flex items-center justify-between flex-wrap'>
                    <h1 className='text-2xl font-bold'>Profile</h1>
                    <div>
                      {
                        fetchedUserData?.user?._id === id && <Dialog open={open} onOpenChange={setopen} className='dark text-white'>
                          <DialogTrigger><span className='text-zinc-200 font-semibold text-md cursor-pointer select-none hover:border-teal-700 hover:border-[0.5px] transition-all p-2 rounded-lg duration-150 hover:bg-teal-700/30 bg-neutral-800 hover:text-white' >Edit Profile</span></DialogTrigger>
                          <DialogContent className='dark text-white max-h-[450px] overflow-y-auto noside'>
                            <DialogHeader>
                              <DialogTitle className='sticky text-xl top-0 z-30 p-2 bg-neutral-800/20 backdrop-blur-lg'>Edit Profile </DialogTitle>
                              <form onSubmit={handlesubmit} className='text-white flex flex-col items-center justify-center '>


                                <div className='w-full'>
                                  <Label htmlFor="message-1"><span className='text-lg font-bold m-1 '>Your Name</span></Label>
                                  <Input maxLength={50} value={newName} onChange={(e) => setnewName(e.target.value)} required type="text" className='text-lg font-semibold my-3' placeholder="Your FullName" id="message-1" />
                                </div>
                                <div className='w-full'>
                                  <Label htmlFor="message-2"><span className='text-lg font-bold m-1 '>Your Skills</span></Label>
                                  <Input value={newSkill} onChange={(e) => setnewSkill(e.target.value)} required type="text" className='text-lg font-semibold my-3' placeholder="Your Skills, ex - python,java,c ..." id="message-2" />
                                </div>

                                <div className=" w-full ">
                                  <Label htmlFor="message-3" className='text-lg font-bold m-1 '>Tell us About Yourself</Label>
                                  <Textarea value={newBio} onChange={(e) => setnewBio(e.target.value)} required className='text-lg font-semibold my-3 whitespace-pre resize-none min-h-32' placeholder="Tell us a little bit about yourself" id="message-3" />

                                </div>
                                <Button type='submit' className="w-full  sticky bottom-0 z-30 cursor-pointer font-bold">Save</Button>
                              </form>


                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      }



                    </div>
                  </div>
                  <div className='flex flex-col w-full justify-center  '>

                    <div className="flex flex-1 flex-col  gap-4 p-4 w-full">
                      <div className='text-white w-full'>

                        <div className='flex items-center justify-around mb-3'>
                          <div>
                            <Image src='https://github.com/shadcn.png' alt='avatar' loading='lazy' className='rounded-full' width={200} height={200} />
                          </div>
                          <h1 className='font-semibold text-2xl text-center'> {userDatafromparam?.user?.name}</h1>
                        </div>
                        <div className='flex items-center flex-wrap justify-between'>
                          {
                            fetchedUserData?.user?._id === id && <div className='flex items-center justify-start'><h1 className='font-semibold'>Email: {userDatafromparam?.user?.email}</h1>
                            </div>
                          }
                          {
                            fetchedUserData?.user?._id !== id ?
                              <div className='flex items-center justify-around flex-wrap w-full'>
                                {
                                  userDatafromparam?.user?.followers?.includes(fetchedUserData?.user?._id) ?
                                    <Button style={{ 'backgroundColor': '#038391', 'color': 'white' }} onClick={() => handlefollowandunfollow(fetchedUserData?.user?._id, id)} className='font-semibold rounded-full md:w-sm w-full cursor-pointer select-none text-white text-lg'>Following</Button>
                                    :

                                    <Button onClick={() => handlefollowandunfollow(fetchedUserData?.user?._id, id)} className='font-semibold md:w-sm w-full text-lg rounded-full cursor-pointer select-none'>Follow</Button>
                                }
                                <p>Followers: {userDatafromparam?.user?.followers?.length}</p>
                              </div>
                              :
                              <div ><p >Followers: {userDatafromparam?.user?.followers?.length}</p></div>
                          }
                        </div>

                        <div className='flex items-center justify-start'><h1 className='font-semibold flex items-center flex-wrap justify-start text-center w-full'>Skills: {userDatafromparam?.user?.skills?.map((e, index) => (
                          <div key={index} className='bg-neutral-900 px-3 p-1 rounded-lg gap-2 m-2 '>{e}</div>
                        ))}</h1>
                        </div>

                        <div className='flex items-center justify-start'>
                          <h1 className='font-semibold flex items-start gap-x-4'>
                            Bio:

                            <div className='w-full  whitespace-pre-wrap'>
                              {userDatafromparam?.user?.descriptionAbout}
                            </div>
                          </h1>
                        </div>
                        <div className='w-full'>
                          <h2 className='my-4 mb-8 text-xl font-bold'>Number of Problems Count as per Difficulty</h2>
                          <ChartBarStacked userData={userDatafromparam} />
                        </div>
                        <div className='flex items-center justify-start'>
                          {/* <h1 className='font-semibold flex items-start gap-x-4'>
                           Medium:

                            <div className='w-full  whitespace-pre-wrap'>
                              {userDatafromparam?.user?.descriptionAbout}
                            </div>
                          </h1> */}
                        </div>


                      </div>


                    </div>

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

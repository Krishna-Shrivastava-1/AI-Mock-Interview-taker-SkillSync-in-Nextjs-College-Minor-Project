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
import { ChartColumn, Heart, LoaderCircle, MessageCircle, Share } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { io } from 'socket.io-client'
import GetisOpenOrNot from '@/components/GetisOpenOrNot'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'


// const socket = io("http://localhost:5500");
const socket = io("https://ai-mock-interview-minor-project-socket.onrender.com");
const page = () => {
  const { id } = useParams()


 const { fetchedUserData, setpostData,postData } = useWholeApp()
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
  }, [id,postData])

   useEffect(() => {
        // listen for updates
        socket.on("postLiked", (data) => {
            // console.log("Live update:", data);
            if (data) {
                setpostData(prevpost => prevpost.map(e => e?._id === data?.updatedPost?._id ? data?.updatedPost : e))
            }
        });

        return () => {
            socket.off("postLiked");
        };
    }, []);

  const handleLike = (id, userid) => {
        socket.emit("likePost", { postId: id, userId: userid });

    };

  // console.log(userDatafromparam)

  return (
    <div>
      <div className='w-full '>
        {/* {
          userDatafromparam?.user?.posts?.length === 0 && <p>Nothing Posted Yet.</p>
        } */}
        {userDatafromparam?.user?.posts?.length > 0 ?
          [...userDatafromparam?.user?.posts].reverse()?.map((e, index) => (
            <div className='text-white border border-t-0 p-2 w-full hover:bg-neutral-900' key={index}>
              <Link href={`/profile/${e?.user?._id}`}>

                <div className='flex group cursor-pointer select-none items-center w-fit justify-start'>
                  <div className='rounded-full font-semibold text-center text-xl m-2 px-4 p-2 bg-neutral-800'>{userDatafromparam?.user?.name?.[0]} </div>

                  <h1 className='text-lg group-hover:underline font-semibold'>{userDatafromparam?.user?.name}</h1>
                  <span className='text-sm text-neutral-500 mx-2'>{new Date(e?.createdAt).toDateString()}</span>
                </div>
              </Link>
              <Link href={`/status/${e?._id}`}>
                <p className='whitespace-pre-wrap line-clamp-5 sm:pl-16'>{e?.message}</p>
              </Link>

              <div className='flex justify-around w-full mt-5'>
                <div>
                  <MessageCircle className='text-neutral-600' />
                </div>
                <div onClick={() => handleLike(e._id, fetchedUserData?.user?._id)} className='flex items-center justify-center group cursor-pointer select-none relative'>
                  <div className='p-2 rounded-full group-hover:bg-pink-800/20  transition-all duration-150 flex items-center text-sm'>
                    {
                      e?.likes.includes(fetchedUserData?.user?._id) ?
                        <Heart className=' group-hover:text-pink-700 text-pink-700 ' fill='currentColor' />
                        :
                        <Heart className='text-neutral-600 group-hover:text-pink-700' />
                    }
                  </div>
                  {e?.likes.length > 0 && <p className={`group-hover:text-pink-600 text-neutral-600 absolute left-[35px] `}>{e?.likes.length}</p>}
                </div>

                <div className='flex items-center justify-center group cursor-pointer select-none relative'>
                  <div className='p-2 rounded-full group-hover:bg-sky-800/20  transition-all duration-150 flex items-center text-sm'>
                    <ChartColumn className=' group-hover:text-sky-700 text-neutral-700 ' />
                  </div>
                  <p className={`group-hover:text-sky-600 text-neutral-600 absolute left-[35px] `}>{e?.views}</p>
                </div>
                <div className='flex items-center justify-center group cursor-pointer select-none relative'>
                  <div className='p-2 rounded-full group-hover:bg-sky-800/20  transition-all duration-150 flex items-center text-sm'>
                    <Share className=' group-hover:text-sky-700 text-neutral-700 ' />
                  </div>

                </div>
                {/* <div>
                                                            <Share className='text-neutral-600' />
                                                        </div> */}
              </div>
            </div>
          ))
          :
           userDatafromparam?.user?.posts?.length === 0 ? <p className='text-center text-xl font-semibold my-4'>Nothing Posted Yet.</p> :
          Array(6).fill(null).map((_, ind) => (
            <div className='text-white border border-t-0 p-2 w-full hover:bg-neutral-900' key={ind} >
              <Skeleton className="h-32 w-full" />
            </div>
          ))

        }
        {/* <button className='text-white' onClick={handleLoadMore} >
                                            load more
                                        </button> */}
      </div>
    </div>
  )
}

export default page

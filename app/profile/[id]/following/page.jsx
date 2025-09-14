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
        {userDatafromparam?.user?.following?.length > 0 ?
           userDatafromparam?.user?.following?.map((e) => (
                                                <div key={e?._id}>
                                                    <Link href={`/profile/${e?._id}`}>
                                                        <div className='flex justify-between items-center w-full cursor-pointer hover:bg-neutral-900 rounded-xl'>
                                                            <div className='rounded-full font-semibold text-center text-xl m-2 px-4 p-2 bg-neutral-800'>{e?.name?.[0]} </div>
                                                            <div>
                                                                <h1 className='font-semibold'>{e?.name}</h1>
                                                                <p className=' line-clamp-1 text-neutral-400'>{e?.descriptionAbout}</p>
                                                            </div>
                                                            <Button className='rounded-full font-semibold cursor-pointer'>View</Button>
                                                        </div>
                                                    </Link>

                                                </div>
                                            ))
          
          :
           userDatafromparam?.user?.following?.length === 0 ? <p className='text-center text-xl font-semibold my-4'>Not Followed Anyone.</p> :
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

'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useSidebar } from './ui/sidebar'
import { useWholeApp } from './AuthContextApi'
import { formatDistanceToNow } from 'date-fns'




const DiscoverSectionNews = ({setMore}) => {
  const [newsData, setnewsData] = useState([])
  const {setsideBarOpen,sideBarOpen}= useWholeApp()

const {open} = useSidebar()
  const fecthNews = async () => {
     const timestamp = Math.floor(Date.now() / 1000) // seconds
  const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // public part

    const resp = await axios.get(`/api/news?ts=${timestamp}`,{
       headers: {
      "x-client-key": clientKey,
    },
    })
    setnewsData(resp?.data?.data)
  }
  useEffect(() => {
    fecthNews()
  }, [])
  // console.log(process.env.NEXT_PUBLIC_CLIENT_SECRET)
  useEffect(() => {
    
    setsideBarOpen(open)
  }, [open])
  // console.log(open)
  // console.log(sideBarOpen)
 const formatDateAndHoursAgo = (dateString) => {
     if (!dateString) {
       return 'Published: Unknown';
     }
     const publishedDate = new Date(dateString);
     const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
     const formattedDate = publishedDate.toLocaleDateString(undefined, {
       year: 'numeric',
       month: 'long',
       day: 'numeric',
     });
     return `Published: ${formattedDate} (${timeAgo})`;
   };
  return (
    <div className='text-white '>
      <div className='w-full flex items-center justify-between'>
      <h1 className='text-2xl font-semibold my-2 mb-5'>Discover</h1>
<Button onClick={()=>setMore(true)} className='text-muted-foreground font-semibold text-sm cursor-pointer select-none hover:border-zinc-700 hover:border-[0.5px] transition-all duration-150 ' variant="ghost">Show More</Button>
      </div>
      <div className='w-full flex items-center justify-around gap-2  flex-wrap'>
        {
          newsData?.results ?
            newsData?.results?.map((e, index) => (
              
              <div key={index} className='w-[300px] group rounded-md border shadow hover:shadow-md shadow-neutral-800 border-neutral-900'>

 <Link href={e?.link} target='_blank' aria-label={`Read full article: ${e?.title}`}>
                <div className="relative max-w-full h-56 sm:h-64">
                  {e?.image_url && (
                                        <Image
                                          src={e?.image_url}
                                          alt={e?.title}
                                          layout="fill"
                                          objectFit="contain"
                                          className="hover:opacity-90 transition-opacity duration-200 rounded-xl"
                                        />
                                      )}
                  <div className="absolute flex items-center justify-between gap-x-3 rounded-sm bottom-10 left-0 bg-black/40 backdrop-blur-md font-bold text-white p-2 text-sm">
                    <Image src={e?.source_icon} width={30} height={30} className='rounded-full' alt='Source icon' />
                    <span>{e?.source_name}</span>
                  </div>
                </div>
                </Link>

                <div className="p-4">
                  <h1 className="group-hover:text-white text-xl font-bold text-neutral-400 mb-2 transition-colors duration-200">{e?.title}</h1>
                <p className="text-neutral-300 text-sm mb-3 line-clamp-16">{e?.description}</p>
                {/* <div className='w-full flex items-center justify-start my-2'>
                  <p className='font-semibold'>Written by-: {e?.creator?.[0]}</p>
                </div> */}
                <div className="flex justify-between items-center text-gray-500 text-xs">
                  <p>{formatDateAndHoursAgo(e?.pubDate)}</p>
                  {/* <p>{new Date(e?.pubDate).toDateString()}</p> */}
                  <Link target='_blank' href={e?.link} 
                      
                      className="text-blue-500 hover:underline font-semibold text-nowrap flex items-center"
                      aria-label={`Read full article on ${e?.source}`}>

                   Read More 
                   {/* <span><MoveUpRight className='stroke-2  rotate-42 group-hover:rotate-0 transition-all duration-150' /></span> */}
                  </Link>
                </div>
                </div>

              </div>
            ))
            :
            <div className='w-full flex items-center justify-around flex-wrap gap-4'>
              {
                Array(8).fill(null)?.map((_, index) => (
                   <Skeleton key={index} className="h-[450px]     w-[300px] rounded-3xl" />
                ))
              }
            </div>
        }
      </div>
    </div>
  )
}

export default DiscoverSectionNews

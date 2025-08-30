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




const DiscoverSectionNews = () => {
  const [newsData, setnewsData] = useState([])
  const {setsideBarOpen,sideBarOpen}= useWholeApp()
const {open} = useSidebar()
  const fecthNews = async () => {
    const resp = await axios.get(`/api/news`)
    setnewsData(resp?.data?.data)
  }
  useEffect(() => {
    fecthNews()
  }, [])
  console.log(newsData?.data)
  useEffect(() => {
    
    setsideBarOpen(open)
  }, [open])
  console.log(open)
  console.log(sideBarOpen)
 
  return (
    <div className='text-white '>
      <h1 className='text-2xl font-semibold my-6'>Discover</h1>
      <div className='w-full flex items-center justify-around flex-wrap'>
        {
          newsData?.results ?
            newsData?.results?.map((e, index) => (
              
              <div key={index} className='w-sm border-[0.5px] m-3 border-neutral-700 rounded-lg p-2'>


                <div className='relative h-56 sm:h-64 max-w-full rounded-lg'>
                  <Image src={e?.image_url || '/'} layout="fill"
                    objectFit="contain"
                    className="hover:opacity-90 rounded-xl transition-opacity duration-200 " alt={e?.title} />
                  <div className="absolute rounded-sm bottom-6 left-0 bg-black/40 backdrop-blur-md font-bold text-white p-2 text-sm flex items-center gap-x-3">
                    <Image src={e?.source_icon} width={30} height={30} className='rounded-full' alt='Source icon' />
                    <span>{e?.source_name}</span>
                  </div>
                </div>

                <h1 className='text-xl font-semibold'>{e?.title}</h1>
                <p className='text-muted-foreground line-clamp-16'>{e?.description}</p>
                <div className='w-full flex items-center justify-start my-2'>
                  <p className='font-semibold'>Written by-: {e?.creator?.[0]}</p>
                </div>
                <div className='w-full flex items-center justify-between my-2'>
                  <p>{new Date(e?.pubDate).toDateString()}</p>
                  <Link target='_blank' href={e?.link}>

                    <Button className='cursor-pointer font-semibold text-md select-none group'>Read Full Article <span><MoveUpRight className='stroke-3 w-8 h-8 rotate-42 group-hover:rotate-0 transition-all duration-150' /></span></Button>
                  </Link>
                </div>

              </div>
            ))
            :
            <div className='w-full flex items-center justify-around flex-wrap gap-4'>
              {
                Array(6).fill(null)?.map((_, index) => (
                  <Skeleton key={index} className="h-72 w-md rounded-3xl" />
                ))
              }
            </div>
        }
      </div>
    </div>
  )
}

export default DiscoverSectionNews

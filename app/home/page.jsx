'use client'
import { AppSidebar } from '@/components/app-sidebar'
import { useWholeApp } from '@/components/AuthContextApi'
// import MagicBento from '@/components/MagicBento'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React from 'react'

const page = () => {
  const router = useRouter()
  const handleLogout = async () => {
    await axios.post('/api/auth/logout')
    router.push('/')
  }
  const{fetchedUserData,userId} = useWholeApp()
  return (
    <div className=''>
      <Navbar />
 
        {/* <SidebarProvider className='dark md:dark'>
      <AppSidebar  /> 
 
     <Button onClick={handleLogout} variant="secondary">Logout</Button>
     <SidebarTrigger className='dark'/>
    </SidebarProvider> */}


  
  <div className='w-full text-white font-bold text-center text-4xl'>
    <h1>Hi, {fetchedUserData?.user?.name }  </h1>
  </div>
 

   <Button onClick={handleLogout} variant="secondary">Logout</Button>
<Link href={`/mock-test`}>

     <Button variant="destructive">Mock Test</Button>
</Link>
     
    </div>
  )
}

export default page

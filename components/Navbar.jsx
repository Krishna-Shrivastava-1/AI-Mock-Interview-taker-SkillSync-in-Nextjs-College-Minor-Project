'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'


import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className='w-full flex items-center justify-center fixed top-0 z-40'>
    <nav className=" dark:bg-gray-950 backdrop-blur-xl bg-[#1e1e21]/30 w-3xl  border-neutral-500 rounded-full">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-sky-700">
          Mokai
        </Link>
        {(pathname === '/' || pathname === '/login' || pathname === '/about-detail') && (
          <div>
            <Link href="/login">
              <Button variant="secondary" className="cursor-pointer rounded-full text-md font-bold">Get Started</Button>
            </Link>
          </div>
        )}
 {/* <Sheet className='dark'>
  <SheetTrigger className='dark'>Open</SheetTrigger>
  <SheetContent side='left'  className="w-[300px] dark sm:w-[180px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet> */}
        {/* {pathname !== '/' || pathname !== '/login' || pathname !== '/about-detail' && <div>
          <Link href="/login">
            <Button variant="outline" className='cursor-pointer text-md  font-bold'>Get Started</Button>
          </Link>
        </div>} */}
      </div>
    </nav>
    </div>
  )
}

export default Navbar

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
    <nav className=" dark:bg-gray-950 backdrop-blur-xl ">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-sky-700">
          SkillSync
        </Link>
        {(pathname === '/' || pathname === '/login' || pathname === '/about-detail') && (
          <div>
            <Link href="/login">
              <Button variant="outline" className="cursor-pointer text-md font-bold">Get Started</Button>
            </Link>
          </div>
        )}
 <Sheet className='dark'>
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
</Sheet>
        {/* {pathname !== '/' || pathname !== '/login' || pathname !== '/about-detail' && <div>
          <Link href="/login">
            <Button variant="outline" className='cursor-pointer text-md  font-bold'>Get Started</Button>
          </Link>
        </div>} */}
      </div>
    </nav>
  )
}

export default Navbar

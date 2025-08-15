'use client'
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
import { useWholeApp } from './AuthContextApi';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import axios from 'axios';
const ProfileComplete = () => {
  const { fetchedUserData, userId } = useWholeApp()
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setskills] = useState('')
  const [descbio, setdescbio] = useState('')
  useEffect(() => {
    if (!fetchedUserData?.user?.isFilledaboutandskill) {
      setIsOpen(true)
    }else{
       setIsOpen(false)
    }
  }, [fetchedUserData?.user?.isFilledaboutandskill])

  const handlesubmit = async (e) => {
    try {
      e.preventDefault()
      const cleanedSkills = skills
        .split(',')
        .map(skill => skill.trim().charAt(0).toUpperCase() + skill.slice(1))
        .filter(skill => skill.length > 0)
      await axios.put('/api/auth/descandskill', {
        userId: userId,
        skills: cleanedSkills,
        description: descbio
      })
      setIsOpen(false)
    } catch (error) {
      console.log(error.message)
    }


  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen} className='dark p-0'>
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent className='dark text-white'>
          <AlertDialogHeader className='w-full'>
            <AlertDialogTitle className='hidden'>Complete Your Profile</AlertDialogTitle>


            <div className='w-full flex items-center justify-center '>

              <form onSubmit={handlesubmit} className='text-white flex flex-col items-center justify-center '>
                <h1 className='text-xl text-left font-bold'>Complete Your Profile</h1>
                <p className='text-muted-foreground text-left'>Select your industry to get personalized mock interviews and recommendations.</p>
                <div className='w-full'>
                  <Label htmlFor="message-1"><span className='text-lg font-bold m-1 '>Your Skills</span></Label>
                  <Input  onChange={(e) => setskills(e.target.value)} required type="text" className='text-lg font-semibold my-3' placeholder="Your Skills, ex - python,java,c ..." id="message-1" />
                </div>

                <div className=" w-full ">
                  <Label htmlFor="message-2" className='text-lg font-bold m-1 '>Tell us About Yourself</Label>
                  <Textarea onChange={(e) => setdescbio(e.target.value)} required className='text-lg font-semibold my-3 resize-none min-h-32' placeholder="Tell us a little bit about yourself" id="message-2" />

                </div>
                <Button type='submit' variant="secondary" className="w-full cursor-pointer font-bold">Save</Button>
              </form>

            </div>


          </AlertDialogHeader>
          {/* <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProfileComplete

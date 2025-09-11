'use client'
import { useWholeApp } from '@/components/AuthContextApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const [skills, setskills] = useState('')
  const [descbio, setdescbio] = useState('')
  const { userId } = useWholeApp()

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
      console.log(cleanedSkills)

    } catch (error) {
      console.log(error.message)
    }


  }

  // const cleanedSkills = skills
  //   .split(',')
  //   .map(skill => skill.trim().charAt(0).toUpperCase() + skill.slice(1))
  //   .filter(skill => skill.length > 0)
  // console.log(cleanedSkills)
  return (
    <div className='w-full flex items-center justify-center '>

      <form onSubmit={handlesubmit} className='text-white m-2 flex flex-col items-center justify-center shadow-zinc-800 shadow-2xl w-full md:max-w-[45%] p-2 rounded-xl'>
        <h1 className='text-2xl font-bold'>Complete Your Profile</h1>
        <p className='text-muted-foreground'>Select your industry to get personalized mock interviews and recommendations.</p>
        <div className='w-full'>
          <Label htmlFor="message-1"><span className='text-xl font-bold m-1 mb-2'>Your Skills</span></Label>
          <Input onChange={(e) => setskills(e.target.value)} required type="text" className='text-6xl font-semibold my-3' placeholder="Your Skills, ex - python,java,c ..." id="message-1" />
        </div>

        <div className=" w-full ">
          <Label htmlFor="message-2" className='text-xl font-bold m-1 mb-2'>Tell us About Yourself</Label>
          <Textarea onChange={(e) => setdescbio(e.target.value)} required className='text-6xl font-semibold my-3 resize-none min-h-32' placeholder="Tell us a little bit about yourself" id="message-2" />

        </div>
        <Button type='submit' variant="secondary" className="w-full cursor-pointer font-bold">Save</Button>
      </form>

    </div>
  )
}

export default page

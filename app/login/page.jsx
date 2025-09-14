'use client'
import { useWholeApp } from '@/components/AuthContextApi'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const page = () => {
    const [logorsign, setlogorsign] = useState('Sign up')
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const router = useRouter()
    
    const { fetchedUserData, setfetchedUserData } = useWholeApp()
    const handleSignup = async (name, email, password) => {
        try {
            const resp = await axios.post('/api/auth/register', {
                name, email, password
            })
            // console.log('register - ',resp)
        
            if (!resp?.data?.success) {
                toast.error(resp?.data?.message)

            }
            if (resp?.data?.success) {
                toast.success(resp?.data?.message)
           
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleLogin = async (email, password) => {
        try {
            const resp = await axios.post('/api/auth/login', {
                email, password
            })
         
            // console.log('login - ',resp?.data)
            if (!resp?.data?.success) {
                toast.error(resp?.data?.message)
             
            }
            if (resp?.data?.success) {
                toast.success(resp?.data?.message)
                router.push('/home')
           
                // setfetchedUserData(resp?.data)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handsubmit = async (e) => {
        e.preventDefault()
        if (logorsign === 'Sign up') {
            await handleSignup(name, email, password)
        } else {
            await handleLogin(email, password)
        }
    }


    return (
        <div>
            <Navbar />
            <div className='w-full flex items-start justify-center mt-8'>

                <div className='mt-16 m-2  w-full border border-zinc-800 shadow-lg shadow-sky-800/30 p-2 rounded-xl max-w-sm text-white'>
                    <h1 className='font-extrabold text-center text-3xl mb-6'>{logorsign} to <span className='text-sky-600 underline'>Mokai</span></h1>
                    <form onSubmit={handsubmit}>
                        <div className='flex flex-col '>
                            {
                                logorsign === 'Sign up' && <input maxLength={50} onChange={(e) => setname(e.target.value)} className=' placeholder:font-bold w-[95%] outline-none  focus-within:border border-zinc-700 border focus-within:border-sky-600 focus-within:shadow-sm shadow-sky-600 text-lg m-2 pl-2 p-1 rounded-sm' type="text" placeholder='Username' />
                            }
                            <input onChange={(e) => setemail(e.target.value)} className=' placeholder:font-bold w-[95%] outline-none  focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600  m-2 text-lg pl-2 p-1 rounded-sm' type="email" required placeholder='Email' />
                            <input onChange={(e) => setpassword(e.target.value)} className=' placeholder:font-bold w-[95%] outline-none  focus-within:border border-zinc-700 border focus-within:shadow-sm shadow-sky-600 focus-within:border-sky-600 m-2 text-lg pl-2 p-1 rounded-sm' type="password" required placeholder='Password' />

                        </div>
                        <div className='w-[95%] flex items-center justify-center m-2'>
                            {
                                logorsign === 'Sign up' ?
                                    <button type='submit' className='hover:bg-sky-600  cursor-pointer select-none bg-sky-600/70 p-2 font-semibold text-xl w-full rounded-sm'>Create Account</button>
                                    :
                                    <button type='submit' className='hover:bg-sky-600  cursor-pointer select-none bg-sky-600/70 p-2 font-semibold text-xl w-full rounded-sm'>Login Account</button>
                            }

                        </div>
                        {
                            logorsign === 'Sign up' ?
                                <p className='text-lg ml-2 m-2'>Already have an Account? <span className='text-sky-400 font-bold hover:underline cursor-pointer select-none' onClick={() => setlogorsign('Login')}>Login</span></p>
                                :
                                <p className='text-lg ml-2 m-2'>Create an Account? <span className='text-sky-400 font-bold hover:underline cursor-pointer select-none' onClick={() => setlogorsign('Sign up')}>Sign up</span></p>
                        }

                    </form>
                </div>
            </div>
        </div>
    )
}

export default page
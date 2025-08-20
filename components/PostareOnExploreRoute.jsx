'use client'
import React, { useState } from 'react'
import { useWholeApp } from './AuthContextApi'
import axios from 'axios'
import { Button } from './ui/button'
import { toast } from 'sonner'

const PostareOnExploreRoute = () => {
    const [text, settext] = useState('')
    const { fetchedUserData ,fetchpostData } = useWholeApp()
    const createPost = async () => {
        try {
            await axios.post('/api/post/postcreation', {
                post: text,
                userId: fetchedUserData?.user?._id
            })
           
            settext('')
            toast.success("Posted Successfully")
        } catch (e) {
            console.log(e.message)
        }
    }
    const maxLength = 280;
    const progress = (text.length / maxLength) * 100;
    const handleinput = (e) => {
        const textarea = e.target
        textarea.style.height = "auto"
        textarea.style.height = textarea.scrollHeight + "px"
        settext(textarea.value)
    }
    return (




        <div className='border-l-[0.5px] w-full border-r-[0.5px]  border-zinc-700' >
            <div className='flex w-full flex-col  items-start justify-around border-b-[0.5px] border-zinc-700' >
                <div className='flex w-full   items-start justify-around p-2' >
                    {/* <img className='w-16 h-16 rounded-full' src={myimg} alt="" /> */}
                    <textarea onChange={handleinput} className='placeholder-zinc-600 bg-transparent resize-none w-full p-2 border-none outline-none  text-white text-lg' style={{ height: 'auto', minHeight: '40px' }} value={text} placeholder='What is happening?!' maxLength={280} />
                </div>
                <div className='h-[0.5px] bg-zinc-800 w-full' ></div>
                {
                    text ? (
                        <div className='flex items-center justify-end w-full mt-2 p-2' >
                            {

                                text.length >= 275 ? (
                                    <div
                                        className='relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-600 transition-all duration-300'
                                        style={{
                                            background: `conic-gradient(
red ${progress}%, 
#374151 ${progress}%
)`
                                        }}
                                    >
                                        <div className='absolute bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center'>
                                            {
                                                text.length >= 275 ? <p className='text-red-600 text-[15px] text-center'>{text.length} </p> :
                                                    text.length >= 270 ? <p className='text-yellow-600'>{text.length} </p> : <p className='text-white'>{text.length} </p>
                                            }
                                        </div>
                                    </div>
                                )
                                    : text.length >= 260 ? (
                                        <div
                                            className='relative flex items-center justify-center w-10 h-10 rounded-full bg-zinc-600 transition-all duration-300'
                                            style={{
                                                background: `conic-gradient(
#C7D13F ${progress}%, 
#374151 ${progress}%
)`
                                            }}
                                        >
                                            <div className='absolute bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center'>
                                                {
                                                    text.length >= 275 ? <p className='text-red-600'>{text.length} </p> :
                                                        text.length >= 260 ? <p className='text-zinc-600 text-[15px] text-center'>{text.length} </p> : <p className='text-white'>{text.length} </p>
                                                }
                                            </div>
                                        </div>
                                    ) :
                                        <div
                                            className='relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-600 transition-all duration-300'
                                            style={{
                                                background: `conic-gradient(
 #0485D5 ${progress}%, 
#374151 ${progress}%
)`
                                            }}
                                        >

                                        </div>

                            }

                            {
                                text &&
                                <Button onClick={createPost} className='rounded-full ml-4 cursor-pointer font-semibold'>Post</Button>

                            }
                        </div>
                    ) : <div className='flex items-center justify-end w-full mt-2 p-2' >

                        <Button className='rounded-full ml-4 font-semibold' disabled>Post</Button>

                    </div>
                }

            </div>



        </div>
    )
}

export default PostareOnExploreRoute

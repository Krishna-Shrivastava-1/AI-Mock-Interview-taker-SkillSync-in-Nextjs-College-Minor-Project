'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const param = useParams()
    const { userid, mocktestid } = param
    const [mockQuestion, setmockQuestion] = useState([])
    const [optrespo, setoptrespo] = useState({})
    const [loading, setloading] = useState(true)
    const fetchMocktestById = async () => {
        try {
            const rep = await axios.get(`/api/mockgenerator/getmockbyid/${decodeURIComponent(mocktestid)}`)
            if (rep?.data?.mock) {

                setmockQuestion(rep?.data?.mock)
                setloading(false)
            }
        } catch (error) {
            console.log(error.message)
            setloading(false)
        }
    }
    useEffect(() => {
        if (decodeURIComponent(mocktestid)) {
            fetchMocktestById();
        }
    }, [decodeURIComponent(mocktestid)]);

    console.log(mockQuestion)

    const handleoptRespo = (quest_id, selectedValue) => {
        setoptrespo(prevRespo => {
            return {
                ...prevRespo,
                [quest_id]: selectedValue
            }
        })
    }
    console.log(optrespo)
    const sentRespotobackend = async () => {
        if (optrespo.length === 10) {
            await axios.put('/api/mockgenerator/usernassub', {
                userresp: optrespo,
                mockTestId: mocktestid
            })

        } else {
            alert("Please answer all questions before submitting.")

        }

    }
    return (
        <div className='text-white'>
            {
                !loading ?
                    mockQuestion?.questions?.map((question, index) => (
                        <div key={index}>
                            <h1 className='text-xl font-bold'>{index + 1}. {question.questionText}</h1>
                            {
                                question?.options?.map((opt, ind) => (
                                    <div className={`hover:bg-zinc-800 cursor-pointer ${Object.values(optrespo).includes(opt) && 'bg-green-500 hover:bg-green-500'}`} key={ind}>
                                        <p onClick={() => handleoptRespo(question._id, opt)}>{opt}</p>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                    :
                    <LoaderCircle className='animate-spin' />
            }
            <Button variant='secondary' onClick={sentRespotobackend} type='submit'> Submit Quiz</Button>
        </div>
    )
}

export default page

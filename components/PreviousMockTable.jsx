'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from './data-table'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'
const PreviousMockTable = ({ data }) => {
    const [loading, setloading] = useState(false)
    useEffect(() => {
        if (data) {
            setloading(true)
        }
    }, [data])

    // console.log(data)
    return (
        <div className='w-full flex items-center justify-center my-8 '>
            <div className='w-[90%]  p-1 border-[0.5px] border-zinc-800 rounded-md'>
                {
                    loading ?
                        <Table className='dark text-white'>
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Difficulty</TableHead>
                                    <TableHead className='text-center'>Score</TableHead>
                                    <TableHead className="text-center">Link</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody >

                                {[...data].reverse()?.map((e) => (
                                    <TableRow key={e._id}>
                                        <TableCell className="font-medium">{e?.score ? <span className='text-green-600 font-semibold text-md'>Completed</span> : <span className='text-orange-600 font-semibold text-md'>Incomplete</span>}</TableCell>
                                        <TableCell>{e?.role || 'none'}</TableCell>
                                        <TableCell>{new Date(e?.attemptedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(e?.attemptedAt).toLocaleTimeString()}</TableCell>
                                        <TableCell>{e?.questions?.[0]?.difficulty === 'hard' ? <span className='text-orange-600 font-semibold'>Hard</span> : e?.questions?.[0]?.difficulty === 'medium' ? <span className='text-yellow-600 font-semibold'>Medium</span> : <span className='text-green-600 font-semibold'>Easy</span>}</TableCell>
                                        <TableCell className="text-center font-semibold">{e?.score || 0}</TableCell>
                                        <TableCell className='text-center'>

                                            <Link href={`/previous-test/${e.user}/${e._id}`}>
                                                <p className='text-sky-500 hover:underline cursor-pointer select-none'>View Test</p>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}





                            </TableBody>
                        </Table>
                        :
                        <div className='w-full flex items-center justify-center'>

                            <div className='w-[90%] border-[0.5px] border-zinc-800 rounded-md p-1'>
                                {
                                    Array(10).fill(null)?.map((_, e) => (
                                        <Skeleton key={e} className="h-6 w-full rounded-sm my-2" />
                                    ))
                                }

                            </div>
                        </div>
                }

            </div>

        </div>
    )
}

export default PreviousMockTable

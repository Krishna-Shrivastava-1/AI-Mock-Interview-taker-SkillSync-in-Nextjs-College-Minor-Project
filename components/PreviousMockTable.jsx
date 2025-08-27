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
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
const PreviousMockTable = ({ data }) => {
    const [loading, setloading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setrowsPerPage] = useState(10)

    useEffect(() => {
        if (data) {
            setloading(true)
        }
    }, [data])

    // console.log(data)
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const reverData = [...data]?.reverse()
    console.log(reverData)
    const currentRows = reverData?.slice(indexOfFirstRow, indexOfLastRow)
    console.log(currentRows)
    const totalPages = Math.ceil(data.length / rowsPerPage)
    console.log(totalPages)
    return (
        <div className='w-full flex items-center justify-center my-8 '>
            <div className='w-[90%]  p-1 border-[0.5px] border-zinc-800 rounded-md'>
                {
                    loading ?
                        <div>
                      
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

                                    {[...currentRows]?.map((e) => (
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
                            <div className="flex items-center justify-end space-x-2 py-4">
                                  <Select onValueChange={(value) => setrowsPerPage(value)} defaultValue="10" className='dark text-white'>
                                <SelectTrigger className="w-[70px] text-white">
                                    <SelectValue placeholder="Rows" />
                                </SelectTrigger>
                                <SelectContent className='dark'>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='cursor-pointer select-none
        '
                                >
                                    <ChevronLeft />
                                </Button>
                                <p className='text-white mx-2 cursor-pointer select-none'>{currentPage}</p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage === totalPages}
                                    className='cursor-pointer select-none
        '
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        </div>
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

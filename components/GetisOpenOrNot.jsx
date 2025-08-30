import React, { useEffect } from 'react'
import { useSidebar } from './ui/sidebar'
import { useWholeApp } from './AuthContextApi'

const GetisOpenOrNot = () => {
    const {open} = useSidebar()
    const {setsideBarOpen} = useWholeApp()
    // console.log(open)
    useEffect(() => {
     setsideBarOpen(open)
    }, [open])
    
  return (
    null
  )
}

export default GetisOpenOrNot

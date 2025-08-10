'use client'

import axios from "axios";

const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext()
export const WholeAppProvider = ({ children }) => {
    const [userId, setuserId] = useState('')
    const [fetchedUserData, setfetchedUserData] = useState([])
    useEffect(() => {
        const userId = async () => {
            try {
                const respo = await axios.get('/api/auth/user')

                setuserId(respo?.data?.user?.id)
            } catch (error) {
                console.log(error.message)

            }
        }
        userId()
    }, [])
    useEffect(() => {
        const fetchUserDatafromId = async () => {
            try {
                const respo = await axios.get(`/api/auth/getuserbyid/${userId}`)

                setfetchedUserData(respo?.data)
            } catch (error) {
                console.log(error.message)

            }
        }
        fetchUserDatafromId()
    }, [userId])
    console.log(fetchedUserData?.user)
    return (
        <AuthContext.Provider value={{ userId, fetchedUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useWholeApp = () => useContext(AuthContext)
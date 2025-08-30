'use client'

import axios from "axios";
import { usePathname } from "next/navigation";

const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext()
export const WholeAppProvider = ({ children }) => {
    const [userId, setuserId] = useState('')
    const [jobDescriptionText, setjobDescriptionText] = useState('')
    const [sideBarOpen, setsideBarOpen] = useState(true)
    const pathname = usePathname()
    // const [token, settoken] = useState(null)
    const [fetchedUserData, setfetchedUserData] = useState([])
    useEffect(() => {
        const userId = async () => {
            try {
                const respo = await axios.get('/api/auth/user')
// settoken(respo?.data?.token)
                setuserId(respo?.data?.user?.id)
            } catch (error) {
                console.log(error.message)

            }
        }
        userId()
    }, [pathname, userId])
    useEffect(() => {
     if ( !userId) return;
        const fetchUserDatafromId = async () => {
            try {
                if (userId) {
                    const respo = await axios.get(`/api/auth/getuserbyid/${userId}`, {
                       withCredentials: true,
                       headers:{
                        Authorization:`UserId ${userId}`
                       }
                    })
                    setfetchedUserData(respo?.data)
                }

            } catch (error) {
                console.log(error.message)

            }
        }
        fetchUserDatafromId()
    }, [userId, pathname])


    const [page, setpage] = useState(1)
    const [postData, setpostData] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const fetchpostData = async () => {
        if (!hasMore) return;

        try {
            const respo = await axios.get(`/api/post/getallpost?page=${page}&limit=10`, {
                       withCredentials: true,
                       headers:{
                        Authorization:`UserId ${userId}`
                       }
                    });
            const newPosts = respo?.data?.posts || [];

            // console.log('psot, -', newPosts);

            if (newPosts.length === 0) {

                setHasMore(false);
            } else {
                setpostData(prevpost => [...prevpost, ...newPosts]);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setHasMore(false);
        }
    };
    const handleLoadMore = () => {
        setpage(prevPage => prevPage + 1);
    };


    useEffect(() => {
        fetchpostData()
    }, [page])

    // console.log(fetchedUserData?.user)
    // console.log(sideBarOpen)
    return (
        <AuthContext.Provider value={{ userId, fetchedUserData, setfetchedUserData, postData, handleLoadMore, fetchpostData, hasMore, setpostData, setjobDescriptionText, jobDescriptionText, sideBarOpen, setsideBarOpen }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useWholeApp = () => useContext(AuthContext)
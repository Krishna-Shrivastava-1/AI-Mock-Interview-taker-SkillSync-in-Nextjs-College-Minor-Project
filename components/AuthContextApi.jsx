'use client'

import axios from "axios";
import { usePathname } from "next/navigation";

const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext()
export const WholeAppProvider = ({ children }) => {
    const [userId, setuserId] = useState('')
    const [jobDescriptionText, setjobDescriptionText] = useState('')
    const [sideBarOpen, setsideBarOpen] = useState(true)
     const [userQuery, setuserQuery] = useState('')
      const [alluserData, setAllUserData] = useState([])
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
        if (!userId) return;
        const fetchUserDatafromId = async () => {
            try {
                if (userId) {
                    const timestamp = Math.floor(Date.now() / 1000) // seconds
                    const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // public part
                    const respo = await axios.get(`/api/auth/getuserbyid/${userId}?ts=${timestamp}`, {
                        withCredentials: true,
                        headers: {
                            Authorization: `UserId ${userId}`,
                            "x-client-key": clientKey,
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
    const [loading, setloading] = useState(false)
    const fetchpostData = async () => {
        if (!hasMore || loading) return;

        try {
            setloading(true);
            const timestamp = Math.floor(Date.now() / 1000) // seconds
            const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // public part
            if (userId) {
                const respo = await axios.get(`/api/post/getallpost?page=${page}&limit=10&ts=${timestamp}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `UserId ${userId}`,
                        "x-client-key": clientKey,
                    }
                });

                const newPosts = respo?.data?.posts || [];

                // console.log('psot, -', newPosts);

                if (newPosts.length === 0) {

                    setHasMore(false);
                } else {
                    setpostData(prevpost => [...prevpost, ...newPosts]);
                }
            }
        } catch (error) {
            // console.error('Failed to fetch posts:', error);
            setHasMore(false);
        } finally {
            setloading(false);
        }
    };
    const handleLoadMore = () => {
        setpage(prevPage => prevPage + 1);
    };


    useEffect(() => {
        if (userId) {

            fetchpostData()
        }
    }, [page, pathname, userId])


     const fetchAllUser = async () => {
            try {
                const timestamp = Math.floor(Date.now() / 1000) // seconds
                const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY // public part
                const repo = await axios.get(`/api/auth/getalluser?ts=${timestamp}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `UserId ${fetchedUserData?.user?._id}`,
                        "x-client-key": clientKey,
                    }
                })
                if (repo?.data?.user) {
                    setAllUserData(repo.data.user)
                }
            } catch (error) {
                console.error(error)
            }
        }
    
        useEffect(() => {
            // setLoading(true); // Set loading to true before fetching data
            fetchAllUser()
        }, [])
        const allUserName = alluserData?.map(e => {
            return {
                 name:e?.name?.trim(),
                 id:e?._id
            }
           
        })
        const queryM=userQuery.trim()
        const nameFilter = allUserName?.filter(e=>e?.name?.toLowerCase().includes(queryM.toLowerCase()))

    // console.log(fetchedUserData?.user)
    // console.log(postData)
    return (
        <AuthContext.Provider value={{ userId, fetchedUserData, setfetchedUserData, postData, handleLoadMore, fetchpostData, hasMore, setpostData, setjobDescriptionText, jobDescriptionText, sideBarOpen, setsideBarOpen, setuserQuery,nameFilter,userQuery }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useWholeApp = () => useContext(AuthContext)
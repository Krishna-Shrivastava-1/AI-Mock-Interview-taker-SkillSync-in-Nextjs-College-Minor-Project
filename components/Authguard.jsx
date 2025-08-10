'use client'

import { useWholeApp } from "./AuthContextApi"

const { default: axios } = require("axios")
const { useRouter, usePathname } = require("next/navigation")
const { useEffect, useState } = require("react")


const AuthGuard = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [token, settoken] = useState(null)
    const { fetchedUserData } = useWholeApp()
    useEffect(() => {
        const fetchAuthorizeToken = async () => {
            try {
                const resp = await axios.get('/api/auth/user')
                settoken(resp?.data?.user)
            } catch (error) {
                console.error('Token fetch error:', error)
                settoken(null)
            }
        }
        fetchAuthorizeToken()
    }, [pathname])

    // useEffect(() => {
    //     if (token === null) return;

    //     const isPublicPage = pathname === '/login' || pathname.startsWith('/community')

    //     if (!token?.id && !isPublicPage) {
    //         router.push('/');
    //         return;
    //     }

    //     if (token?.id && pathname === '/login' && fetchedUserData?.user?.isFilledaboutandskill) {
    //         router.push('/home');
    //     } else {
    //         if (token?.id && pathname === '/home' && !fetchedUserData?.user?.isFilledaboutandskill) {
    //             router.push('/about-detail');
    //         }
    //         else if (token?.id && pathname === '/login' && !fetchedUserData?.user?.isFilledaboutandskill) {
    //             router.push('/about-detail');
    //         }
    //         else if (token?.id && pathname === '/about-detail' && fetchedUserData?.user?.isFilledaboutandskill) {
    //             window.location.href = "/home"
    //         }
    //         else {
    //             if (token?.id && pathname === '/about-detail' && !fetchedUserData?.user?.isFilledaboutandskill) {
    //                 router.push('/about-detail');
    //             }
    //         }
    //     }



    // }, [token, pathname, router])
    useEffect(() => {
  if (token === null || fetchedUserData === null) return;

  const isPublicPage = pathname === '/login' || pathname.startsWith('/community');
  const isLoggedIn = !!token?.id;
  const isProfileFilled = fetchedUserData?.user?.isFilledaboutandskill;

  if (!isLoggedIn && !isPublicPage) {
    router.push('/');
    return;
  }

  // If logged in and trying to go to login page
  if (isLoggedIn && pathname === '/login') {
    if (isProfileFilled) {
      router.push('/home');
    } else {
      router.push('/about-detail');
    }
    return;
  }

  // If logged in and trying to access home but profile not filled
  if (isLoggedIn && pathname === '/home' && !isProfileFilled) {
    router.push('/login');
    return;
  }

  // If logged in and trying to access about-detail but profile is already filled
  if (isLoggedIn && pathname === '/about-detail' && isProfileFilled) {
    router.push('/home');
    return;
  }

}, [token, pathname, router, fetchedUserData]);

    console.log(token)
    console.log(fetchedUserData?.user)
    return null

}
export default AuthGuard
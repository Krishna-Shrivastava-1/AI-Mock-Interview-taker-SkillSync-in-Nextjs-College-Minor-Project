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
useEffect(() => {
  // 1. Still loading → do nothing
  if (token === null || fetchedUserData === null) return;

  const isPublicPage = pathname === '/login' ||pathname === '/' || pathname.startsWith('/community');
  const isLoggedIn = !!token?.id; // true if token exists

  // 2. If NOT logged in
  if (!isLoggedIn) {
    if (!isPublicPage) {
      router.push('/login'); // always go to login first
    }
    return;
  }

  // 3. If logged in but tries to visit login page → send to home
  if (isLoggedIn && pathname === '/login') {
    router.push('/home');
  }
}, [token, fetchedUserData, pathname, router]);

  // useEffect(() => {
  //   if (token === null || fetchedUserData === null) return;

  //   const isPublicPage = pathname === '/login' || pathname.startsWith('/community');
  //   const isLoggedIn = !!token?.id;
  //   if (!isLoggedIn && pathname === '/home') {
  //     router.push('/login');
  //   }

  //   if (!isLoggedIn && !isPublicPage) {
  //     router.push('/');
  //     return;
  //   }

  //   // If logged in and trying to go to login page
  //   if (isLoggedIn && pathname === '/login') {
  //     if (isLoggedIn) {
  //       router.push('/home');
  //     }
  //     return;
  //   }





  // }, [token, pathname, router, fetchedUserData, fetchedUserData?.user?._id]);

  // console.log(token)
  // console.log(fetchedUserData?.user)
  return null

}
export default AuthGuard
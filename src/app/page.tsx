'use client'

import { Center, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { restoreSession, selectAuth } from '../redux/auth/authSlice'
import type { AppDispatch } from '../redux/store'

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, isAuthenticated } = useSelector(selectAuth)
  const router = useRouter()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    if (!loading) {
      router.replace(isAuthenticated ? '/dashboard' : '/login')
    }
  }, [loading, isAuthenticated, router])

  return (
    <Center minH="100vh">
      <Spinner size="xl" />
    </Center>
  )
}


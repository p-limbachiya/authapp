'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'
import { clearError, selectAuth } from '../redux/auth/authSlice'
import type { AppDispatch } from '../redux/store'

export const AuthToaster = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { error } = useSelector(selectAuth)
  const toast = useToast()

  useEffect(() => {
    if (!error) return
    toast({
      title: 'Authentication error',
      description: error,
      status: 'error',
      isClosable: true,
      duration: 5000,
    })
    dispatch(clearError())
  }, [error, dispatch, toast])

  return null
}


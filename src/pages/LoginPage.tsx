import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, selectAuth } from '../redux/auth/authSlice'
import type { AppDispatch } from '../redux/store'

interface LoginFormValues {
  email: string
  password: string
}

export const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector(selectAuth)
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const onSubmit = (values: LoginFormValues) => {
    dispatch(login(values))
      .unwrap()
      .then(() => {
        toast({
          title: 'Logged in successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        const from = searchParams.get('from') ?? '/dashboard'
        router.replace(from)
      })
      .catch(() => {
        // error toasts are handled globally via auth error state
      })
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Card w="full" maxW="md" mx="4">
        <CardBody>
          <Stack spacing="6">
            <Box textAlign="center">
              <Heading size="lg" mb="1">
                Welcome back
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Sign in to your account
              </Text>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing="4">
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                  />
                  <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                </FormControl>

                <Button type="submit" colorScheme="blue" isLoading={loading} isDisabled={loading}>
                  Login
                </Button>

                <Box fontSize="xs" color="gray.500">
                  <Text>Demo users:</Text>
                  <Text>admin@example.com / password</Text>
                  <Text>manager@example.com / password</Text>
                  <Text>user@example.com / password</Text>
                </Box>
              </Stack>
            </form>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  )
}


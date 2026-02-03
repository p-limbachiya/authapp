import { ReactNode } from 'react'
import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  Avatar,
  VStack,
  HStack,
  Button,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectAuth } from '../redux/auth/authSlice'
import type { AppDispatch } from '../redux/store'

interface AppLayoutProps {
  children: ReactNode
}

const navItems: { label: string; to: string; roles: string[] }[] = [
  { label: 'Dashboard', to: '/dashboard', roles: ['admin', 'manager', 'user'] as const },
  { label: 'Reports', to: '/reports', roles: ['admin', 'manager'] as const },
  { label: 'Admin', to: '/admin', roles: ['admin'] as const },
]

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const sidebarBg = useColorModeValue('white', 'gray.800')
  const { user, role } = useSelector(selectAuth)
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Flex minH="100vh" bg={bg}>
      <Box
        as="aside"
        w={{ base: '64', md: '72' }}
        bg={sidebarBg}
        borderRightWidth="1px"
        p="4"
        display="flex"
        flexDirection="column"
      >
        <HStack justify="space-between" mb="8">
          <Text fontSize="xl" fontWeight="bold">
            Auth App
          </Text>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            size="sm"
            onClick={toggleColorMode}
          />
        </HStack>

        <VStack align="stretch" spacing="2" mb="8">
          {navItems
            .filter((item) => (role ? item.roles.includes(role) : false))
            .map((item) => {
              const isActive = location.pathname === item.to
              return (
                <ChakraLink
                  key={item.to}
                  as={Link}
                  to={item.to}
                  px="3"
                  py="2"
                  borderRadius="md"
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  bg={isActive ? 'blue.500' : 'transparent'}
                  color={isActive ? 'white' : undefined}
                  _hover={{ textDecoration: 'none', bg: isActive ? 'blue.600' : 'gray.100' }}
                >
                  {item.label}
                </ChakraLink>
              )
            })}
        </VStack>

        <Box mt="auto">
          <HStack spacing="3" mb="3">
            <Avatar size="sm" name={user?.name} />
            <Box>
              <Text fontWeight="medium">{user?.name}</Text>
              <Text fontSize="xs" color="gray.500">
                {user?.email}
              </Text>
            </Box>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">
              Role: {role}
            </Text>
            <Button size="xs" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Box>
      </Box>

      <Box as="main" flex="1" p={{ base: 4, md: 8 }}>
        {children}
      </Box>
    </Flex>
  )
}


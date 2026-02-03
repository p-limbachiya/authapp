import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <Box textAlign="center" py="20">
      <Heading mb="4">404 - Page not found</Heading>
      <Text mb="6" color="gray.500">
        The page you are looking for does not exist.
      </Text>
      <Button as={Link} to="/dashboard" colorScheme="blue">
        Go to dashboard
      </Button>
    </Box>
  )
}


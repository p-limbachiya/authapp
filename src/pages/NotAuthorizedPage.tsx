import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const NotAuthorizedPage = () => {
  return (
    <Box textAlign="center" py="20">
      <Heading mb="4">Not Authorized</Heading>
      <Text mb="6" color="gray.500">
        You do not have permission to access this page.
      </Text>
      <Button as={Link} to="/dashboard" colorScheme="blue">
        Go to dashboard
      </Button>
    </Box>
  )
}


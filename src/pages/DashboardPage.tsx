import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'

export const DashboardPage = () => {
  return (
    <Box>
      <Heading mb="4">Dashboard</Heading>
      <Text mb="8" color="gray.500">
        This is the main dashboard. All authenticated users can access this page.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6">
        <Stat p="4" borderWidth="1px" borderRadius="md">
          <StatLabel>Active Sessions</StatLabel>
          <StatNumber>3</StatNumber>
        </Stat>
        <Stat p="4" borderWidth="1px" borderRadius="md">
          <StatLabel>Reports Generated</StatLabel>
          <StatNumber>42</StatNumber>
        </Stat>
        <Stat p="4" borderWidth="1px" borderRadius="md">
          <StatLabel>System Status</StatLabel>
          <StatNumber color="green.400">Healthy</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}


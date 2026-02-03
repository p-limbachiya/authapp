import { Box, Heading, Text, Table, Thead, Tr, Th, Tbody, Td, Tag, Stack } from '@chakra-ui/react'

export const AdminPage = () => {
  return (
    <Box>
      <Heading mb="4">Admin Panel</Heading>
      <Text mb="6" color="gray.500">
        Only admins can access this page. Use it to review users and permissions.
      </Text>

      <Stack spacing="4">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th isNumeric>User ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Alice Admin</Td>
              <Td>admin@example.com</Td>
              <Td>
                <Tag colorScheme="red">admin</Tag>
              </Td>
              <Td isNumeric>1</Td>
            </Tr>
            <Tr>
              <Td>Mark Manager</Td>
              <Td>manager@example.com</Td>
              <Td>
                <Tag colorScheme="purple">manager</Tag>
              </Td>
              <Td isNumeric>2</Td>
            </Tr>
            <Tr>
              <Td>Ulysses User</Td>
              <Td>user@example.com</Td>
              <Td>
                <Tag colorScheme="blue">user</Tag>
              </Td>
              <Td isNumeric>3</Td>
            </Tr>
          </Tbody>
        </Table>
      </Stack>
    </Box>
  )
}


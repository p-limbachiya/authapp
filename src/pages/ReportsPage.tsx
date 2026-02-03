import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Skeleton,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export const ReportsPage = () => {
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box>
      <Heading mb="4">Reports</Heading>
      <Text mb="6" color="gray.500">
        Managers and admins can view system reports here.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
        {[1, 2, 3, 4].map((id) => (
          <Skeleton key={id} isLoaded={!loading} borderRadius="md">
            <Box
              borderWidth="1px"
              borderRadius="md"
              p="4"
              cursor="pointer"
              _hover={{ shadow: 'md' }}
              onClick={onOpen}
            >
              <Heading size="sm" mb="2">
                Report #{id}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Summary of system activity and performance metrics for report #{id}.
              </Text>
            </Box>
          </Skeleton>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="6">
            <Text mb="4">
              This modal simulates a detailed report viewer. In a real application, you would render
              charts, tables, and export options here.
            </Text>
            <Button onClick={onClose}>Close</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}


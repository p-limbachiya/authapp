import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tag,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../redux/auth/authSlice'
import type { UserRole } from '../api/authApi'
import { createUser, deleteUser, listUsers, updateUser } from '../api/usersApi'

export const AdminPage = () => {
  const { token } = useSelector(selectAuth)
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: UserRole }[]>([])
  const [saving, setSaving] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<{ name: string; email: string; role: UserRole; password: string }>({
    name: '',
    email: '',
    role: 'user',
    password: '',
  })

  const editingUser = useMemo(() => users.find((u) => u.id === editingId) ?? null, [users, editingId])

  const refresh = async () => {
    if (!token) return
    setLoading(true)
    try {
      const list = await listUsers(token)
      setUsers(list)
    } catch (e: any) {
      toast({ title: 'Failed to load users', description: e?.message ?? String(e), status: 'error', isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const openCreate = () => {
    setMode('create')
    setEditingId(null)
    setForm({ name: '', email: '', role: 'user', password: '' })
    onOpen()
  }

  const openEdit = (id: string) => {
    const u = users.find((x) => x.id === id)
    if (!u) return
    setMode('edit')
    setEditingId(id)
    setForm({ name: u.name, email: u.email, role: u.role, password: '' })
    onOpen()
  }

  const submit = async () => {
    if (!token) return
    setSaving(true)
    try {
      if (mode === 'create') {
        if (!form.password) throw new Error('Password is required')
        await createUser(token, form)
        toast({ title: 'User created', status: 'success', duration: 2500, isClosable: true })
      } else {
        if (!editingId) return
        await updateUser(token, editingId, {
          name: form.name,
          email: form.email,
          role: form.role,
          password: form.password ? form.password : undefined,
        })
        toast({ title: 'User updated', status: 'success', duration: 2500, isClosable: true })
      }
      onClose()
      await refresh()
    } catch (e: any) {
      toast({ title: 'Save failed', description: e?.message ?? String(e), status: 'error', isClosable: true })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!token) return
    setSaving(true)
    try {
      await deleteUser(token, id)
      toast({ title: 'User deleted', status: 'success', duration: 2000, isClosable: true })
      await refresh()
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e?.message ?? String(e), status: 'error', isClosable: true })
    } finally {
      setSaving(false)
    }
  }

  const roleColor = (role: UserRole) => {
    if (role === 'admin') return 'red'
    if (role === 'manager') return 'purple'
    return 'blue'
  }

  return (
    <Box>
      <Heading mb="4">Admin Panel</Heading>
      <Text mb="6" color="gray.500">
        Only admins can access this page. You can create, update, and delete users here.
      </Text>

      <Stack spacing="4">
        <HStack justify="space-between">
          <Button colorScheme="blue" onClick={openCreate} isDisabled={!token || loading}>
            Add user
          </Button>
          <Button variant="outline" onClick={refresh} isDisabled={!token || loading}>
            Refresh
          </Button>
        </HStack>

        {loading ? (
          <HStack>
            <Spinner />
            <Text color="gray.500">Loading users…</Text>
          </HStack>
        ) : null}

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u.id}>
                <Td>{u.name}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <Tag colorScheme={roleColor(u.role)}>{u.role}</Tag>
                </Td>
                <Td>
                  <HStack>
                    <Button size="sm" variant="outline" onClick={() => openEdit(u.id)}>
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => remove(u.id)} isDisabled={saving}>
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{mode === 'create' ? 'Create user' : 'Edit user'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                >
                  <option value="user">user</option>
                  <option value="manager">manager</option>
                  <option value="admin">admin</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Password {mode === 'edit' ? <Text as="span" color="gray.500">(leave blank to keep)</Text> : null}
                </FormLabel>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </FormControl>
              {mode === 'edit' && editingUser ? (
                <Text fontSize="xs" color="gray.500">
                  Editing user id: {editingUser.id}
                </Text>
              ) : null}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={submit} isLoading={saving}>
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}


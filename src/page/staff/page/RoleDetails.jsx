import {
  Typography,
  Box,
  Divider,
  Button,
  Grow,
  Alert,
  TextField
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import BreadcrumbGenerator from '../../../components/generator/BreadcumbGenerator'

import {
  getPermissions,
  getRoleMembers,
  getRolePermissions,
  updateRole
} from '../logic/Permissions'

const PermissionTableColumns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 250,
    disableColumnMenu: true,
    sortable: false
  }
]

const MemberTableColumns = [
  {
    field: 'identifier',
    headerName: 'ID',
    width: 200,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'first_name',
    headerName: 'First Name',
    width: 250,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'last_name',
    headerName: 'Last Name',
    width: 250,
    disableColumnMenu: true,
    sortable: false
  }
]

const RoleDetails = () => {
  const { identifier } = useParams()

  const [message, setMessage] = useState()
  const [role, setRole] = useState()

  const [permissionList, setPermissionList] = useState([])
  const [permissionSelection, setPermissionSelection] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    setMessage({
      text: 'Loading role details...',
      severity: 'info',
      loading: true
    })

    async function fetchData() {
      try {
        const result = await getRoleMembers(identifier)

        setRole(current => ({
          ...current,
          members: result.map(member => ({
            ...member,
            id: member.staff_id,
            identifier: member.staff_id
          }))
        }))
      } catch (error) {
        setMessage({
          text: 'Failed to load role members...',
          severity: 'error',
          loading: true
        })
        return
      }

      try {
        const result = await getRolePermissions(identifier)

        setPermissionList(
          (await getPermissions()).map(permission => ({
            ...permission,
            id: permission.name
          }))
        )

        setRole(current => ({
          ...current,
          description: result.description,
          permissions: result.permissions
        }))

        setPermissionSelection(
          result.permissions.map(permission => permission.name)
        )
      } catch (error) {
        setMessage({
          text: 'Failed to load permissions...',
          severity: 'error',
          loading: true
        })
        return
      }

      setMessage(undefined)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (message && !message.loading) {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [message])

  async function handleSubmit() {
    setMessage({ text: 'Applying changes...', severity: 'info' })

    updateRole(identifier, role.description, permissionSelection)
      .then(() => {
        setMessage({ text: 'Role sucessfully updated', severity: 'success' })
      })
      .catch(() => {
        setMessage({
          text: 'Failed to update role - Please try again later.',
          severity: 'error'
        })

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">System Role - {identifier}</Typography>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={role ? 'outlined' : 'disabled'}
          onClick={() => handleSubmit()}
        >
          Save
        </Button>
        <Button onClick={() => navigate(-1)}>Return</Button>
      </Box>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      {message && (
        <Grow in={true}>
          <Alert severity={message.severity} sx={{ marginBottom: '1rem' }}>
            {message.text}
          </Alert>
        </Grow>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <Typography variant="h6">Description</Typography>
        <TextField
          value={role ? role.description : ""}
          onChange={event => {
            setRole({ ...role, description: event.target.value })
          }}
        />
      </Box>

      <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />

      <Box
        sx={{
          height: '40vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <Typography variant="h6">Permissions</Typography>
        <DataGrid
          rows={permissionList}
          columns={PermissionTableColumns}
          rowSelectionModel={permissionSelection}
          onRowSelectionModelChange={model => setPermissionSelection(model)}
          checkboxSelection
          autoPageSize
        />
      </Box>

      <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />

      <Box
        sx={{
          height: '40vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <Typography variant="h6">Members</Typography>
        <DataGrid
          rows={role && role.members ? role.members : []}
          columns={MemberTableColumns}
          autoPageSize
        />
      </Box>
    </Box>
  )
}

export default RoleDetails

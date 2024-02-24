import {
  Typography,
  Box,
  Divider,
  Button,
  Grow,
  Alert,
  TextField,
  Stack
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../../components/generator/BreadcumbGenerator'
import ProfileImage from '../component/ProfileImage'

import {
  searchPermissions,
  searchRoles,
  grantPermissions,
  grantRoles
} from '../logic/Permissions'
import { createUser } from '../logic/Personel'

const RoleTableColumns = [
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

const StaffCreationForm = () => {
  const [message, setMessage] = useState()
  const [errors, setErrors] = useState({})

  const [roleList, setRoleList] = useState([])
  const [roleSelection, setRoleSelection] = useState([])

  const [permissionList, setPermissionList] = useState([])
  const [permissionSelection, setPermissionSelection] = useState([])

  const [form, setForm] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    setMessage({
      text: 'Loading permissions and roles...',
      severity: 'info',
      loading: true
    })

    async function fetchData() {
      try {
        setPermissionList(
          (await searchPermissions()).map(permission => ({
            ...permission,
            id: permission.name
          }))
        )
      } catch (error) {
        setMessage({
          text: 'Failed to load permissions...',
          severity: 'error',
          loading: true
        })
        return
      }

      try {
        setRoleList(
          (await searchRoles()).map(role => ({
            ...role,
            id: role.name
          }))
        )
      } catch (error) {
        setMessage({
          text: 'Failed to load roles...',
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
    handleValidation()
  }, [form])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    if (form.phone_number && form.phone_number.match('[^0-9]')) {
      setMessage({
        severity: 'error',
        text: 'Phone Number can only contain numbers'
      })
      errors.phone_number = true
    } else if (form.phone_number && form.phone_number.length !== 11) {
      setMessage({
        severity: 'error',
        text: 'Phone Number must be 11 digits'
      })
      errors.phone_number = true
    } else if (!(form.phone_number && form.phone_number.trim())) {
      setMessage({
        severity: 'error',
        text: "'Phone Number' is a required field - Please enter a valid phone number"
      })
      errors.phone_number = true
    }

    if (!(form.email_address && form.email_address.match(/^\S+@\S+\.\S+$/))) {
      setMessage({
        severity: 'error',
        text: 'A valid Email Address is required - Please enter a valid email address'
      })
      errors.email_address = true
    } else if (!(form.email_address && form.email_address.trim())) {
      setMessage({
        severity: 'error',
        text: 'A valid Email Address is required - Please enter an email address'
      })
      errors.email_address = true
    }

    if (form.last_name && form.last_name.length > 20) {
      setMessage({
        severity: 'error',
        text: 'Last Name cannot exceed 20 characters'
      })
      errors.last_name = true
    } else if (!(form.last_name && form.last_name.trim())) {
      setMessage({
        severity: 'error',
        text: "'Last Name' is a required field - Please enter a last name"
      })
      errors.last_name = true
    }

    if (form.first_name && form.first_name.length > 20) {
      setMessage({
        severity: 'error',
        text: 'First Name cannot exceed 20 characters'
      })
      errors.first_name = true
    } else if (!(form.first_name && form.first_name.trim())) {
      setMessage({
        severity: 'error',
        text: "'First Name' is a required field - Please enter a first name"
      })
      errors.first_name = true
    }

    if (form.identifier && form.identifier.length > 50) {
      setMessage({
        severity: 'error',
        text: 'User UUID cannot exceed 50 characters'
      })
      errors.identifier = true
    } else if (!(form.identifier && form.identifier.trim())) {
      setMessage({
        severity: 'error',
        text: 'A Cognito UUID is required - Please enter a valid UUID'
      })
      errors.identifier = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    setMessage({ text: 'Creating user...', severity: 'info' })

    try {
      await createUser(form.identifier, form)
    } catch {
      setMessage({
        text: 'Failed to create user - Please try again later',
        severity: 'error'
      })

      setTimeout(() => setMessage(undefined), 7000)
      return
    }

    try {
      await grantRoles(form.identifier, roleSelection)
    } catch {
      setMessage({
        text: 'Failed to assign roles',
        severity: 'error'
      })

      return
    }

    try {
      await grantPermissions(form.identifier, permissionSelection)
    } catch {
      setMessage({
        text: 'Failed to grant permissions',
        severity: 'error'
      })

      return
    }

    setMessage({ text: 'User sucessfully created', severity: 'success' })
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Typography variant="h4">Create a new User</Typography>

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="contained"
            disabled={Boolean(message)}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
          <Divider orientation="vertical" />
          <Button onClick={() => navigate(-1)}>Return</Button>
        </Box>
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
        <Typography variant="h6">Cognito UUID</Typography>{' '}
        <Typography variant="caption">
          The code provided to unauthenticated users
        </Typography>
        <TextField
          onChange={event => {
            setForm({ ...form, identifier: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, identifier: event.target.value })
          }}
          error={errors.identifier}
        />
      </Box>

      <Divider sx={{ marginTop: '2rem', marginBottom: '1rem' }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <Typography variant="h6">User Details</Typography>{' '}
        <Box sx={{ display: 'flex', gap: '2rem' }}>
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="First Name"
              onChange={event => {
                setForm({ ...form, first_name: event.target.value })
              }}
              onBlur={event => {
                setForm({ ...form, first_name: event.target.value })
              }}
              error={errors.first_name}
            />
            <TextField
              label="Last Name"
              onChange={event => {
                setForm({ ...form, last_name: event.target.value })
              }}
              onBlur={event => {
                setForm({ ...form, last_name: event.target.value })
              }}
              error={errors.last_name}
            />
            <TextField
              label="Email Address"
              onChange={event => {
                setForm({ ...form, email_address: event.target.value })
              }}
              onBlur={event => {
                setForm({ ...form, email_address: event.target.value })
              }}
              error={errors.email_address}
            />
            <TextField
              label="Phone Number"
              onChange={event => {
                setForm({ ...form, phone_number: event.target.value })
              }}
              onBlur={event => {
                setForm({ ...form, phone_number: event.target.value })
              }}
              error={errors.phone_number}
            />
          </Stack>
          <ProfileImage
            image={form.image}
            onChange={image => setForm({ ...form, image: image })}
          />
        </Box>
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
        <Typography variant="h6">Roles</Typography>
        <DataGrid
          rows={roleList}
          columns={RoleTableColumns}
          rowSelectionModel={roleSelection}
          onRowSelectionModelChange={model => setRoleSelection(model)}
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
        <Typography variant="h6">Permissions</Typography>
        <Typography variant="caption">
          Some permissions may be granted by an existing role
        </Typography>
        <DataGrid
          rows={permissionList}
          columns={PermissionTableColumns}
          rowSelectionModel={permissionSelection}
          onRowSelectionModelChange={model => setPermissionSelection(model)}
          checkboxSelection
          autoPageSize
        />
      </Box>
    </Box>
  )
}

export default StaffCreationForm

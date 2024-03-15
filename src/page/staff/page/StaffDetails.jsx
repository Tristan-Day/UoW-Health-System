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
import { useNavigate, useParams } from 'react-router-dom'

import BreadcrumbGenerator from '../../../components/generator/BreadcumbGenerator'
import ProfileImage from '../component/ProfileImage'

import {
  searchPermissions,
  searchRoles,
  grantPermissions,
  grantRoles,
  getRoles,
  getPermissions
} from '../logic/Permissions'
import { getUser, updateUser } from '../logic/Personel'

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

const StaffDetails = () => {
  const { identifier } = useParams()

  const [message, setMessage] = useState()
  const [user, setUser] = useState()

  const [errors, setErrors] = useState({})

  const [roleList, setRoleList] = useState([])
  const [roleSelection, setRoleSelection] = useState([])

  const [permissionList, setPermissionList] = useState([])
  const [permissionSelection, setPermissionSelection] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    setMessage({
      text: 'Loading user details...',
      severity: 'info',
      loading: true
    })

    async function fetchData() {
      try {
        var user = await getUser(identifier)

        // Convert the image from a byte array
        if (user.image) {
          user['image'] = String.fromCharCode.apply(null, user.image.data)
        }

        setUser(user)
      } catch {
        setMessage({
          text: 'Failed to load user details...',
          severity: 'error',
          loading: true
        })
        return
      }

      try {
        const result = await getRoles(identifier)

        setRoleList(
          (await searchRoles()).map(role => ({
            ...role,
            id: role.name
          }))
        )

        setRoleSelection(result.map(role => role.name))
      } catch (error) {
        setMessage({
          text: 'Failed to load roles...',
          severity: 'error',
          loading: true
        })

        return
      }

      try {
        const result = await getPermissions(identifier)

        setPermissionList(
          (await searchPermissions()).map(permission => ({
            ...permission,
            id: permission.name
          }))
        )

        setPermissionSelection(result.map(permission => permission.name))
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
    handleValidation()
  }, [user])

  async function handleValidation() {
    setMessage(undefined)

    if (!user) {
      return true
    }

    const errors = {}

    if (user.phone_number && user.phone_number.match('[^0-9]')) {
      setMessage({
        severity: 'error',
        text: 'Phone Number can only contain numbers'
      })
      errors.phone_number = true
    } else if (user.phone_number && user.phone_number.length !== 11) {
      setMessage({
        severity: 'error',
        text: 'Phone Number must be 11 digits'
      })
      errors.phone_number = true
    } else if (!(user.phone_number && user.phone_number.trim())) {
      setMessage({
        severity: 'error',
        text: "'Phone Number' is a required field - Please enter a valid phone number"
      })
      errors.phone_number = true
    }

    if (!(user.email_address && user.email_address.match(/^\S+@\S+\.\S+$/))) {
      setMessage({
        severity: 'error',
        text: 'A valid Email Address is required - Please enter a valid email address'
      })
      errors.email_address = true
    } else if (!(user.email_address && user.email_address.trim())) {
      setMessage({
        severity: 'error',
        text: 'A valid Email Address is required - Please enter an email address'
      })
      errors.email_address = true
    }

    if (user.last_name && user.last_name.length > 20) {
      setMessage({
        severity: 'error',
        text: 'Last Name cannot exceed 20 characters'
      })
      errors.last_name = true
    } else if (!(user.last_name && user.last_name.trim())) {
      setMessage({
        severity: 'error',
        text: "'Last Name' is a required field - Please enter a last name"
      })
      errors.last_name = true
    }

    if (user.first_name && user.first_name.length > 20) {
      setMessage({
        severity: 'error',
        text: 'First Name cannot exceed 20 characters'
      })
      errors.first_name = true
    } else if (!(user.first_name && user.first_name.trim())) {
      setMessage({
        severity: 'error',
        text: "'First Name' is a required field - Please enter a first name"
      })
      errors.first_name = true
    }

    setErrors(errors)

    // False indicates that the user was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    setMessage({ text: 'Saving...', severity: 'info' })

    try {
      await updateUser(identifier, user)
    } catch {
      setMessage({
        text: 'Failed to update user - Please try again later',
        severity: 'error'
      })

      setTimeout(() => setMessage(undefined), 7000)
      return
    }

    try {
      await grantRoles(identifier, roleSelection)
    } catch {
      setMessage({
        text: 'Failed to update role assignment',
        severity: 'error'
      })

      return
    }

    try {
      await grantPermissions(identifier, permissionSelection)
    } catch {
      setMessage({
        text: 'Failed to update permissions',
        severity: 'error'
      })

      return
    }

    setMessage({ text: 'User sucessfully updated', severity: 'success' })
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        {user && user.first_name.length + user.last_name.length <= 20 ? (
          <Typography variant="h4">
            Staff Member - {user.first_name} {user.last_name}
          </Typography>
        ) : (
          <Typography variant="h4">Staff Member</Typography>
        )}

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="contained"
            disabled={Boolean(message)}
            onClick={() => handleSubmit()}
          >
            Save
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
        <Typography variant="h6">User Details</Typography>{' '}
        <Box sx={{ display: 'flex', gap: '2rem' }}>
          <Stack spacing={2} flexGrow={1}>
            <TextField
              label="First Name"
              value={user ? user.first_name : ''}
              onChange={event => {
                setUser({ ...user, first_name: event.target.value })
              }}
              onBlur={event => {
                setUser({ ...user, first_name: event.target.value })
              }}
              error={errors.first_name}
            />
            <TextField
              label="Last Name"
              value={user ? user.last_name : ''}
              onChange={event => {
                setUser({ ...user, last_name: event.target.value })
              }}
              onBlur={event => {
                setUser({ ...user, last_name: event.target.value })
              }}
              error={errors.last_name}
            />
            <TextField
              label="Email Address"
              value={user ? user.email_address : ''}
              onChange={event => {
                setUser({ ...user, email_address: event.target.value })
              }}
              onBlur={event => {
                setUser({ ...user, email_address: event.target.value })
              }}
              error={errors.email_address}
            />
            <TextField
              label="Phone Number"
              value={user ? user.phone_number : ''}
              onChange={event => {
                setUser({ ...user, phone_number: event.target.value })
              }}
              onBlur={event => {
                setUser({ ...user, phone_number: event.target.value })
              }}
              error={errors.phone_number}
            />
          </Stack>
          <ProfileImage
            image={user && user.image ? user.image : undefined}
            onChange={image => setUser({ ...user, image: image })}
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

export default StaffDetails

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
import { createRole, searchPermissions } from '../logic/Permissions'

const Columns = [
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

const RoleCreationForm = () => {
  const [message, setMessage] = useState()
  const [errors, setErrors] = useState({})

  const [permissionList, setPermissionList] = useState([])
  const [permissionSelection, setPermissionSelection] = useState([])

  const [form, setForm] = useState({})

  const navigate = useNavigate()

  useEffect(() => {
    setMessage({
      text: 'Loading permission list...',
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

    if (!(form.name && form.name.trim())) {
      setMessage({
        severity: 'error',
        text: 'A role name is required - Please enter a role name'
      })
      errors.name = true
    }

    if (form.name && form.name.length > 20) {
      setMessage({
        severity: 'error',
        text: 'Role name cannot exceed 20 characters'
      })
      errors.name = true
    }

    if (form.description && form.description.length > 100) {
      setMessage({
        severity: 'error',
        text: 'Description cannot exceed 100 characters'
      })
      errors.description = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    setMessage({ text: 'Creating role...', severity: 'info' })

    createRole(form.name, form.description, permissionSelection)
      .then(() => {
        setMessage({ text: 'Role sucessfully created', severity: 'success' })
      })
      .catch(() => {
        setMessage({
          text: 'Failed to create role - Please try again later',
          severity: 'error'
        })

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Typography variant="h4">Create a Role</Typography>

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

      <Stack spacing={2}>
        <TextField
          label="Name"
          onChange={event => {
            setForm({ ...form, name: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, name: event.target.value })
          }}
          error={errors.name}
        />
        <TextField
          label="Description"
          onChange={event => {
            setForm({ ...form, description: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, description: event.target.value })
          }}
          error={errors.description}
        />
      </Stack>

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
          Select the permissions this role requires
        </Typography>
        <DataGrid
          rows={permissionList}
          columns={Columns}
          rowSelectionModel={permissionSelection}
          onRowSelectionModelChange={model => setPermissionSelection(model)}
          checkboxSelection
          autoPageSize
        />
      </Box>
    </Box>
  )
}

export default RoleCreationForm

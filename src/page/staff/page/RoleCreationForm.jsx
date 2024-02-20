import {
  Typography,
  Box,
  Divider,
  Button,
  Grow,
  Fab,
  Alert,
  TextField,
  Stack
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../../components/generator/BreadcumbGenerator'
import { createRole, getPermissions } from '../logic/Permissions'

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

  const [form, setForm] = useState({
    name: '',
    description: ''
  })

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
          (await getPermissions()).map(permission => ({
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Create a Role</Typography>
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
        <DataGrid
          rows={permissionList}
          columns={Columns}
          rowSelectionModel={permissionSelection}
          onRowSelectionModelChange={model => setPermissionSelection(model)}
          checkboxSelection
          autoPageSize
        />
      </Box>

      <Box sx={{ position: 'fixed', bottom: '4.5rem', right: '4.5rem' }}>
        <Fab
          color="primary"
          sx={{ position: 'absolute' }}
          disabled={Boolean(message)}
          onClick={() => handleSubmit()}
        >
          <SaveIcon />
        </Fab>
      </Box>
    </Box>
  )
}

export default RoleCreationForm

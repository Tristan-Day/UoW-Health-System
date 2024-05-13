import { Typography, Box, Divider, Button, Grow } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import ConfirmationDialogue from '../../components/ConfirmationDialogue'
import { Searchbox } from '../../components'

import { AuthenticationContext } from '../../App'
import { searchRoles, deleteRole } from './logic/Permissions'

const Columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 250
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 350
  }
]

const Roles = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const [message, setMessage] = useState()

  const [selection, setSelection] = useState()
  const [showDeleteDialog, setDeleteDialog] = useState()
  const [contents, setContents] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    if (message && !message.loading) {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [message])

  async function handleSearch(query) {
    setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

    searchRoles(query)
      .then(result => {
        setContents(
          result.map(role => ({
            ...role,
            id: role.name
          }))
        )
        setMessage(undefined)
      })
      .catch(() => {
        setContents([])
        setMessage({
          text: 'No records found',
          severity: 'error',
          loading: false
        })
      })
  }

  async function handleSelection(index) {
    contents.forEach(role => {
      if (role.name === index) {
        setSelection(role)
        return
      }
    })
  }

  async function handleDelete() {
    setMessage({ text: 'Deleting Role...', severity: 'info', loading: true })

    deleteRole(selection.name)
      .then(() => {
        setMessage({
          text: 'Role sucessfully deleted',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(role => role.name !== selection.name))
      })
      .catch(() => {
        setMessage({
          text: 'Failed to delete role - Please try again later',
          severity: 'error',
          loading: false
        })
      })

    setSelection(undefined)
  }

  return (
    <Box>
      {showDeleteDialog && (
        <ConfirmationDialogue
          message={`Are you sure you want to delete role '${selection.name}'?`}
          proceedResponse="Delete" denyResponse="Cancel"
          onClose={() => {
            setDeleteDialog(false)
          }}
          state={{ value: showDeleteDialog, handle: setDeleteDialog }}
          onProceed={handleDelete}
        />
      )}
      <BreadcrumbGenerator />

      <Typography variant="h4">System Roles</Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Searchbox label="Search Roles" onSubmit={handleSearch} />
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={
              permissions.includes('roles.create') ? 'contained' : 'disabled'
            }
            onClick={() => navigate('create')}
          >
            Create New Role
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant={
              selection !== undefined && permissions.includes('roles.edit')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => navigate(selection.name)}
          >
            View Details
          </Button>
          <Button
            variant={
              selection !== undefined && permissions.includes('roles.delete')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => setDeleteDialog(true)}
          >
            Delete Role
          </Button>
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

      <DataGrid
        rows={contents}
        columns={Columns}
        onRowSelectionModelChange={model => handleSelection(model[0])}
        sx={{ height: '40vh' }}
        autoPageSize
      />
    </Box>
  )
}

export default Roles

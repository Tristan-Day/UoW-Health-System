import {
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Grow,
  Fab,
  InputAdornment,
  IconButton
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import { getRoles, deleteRole } from './logic/Permissions'

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
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState()

  const [selection, setSelection] = useState()
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

    getRoles(query)
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
    setMessage({ text: 'Deleting role', severity: 'info', loading: true })

    deleteRole(selection.id)
      .then(() => {
        setMessage({
          text: 'Role sucessfully deleted',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(role => role.id !== selection.id))
      })
      .catch(() => {
        setMessage({
          text: 'Failed to delete role - Please try again later',
          severity: 'error',
          loading: false
        })
      })
  }

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">System Roles</Typography>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <TextField
            label="Search Roles"
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event =>
              event.key === 'Enter' ? handleSearch(query) : null
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    disabled={message && message.loading}
                    onClick={() => handleSearch(query)}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={selection !== undefined ? 'outlined' : 'disabled'}
            onClick={() => handleDelete()}
          >
            Delete Role
          </Button>
          <Button
            variant={selection !== undefined ? 'outlined' : 'disabled'}
            onClick={() => navigate(selection.name)}
          >
            View Details
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
        autoPageSize
        rows={contents}
        columns={Columns}
        onRowSelectionModelChange={model => handleSelection(model[0])}
        sx={{ height: '40vh' }}
      />

      <Box sx={{ position: 'fixed', bottom: '4.5rem', right: '4.5rem' }}>
        <Fab
          color="primary"
          sx={{ position: 'absolute' }}
          onClick={() => navigate('create')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
}

export default Roles

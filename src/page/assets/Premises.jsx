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
import { palette } from '@mui/system'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/BreadcumbGenerator'
import { deletePremises, getPremises } from './logic/Premises'

const Columns = [
  {
    field: 'identifier',
    headerName: 'ID',
    width: 50,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'building',
    headerName: 'Building Name',
    width: 200
  },
  {
    field: 'room',
    headerName: 'Room Name',
    width: 200
  },
  {
    field: 'floor',
    headerName: 'Floor',
    width: 70,
    disableColumnMenu: true,
    sortable: false
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 300,
    disableColumnMenu: true,
    sortable: false
  }
]

const Premises = () => {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState()

  const [selection, setSelection] = useState()
  const [contents, setContents] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    if (message && message.loading) {
      setMessage(undefined)
    } else {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [contents])

  async function handleSearch(query) {
    setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

    try {
      const result = await getPremises(query)

      // Provide each record with an ID
      setContents(
        result.map(room => ({
          ...room,
          id: room.room_id,
          identifier: room.room_id
        }))
      )
    } catch (error) {
      setContents([])
      setMessage({
        text: 'No records found',
        severity: 'error',
        loading: false
      })
    }
  }

  async function handleDelete() {
    setMessage({ text: 'Deleting room...', severity: 'info', loading: true })

    deletePremises(selection)
      .then(() => {
        setMessage({
          text: 'Room sucessfully deleted',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(room => room.id !== selection))
      })
      .catch(() => {
        setMessage({
          text: 'Failed to delete room - Please try again later',
          severity: 'error',
          loading: false
        })
      })
  }

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">Physical Premises</Typography>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
      >
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <TextField
            label="Search Premises"
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
        <Button
          variant={selection ? 'outlined' : 'disabled'}
          onClick={() => handleDelete(selection)}
        >
          Delete Room
        </Button>
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
        onRowSelectionModelChange={model => setSelection(model[0])}
        sx={{ height: '40vh' }}
        autoPageSize
      />

      <Box sx={{ position: 'fixed', bottom: '4.5rem', right: '4.5rem' }}>
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'absolute' }}
          onClick={() => navigate('create')}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  )
}

export default Premises

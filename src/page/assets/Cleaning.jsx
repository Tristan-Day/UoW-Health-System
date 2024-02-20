import {
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Grow,
  Fab,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import { cancelOrder, getOrders } from './logic/Cleaning'

const Columns = [
  {
    field: 'location',
    headerName: 'Location',
    width: 250
  },
  {
    field: 'issued',
    headerName: 'Issued',
    width: 190
  },
  {
    field: 'fulfilled',
    headerName: 'Fulfilled',
    width: 190
  },
  {
    field: 'cleaner',
    headerName: 'Cleaner',
    width: 200
  }
]

const Cleaning = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState()

  const [message, setMessage] = useState({
    text: 'Please enter a room name',
    severity: 'info',
    loading: false
  })

  const [selection, setSelection] = useState()
  const [contents, setContents] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    if (message && !message.loading) {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [message])

  async function handleSearch(query) {
    if (!query) {
      setMessage({
        text: 'Please enter a room name',
        severity: 'error',
        loading: false
      })
      return
    }

    setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

    getOrders(query, filter)
      .then(result => {
        setContents(
          result.map((order, index) => ({
            id: index,
            identifier: order.room_id,

            location: `${order.building} - ${order.room}`,
            issued: new Date(order.issued).toLocaleString('en-UK'),

            fulfilled: order.fulfilled
              ? new Date(order.fulfilled).toLocaleString('en-UK')
              : undefined,

            cleaner: order.first_name
              ? `${order.first_name} ${order.last_name}`
              : undefined
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
    if (contents[index] && contents[index].fulfilled === undefined) {
      setSelection(index)
    } else {
      setSelection(undefined)
    }
  }

  async function handleCancel() {
    setMessage({ text: 'Canceling order...', severity: 'info', loading: true })

    cancelOrder(contents[selection].identifier)
      .then(() => {
        setMessage({
          text: 'Order sucessfully canceled',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(order => order.id !== selection))
      })
      .catch(() => {
        setMessage({
          text: 'Failed to cancel order - Please try again later',
          severity: 'error',
          loading: false
        })
      })
  }

  async function handleFulfil() {}

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">Cleaning Orders</Typography>

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
            label="Search Rooms"
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
          <FormControlLabel
            control={
              <Checkbox onChange={event => setFilter(event.target.checked)} />
            }
            label="Fulfilled"
            sx={{ alignItems: 'center' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={selection !== undefined ? 'outlined' : 'disabled'}
            onClick={() => handleCancel(selection)}
          >
            Cancel Order
          </Button>
          <Button
            variant={selection !== undefined ? 'outlined' : 'disabled'}
            onClick={() => handleFulfil(selection)}
          >
            Fulfil Order
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

export default Cleaning

import {
  Typography,
  Box,
  Divider,
  Button,
  Grow,
  Checkbox,
  FormControlLabel
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import { AuthenticationContext } from '../../App'
import { Searchbox } from '../../components'

import { cancelOrder, fulfilOrder, getOrders } from './logic/Cleaning'

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
  const permissions = useContext(AuthenticationContext).permissions

  const [message, setMessage] = useState()
  const [filter, setFilter] = useState()

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
    if (!(contents[index] && contents[index].fulfilled)) {
      setSelection(index)
    } else {
      setSelection(undefined)
    }
  }

  async function handleCancel(selection) {
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

  async function handleFulfil(selection) {
    setMessage({ text: 'Fulfilling order...', severity: 'info', loading: true })

    fulfilOrder(contents[selection].identifier)
      .then(() => {
        setMessage({
          text: 'Order sucessfully fulfilled',
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

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">Cleaning Orders</Typography>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Box display="flex" gap={2}>
          <Searchbox label="Search Orders" onSubmit={handleSearch} />
          <FormControlLabel
            control={
              <Checkbox onChange={event => setFilter(event.target.checked)} />
            }
            label="Include Fulfilled"
            sx={{ alignItems: 'center' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={
              permissions.includes('cleaning.issue') ? 'contained' : 'disabled'
            }
            onClick={() => navigate('create')}
          >
            Create New Order
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant={
              selection !== undefined && permissions.includes('cleaning.cancel')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => handleCancel(selection)}
          >
            Cancel Order
          </Button>
          <Button
            variant={
              selection !== undefined && permissions.includes('cleaning.fulfil')
                ? 'outlined'
                : 'disabled'
            }
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
        rows={contents}
        columns={Columns}
        onRowSelectionModelChange={model => handleSelection(model[0])}
        sx={{ height: '40vh' }}
        autoPageSize
      />
    </Box>
  )
}

export default Cleaning

import { Typography, Box, Divider, Button, Grow } from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import ConfirmationDialogue from '../../components/ConfirmationDialogue'
import { Searchbox } from '../../components'

import { AuthenticationContext } from '../../App'
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

    getPremises(query)
      .then(result => {
        // Provide each record with an ID
        setContents(
          result.map(room => ({
            ...room,
            id: room.room_id,
            identifier: room.room_id
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
      {showDeleteDialog && (
        <ConfirmationDialogue
          message={`Are you sure you want to delete '${contents.filter((item) => item.identifier === selection)[0].room}'?`}
          proceedResponse="Delete" denyResponse="Cancel"
          onClose={() => {
            setDeleteDialog(false)
          }}
          state={{ value: showDeleteDialog, handle: setDeleteDialog }}
          onProceed={handleDelete}
        />
      )}
      <BreadcrumbGenerator />

      <Typography variant="h4">Physical Premises</Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
        <Searchbox label="Search Premises" onSubmit={handleSearch} />
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant={
              permissions.includes('premises.create') ? 'contained' : 'disabled'
            }
            onClick={() => navigate('create')}
          >
            Add Premises
          </Button>
          <Divider orientation="vertical" />
          <Button
            variant={
              selection !== undefined && permissions.includes('premises.delete')
                ? 'outlined'
                : 'disabled'
            }
            onClick={() => setDeleteDialog(true)}
          >
            Delete Room
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
        onRowSelectionModelChange={model => setSelection(model[0])}
        sx={{ height: '40vh' }}
        autoPageSize
      />
    </Box>
  )
}

export default Premises

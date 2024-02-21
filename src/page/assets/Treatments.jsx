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
  Icon
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
import { Edit } from '@mui/icons-material'
import ConfirmationDialogue from '../../components/ConfirmationDialogue'
import TreatmentsAPI from './logic/Treatments'
import TreatmentCategoriesAPI from './logic/TreatmentCategory'

const Treatments = () => {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState()

  const [selection, setSelection] = useState()
  const [contents, setContents] = useState([])
  const [treatmentCategories, setTreatmentCategories] = useState([])

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    handleSearch()
  }, [])

  useEffect(() => {
    TreatmentCategoriesAPI.getTreatment({}).then(res => setTreatmentCategories(res.rows))
    if (message && !message.loading) {
      setTimeout(() => {
        setMessage(undefined)
      }, 7000)
    }
  }, [message])

  const Columns = [
    {
      field: 'treatment_id',
      headerName: 'ID',
      width: 200,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: 'category_id',
      headerName: 'Category',
      width: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => {
        let treatmentCategoryName = "";
        treatmentCategories.forEach((category) => {
            if(category.treatment_id == params.row.category_id) {
                treatmentCategoryName = category.category_name;
            }
        });

        return (
          <Typography>{treatmentCategoryName}</Typography>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      sortable: false
    },
    {
      field: 'ward_id',
      headerName: 'Ward ID',
      width: 200,
      sortable: false
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => {
        return (
          <Button
            variant="text"
            onClick={() => {
              navigate('create', { state: { ...params.row, action: 'UPDATE' } })
            }}
          >
            <Edit /> Edit
          </Button>
        )
      }
    }
  ]

  async function handleSearch(query) {
    setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

    console.log(query)

    TreatmentsAPI.getTreatment({})
      .then(result => {
        // Provide each record with an ID
        setContents(
          result.rows.map(room => ({
            ...room,
            id: room.ward_id
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

  function openDeleteDialog() {
    setShowDeleteDialog(true)
  }

  async function handleDelete() {
    setShowDeleteDialog(false)

    setMessage({ text: 'Deleting room...', severity: 'info', loading: true })

    console.log('selection')
    console.log(selection)

    TreatmentsAPI.deleteTreatment(selection)
      .then(res => {
        console.log(res)

        setMessage({
          text: 'Ward sucessfully deleted',
          severity: 'success',
          loading: false
        })

        setContents(contents.filter(room => room.id !== selection))
      })
      .catch(error => {
        console.log(error)

        setMessage({
          text: 'Ward to delete room - Please try again later',
          severity: 'error',
          loading: false
        })
      })
  }

  return (
    <div>
      {showDeleteDialog && (
        <ConfirmationDialogue
          message="Are you sure you want to proceed?"
          proceedResponse="Delete"
          denyResponse="Don't delete"
          onProceed={handleDelete}
          open={showDeleteDialog}
        />
      )}
      <Box>
        <BreadcrumbGenerator />
        <Typography variant="h4">Treatments</Typography>

        <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}
        >
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <TextField
              label="Search Wards"
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
            onClick={() => openDeleteDialog()}
          >
            Delete wards
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
          onRowSelectionModelChange={model => {
            console.log(model[0])
            setSelection(model[0])
          }}
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
    </div>
  )
}

export default Treatments

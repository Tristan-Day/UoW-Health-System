import {
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Fab,
  Grow,
  Alert,
  Icon
} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import { useState, useEffect, cloneElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BreadcrumbGenerator, Spinbox } from '../../../components'
import { getBuildings, createPremises } from '../logic/Premises'
import { MaterialIconPicker } from 'react-material-icon-picker'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { ArrowDropDown } from '@mui/icons-material'
import WardsAPI from '../logic/Wards'
import TreatmentCategoriesAPI from '../logic/TreatmentCategory'
import TreatmentsAPI from '../logic/Treatments'

const TreatmentCreationForm = props => {
  const [message, setMessage] = useState({})
  const [errors, setErrors] = useState({})
  const [treatmentCategories, setTreatmentCategories] = useState([])
  const [wards, setWards] = useState([])
  const [wardSelectionError, setWardSelectionError] = useState(true)
  const [treatmentCategorySelectionError, setTreatmentCategorySelectionError] =
    useState(true)

  const [form, setForm] = useState({
  })

  const navigate = useNavigate()
  const location = useLocation()

  console.log('props')
  console.log(location.state)

  let action = 'CREATE'
  if (
    location.state &&
    location.state.action &&
    location.state.action === 'UPDATE'
  ) {
    action = 'UPDATE'
  }

  useEffect(() => {
    let props = location.state
    if (props && props.action && props.action === 'UPDATE') {
      setForm({
        ward_id: location.state.ward_name,
        name: location.state.description,
        category_id: location.state.icon_data,
        id: location.state.ward_id
      })
    }
    handleValidation()
  }, [])

  useEffect(() => {
    TreatmentCategoriesAPI.getTreatment({}).then(res =>
      setTreatmentCategories(res.rows)
    )

    WardsAPI.getWard({}).then(res => {
      setWards(res.rows)
    })

    handleValidation()
  }, [form])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    // if (!(form.id && form.id.trim())) {
    //   setMessage({
    //     severity: 'error',
    //     text: 'A ward ID is required, please enter a ward ID'
    //   })
    //   errors.building = true
    // }

    if (!(form.ward_id && form.ward_id.trim())) {
      setMessage({
        severity: 'error',
        text: 'A ward name is required - Please enter a ward name'
      })
      errors.ward = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    if (action === 'UPDATE') {
      setMessage({ text: 'Updating ward...', severity: 'info' })

      TreatmentsAPI.upsertTreatment(
        'UPDATE',
        form.name,
        form.treatment_category_id,
        form.ward_id,
        location.state.treatment_id
      )
        .then(res => {
          setMessage({ text: 'ward sucessfully created', severity: 'success' })

          console.log(res)

          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(res => {
          setMessage({
            text: 'Failed to create ward - Please try again later',
            severity: 'error'
          })

          console.log(res)

          setTimeout(() => setMessage(undefined), 7000)
        })
      return
    }

    setMessage({ text: 'Creating ward...', severity: 'info' })

    console.log(form)

    TreatmentsAPI.upsertTreatment(
      'INSERT',
      form.name,
      form.treatment_category_id,
      form.ward_id,
      null
    )
      .then(res => {
        console.log(res)

        setMessage({ text: 'ward sucessfully created', severity: 'success' })

        setTimeout(() => setMessage(undefined), 7000)
      })
      .catch(err => {
        setMessage({
          text: 'Failed to create ward - Please try again later',
          severity: 'error'
        })
        console.log(err)

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  const renderWardName = params => {
    return (
      <TextField
        {...params}
        label="Enter a ward name"
        onChange={event => {
          if (event.target.value) {
            setForm({ ...form, ward_id: event.target.value })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
      />
    )
  }

  const renderTreatmentCategorySearch = params => {
    return (
      <TextField
        {...params}
        label="Enter a treatment category name"
        onChange={(event, newVal) => {
          console.log(event.target)
          if (newVal) {
            setForm({ ...form, treatment_category_id: parseInt(newVal.id) })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
      />
    )
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">
          {action === 'UPDATE' ? 'Update' : 'Create'} a ward
        </Typography>
        <Button onClick={() => navigate(-1)}>Return</Button>
      </Box>
      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      {message && (
        <Grow in={true}>
          <Alert severity={message.severity} sx={{ marginBottom: '1.5rem' }}>
            {message.text}
          </Alert>
        </Grow>
      )}

      <Stack spacing={2}>
        <TextField
          label="Enter a treatment Name"
          onChange={event => {
            setForm({ ...form, ward: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, ward: event.target.value })
          }}
          value={form.ward}
          defaultValue={form.ward}
          error={errors.ward}
        />
        <Autocomplete 
          //TODO: switch over ward so it uses ID instead of name
          disablePortal
          disableClearable
          renderInput={renderWardName}
          onBlur={event => {
            setForm({ ...form, ward_id: event.target.value })
          }}
          options={
            wards
              ? wards.map(ward => {
                  return ward.ward_name
                })
              : []
          }
        />
        <Autocomplete
          disablePortal
          disableClearable
          renderInput={renderTreatmentCategorySearch}
          getOptionLabel={option => option.label}
          // onBlur={(event) => {
          //   // console.log("e")
          //   // console.log(event.target.value)
          //   setForm({ ...form, treatment_category_id: event.target.value })
          // }}
          onChange={(e, newVal) => {
            console.log(newVal)
            setForm({ ...form, treatment_category_id: parseInt(newVal.id) })
          }}
          options={
            treatmentCategories
              ? treatmentCategories.map((treatmentCategory, index) => {
                // console.log(treatmentCategory)
                // console.log(index)
                  return {label: treatmentCategory.category_name, id: treatmentCategory.treatment_id}
                })
              : []
          }
        />
      </Stack>

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

export default TreatmentCreationForm

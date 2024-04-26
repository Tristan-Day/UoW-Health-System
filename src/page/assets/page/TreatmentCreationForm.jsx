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

  const [form, setForm] = useState({})

  const navigate = useNavigate()
  const location = useLocation()

  let action = 'CREATE'
  if (
    location.state &&
    location.state.action &&
    location.state.action === 'UPDATE'
  ) {
    action = 'UPDATE'
  }

  console.log(location.state)

  useEffect(() => {
    let props = location.state
    if (props && props.action && props.action === 'UPDATE') {
      setForm({
        ...location.state,
        treatment_name: location.state.name,
        treatment_category_id: location.state.category_id
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

    if (!(form.treatment_name && form.treatment_name.trim())) {
      setMessage({
        severity: 'error',
        text: 'A treatment name is required - Please enter a treatment name'
      })
      errors.treatment_name = true
    }

    if (!form.treatment_category_id) {
      setMessage({
        severity: 'error',
        text: 'A treatment category name is required - Please select a treatment category name'
      })
      errors.treatment_category = true
    }

    if (!form.ward_id) {
      setMessage({
        severity: 'error',
        text: 'A ward is required - Please select a ward'
      })
      errors.ward_id = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    console.log('form')
    console.log(form)

    if (!handleValidation) {
      return
    }

    if (action === 'UPDATE') {
      setMessage({ text: 'Updating ward...', severity: 'info' })

      TreatmentsAPI.upsertTreatment(
        'UPDATE',
        form.treatment_name,
        form.treatment_category_id,
        form.ward_id,
        form.id
      ).then(res => {
          setMessage({ text: 'ward sucessfully created', severity: 'success' })

          console.log("output")
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
      form.treatment_name,
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
        onChange={(event, newVal) => {
          // console.log(event.target.value)
          // console.log(newVal)
          if (event.target.value) {
            setForm({ ...form, ward_id: parseInt(newVal.id) })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.ward_id}
      />
    )
  }

  const renderTreatmentCategorySearch = params => {
    return (
      <TextField
        {...params}
        label="Enter a treatment category name"
        onChange={(event, newVal) => {
          // console.log(event.target)
          if (event.target.value) {
            setForm({ ...form, treatment_category_id: parseInt(newVal.id) })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.treatment_category}
      />
    )
  }

  const getWardValue = () => {
    if (!form.ward_id) {
      return null
    }

    let filteredWards = wards.filter(ward => ward.ward_id === form.ward_id)

    if (filteredWards.length === 0) {
      return null
    }

    return { label: filteredWards[0].ward_name, id: filteredWards[0].ward_id }
  }

  const getTreatmentCategoryValue = () => {
    if (!form.treatment_category_id) {
      return null
    }

    let filteredCategories = treatmentCategories.filter(
      treatmentCategory =>
        treatmentCategory.treatment_id === form.treatment_category_id
    )

    if (filteredCategories.length === 0) {
      return null
    }

    return {
      label: filteredCategories[0].category_name,
      id: filteredCategories[0].treatment_id
    }
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
            setForm({ ...form, treatment_name: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, treatment_name: event.target.value })
          }}
          value={form.treatment_name}
          error={errors.treatment_name}
        />
        <Autocomplete
          disablePortal
          label="Ward name..."
          renderInput={renderWardName}
          getOptionLabel={option => option.label}
          onChange={(e, newVal) => {
            // console.log(newVal)
            setForm({ ...form, ward_id: newVal.id })
          }}
          options={
            wards
              ? wards.map(ward => {
                  // console.log(ward)
                  return { label: ward.ward_name, id: ward.ward_id }
                })
              : []
          }
          value={getWardValue()}
        />
        <Autocomplete
          disablePortal
          label="treatment category name..."
          renderInput={renderTreatmentCategorySearch}
          getOptionLabel={option => option.label}
          onChange={(e, newVal) => {
            setForm({...form, treatment_category_id: newVal.id})
          }}
          options={
            treatmentCategories
              ? treatmentCategories.map((treatmentCategory, index) => {
                  return {
                    label: treatmentCategory.category_name,
                    id: treatmentCategory.treatment_id
                  }
                })
              : []
          }
          value={getTreatmentCategoryValue()}
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

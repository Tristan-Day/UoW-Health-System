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
  
  const TreatmentCategoriesCreationForm = props => {
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
          name: location.state.category_name,
          treatment_category_id: location.state.treatment_id
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
  
      if (!(form.name && form.name.trim())) {
        setMessage({
          severity: 'error',
          text: 'A treatment name is required - Please enter a treatment name'
        })
        errors.name = true
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
        setMessage({ text: 'Updating treatment category...', severity: 'info' })
  
        TreatmentCategoriesAPI.upsertTreatment(
          'UPDATE',
          form.name,
          form.treatment_category_id,
        ).then(res => {
            setMessage({ text: 'Treatment category sucessfully created', severity: 'success' })
  
            console.log("output")
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
          .catch(res => {
            setMessage({
              text: 'Failed to create treatment category - Please try again later',
              severity: 'error'
            })
  
            console.log(res)
  
            setTimeout(() => setMessage(undefined), 7000)
          })
  
        return
      }
  
      setMessage({ text: 'Creating treatment category...', severity: 'info' })
  
      console.log(form)
  
      TreatmentCategoriesAPI.upsertTreatment(
        'INSERT',
        form.name,
        null
      )
        .then(res => {
          console.log(res)
  
          setMessage({ text: 'Treatment category sucessfully created', severity: 'success' })
  
          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(err => {
          setMessage({
            text: 'Failed to create treatment category - Please try again later',
            severity: 'error'
          })
          console.log(err)
  
          setTimeout(() => setMessage(undefined), 7000)
        })
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
            label="Enter a Treatment Category Name"
            onChange={event => {
              setForm({ ...form, name: event.target.value })
            }}
            onBlur={event => {
              setForm({ ...form, name: event.target.value })
            }}
            value={form.name}
            error={errors.name}
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
  
  export default TreatmentCategoriesCreationForm
  
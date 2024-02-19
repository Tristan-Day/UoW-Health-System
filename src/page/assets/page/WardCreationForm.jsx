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

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BreadcrumbGenerator, Spinbox } from '../../../components'
import { getBuildings, createPremises } from '../logic/Premises'
import { MaterialIconPicker } from 'react-material-icon-picker'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { ArrowDropDown } from '@mui/icons-material'
import WardsAPI from '../logic/Wards'

const WardCreationForm = (props) => {
  const [message, setMessage] = useState({})
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    floor: 0
  })

  const navigate = useNavigate()
  const location = useLocation()

  
  console.log("props");
  console.log(location.state);

  useEffect(() => {
    handleValidation()
  }, [])

  useEffect(() => {
    handleValidation()
  }, [form])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    if (!(form.id && form.id.trim())) {
      setMessage({
        severity: 'error',
        text: 'A ward ID is required, please enter a ward ID'
      })
      errors.building = true
    }

    if (!(form.ward && form.ward.trim())) {
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

    setMessage({ text: 'Creating ward...', severity: 'info' })

    WardsAPI.upsertWard(
      'INSERT',
      form.ward,
      form.specialisation,
      form.description,
      form.icon,
      form.id
    )
      .then(() => {
        setMessage({ text: 'ward sucessfully created', severity: 'success' })

        setTimeout(() => setMessage(undefined), 7000)
      })
      .catch(() => {
        setMessage({
          text: 'Failed to create ward - Please try again later',
          severity: 'error'
        })

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Create a ward</Typography>
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
          label="Enter a unique 4 digit ward ID (e.g. ORTH)"
          onChange={event => {
            setForm({ ...form, id: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, id: event.target.value })
          }}
          error={errors.ward}
        />
        <TextField
          label="Enter a ward Name"
          onChange={event => {
            setForm({ ...form, ward: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, ward: event.target.value })
          }}
          error={errors.ward}
        />
        <TextField
          label="Enter a ward Specialisation"
          onChange={event => {
            setForm({ ...form, specialisation: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, specialisation: event.target.value })
          }}
          error={errors.ward}
        />
        <TextField
          multiline
          rows={4}
          label="Description"
          onChange={event =>
            setForm({ ...form, description: event.target.value.trim() })
          }
        />
        <div>
          <Typography>Selected Icon: </Typography>
          <div
            style={{ padding: '1rem', translateY: '1rem', display: 'inline' }}
          >
            <Icon>{form.icon}</Icon>
          </div>
        </div>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowDropDown />}>
            <Typography>Select an Icon (optional)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MaterialIconPicker
              onIconClick={event => {
                setForm({ ...form, icon: event })
              }}
            />
          </AccordionDetails>
        </Accordion>
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

export default WardCreationForm

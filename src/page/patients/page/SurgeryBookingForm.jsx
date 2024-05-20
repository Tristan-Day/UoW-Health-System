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
  Icon,
  Grid,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BreadcrumbGenerator, Spinbox } from '../../../components'
import SurgeryBookingAPI from '../logic/SurgeryBooking'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { getStaff } from '../../staff/logic/Personel'

const SurgeryBookingForm = props => {
  const [message, setMessage] = useState({})
  const [errors, setErrors] = useState({})

  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')

  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState('')

  const [form, setForm] = useState({
    floor: 0
  })

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

  useEffect(() => {
    let props = location.state
    if (props && props.action && props.action === 'UPDATE') {
      //update here
      setForm({
        ward: location.state.ward_name,
        specialisation: location.state.specialisation,
        description: location.state.description,
        icon: location.state.icon_data,
        id: location.state.ward_id
      })
    }

    getStaff(null)
      .then(result => {
        setStaff(
          result.map(user => ({
            ...user,
            id: user.staff_id,
            identifier: user.staff_id
          }))
        )
        setMessage(undefined)
      })
      .catch(() => {
        setStaff([])
      })

    handleValidation()
  }, [])

  useEffect(() => {
    handleValidation()
  }, [form])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    if (!(form.name && form.name.trim())) {
      setMessage({
        severity: 'error',
        text: 'A booking surgery name is required - Please enter a booking surgery name'
      })
      errors.ward = true
    }

    if (startDate.length === 0 || startTime.length === 0) {
      setMessage({
        severity: 'error',
        text: 'A start time and date is required - Please fill these out'
      })
      errors.ward = true
    }

    if (!(form.booking_type && form.booking_type.trim())) {
        setMessage({
          severity: 'error',
          text: 'A booking type is required - Please enter a booking type'
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

    console.log([
        form.name,
        startDate.toString(),
        startTime.toString(),
        form.department,
        selectedStaff,
        form.surgery_type,
        form.description,
        form.booking_type,
        form.id
    ])

    if (action === 'UPDATE') {
      setMessage({ text: 'Updating booking...', severity: 'info' })

      console.log("updating")

      //ensure correct API is used
      SurgeryBookingAPI.upsertSurgeryBooking(
        'UPDATE',
        form.name,
        startDate.toString(),
        startTime.toString(),
        form.department,
        selectedStaff,
        form.surgery_type,
        form.description,
        form.booking_type,
        form.id
      )
        .then(res => {
          setMessage({ text: 'Booking sucessfully created', severity: 'success' })

          console.log(res)

          setTimeout(() => setMessage(undefined), 7000)
        })
        .catch(res => {
          setMessage({
            text: 'Failed to create booking - Please try again later',
            severity: 'error'
          })

          console.log(res)

          setTimeout(() => setMessage(undefined), 7000)
        })
        return;
    }

    setMessage({ text: 'Creating booking...', severity: 'info' })

    console.log("creating")

    SurgeryBookingAPI.upsertSurgeryBooking(
      'INSERT',
      form.name,
      startDate.toString(),
      startTime.toString(),
      form.department,
      selectedStaff,
      form.surgery_type,
      form.description,
      form.booking_type,
      null
    )
      .then((res) => {
        setMessage({ text: 'booking sucessfully created', severity: 'success' })

        console.log(res)

        setTimeout(() => setMessage(undefined), 7000)
      })
      .catch((res) => {
        setMessage({
          text: 'Failed to create booking - Please try again later',
          severity: 'error'
        })

        console.log(res)

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  const renderStaffDisplayName = params => {
    return (
      <TextField
        {...params}
        value={getStaffValue()}
        placeholder="Enter a patient name"
        onChange={(event, newVal) => {
          if (event.target.value) {
            setSelectedStaff(newVal.id)
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        // error={errors.ward_id}
      />
    )
  }

  const getStaffValue = () => {
    // console.log(selectedPatient);
    if (props.overWriteValue == 0) {
      // console.log('selected patient is default')
      return null
    }

    let filteredStaff = staff.filter(staffMember => {
      // console.log(props.overWriteValue);
      // console.log(patient)
      return staffMember.staff_id == selectedStaff
    })

    // console.log(filteredPatients);

    if (filteredStaff.length < 1) {
      // console.log('filteredPatients is empty')
      return null
    }

    // console.log('displaying patient in textfield')

    return {
      label:
        filteredStaff[0].first_name +
        ' ' +
        filteredStaff[0].last_name +
        ':' +
        filteredStaff[0].staff_id,
      id: filteredStaff[0].staff_id
    }
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">
          {action === 'UPDATE' ? 'Update' : 'Create'} a surgery booking
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
        <InputLabel id="name">Name</InputLabel>
        <TextField
          id="name"
          onChange={event => {
            setForm({ ...form, name: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, name: event.target.value })
          }}
          value={form.name}
          defaultValue={form.name}
          error={errors.ward}
        />

        <Typography sx={{ marginTop: 1 }}>Task start time</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container>
            <Grid item sx>
              <DatePicker
                size="small"
                sx={{ marginRight: 1 }}
                value={dayjs(startDate)}
                onAccept={e => {
                  console.log(e)
                  setStartDate(e)
                }}
              />
            </Grid>
            <Grid item sx>
              <TimePicker
                timeSteps={{ minutes: 15 }}
                size="small"
                value={dayjs(startTime)}
                onChange={e => {
                  setStartTime(e)
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <InputLabel id="department-auto">Description</InputLabel>
        <TextField
          id="department-auto"
          onChange={event => {
            setForm({ ...form, description: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, description: event.target.value })
          }}
          value={form.description}
          defaultValue={form.description}
          error={errors.ward}
        />

        <InputLabel id="department-auto">Department</InputLabel>
        <TextField
          id="department-auto"
          onChange={event => {
            setForm({ ...form, department: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, department: event.target.value })
          }}
          value={form.department}
          defaultValue={form.department}
          error={errors.ward}
        />

        <InputLabel id="staff-auto">Staff</InputLabel>
        <Autocomplete
          disablePortal
          id="staff-auto"
          label="Staff name..."
          renderInput={renderStaffDisplayName}
          getOptionLabel={option => option.label}
          onChange={(e, newVal) => {
            // console.log(newVal)
            setSelectedStaff(newVal.id)
          }}
          options={
            staff
              ? staff.map(staffMember => {
                  // console.log(ward)
                  return {
                    label:
                      staffMember.first_name +
                      ' ' +
                      staffMember.last_name +
                      ':' +
                      staffMember.id,
                    id: staffMember.id
                  }
                })
              : []
          }
          value={getStaffValue()}
        />

        <InputLabel id="select-label">Booking type</InputLabel>
        <Select
          value={form.booking_type}
          onChange={e => setForm({ ...form, booking_type: e.target.value })}
          id="select-label"
          error={errors.ward}
        >
          <MenuItem value="planned">Planned</MenuItem>
          <MenuItem value="emergency">Emergency</MenuItem>
        </Select>

        <InputLabel id="surgery-type-label">Surgery type</InputLabel>
        <TextField
          id="surgery-type-label"
          onChange={event => {
            setForm({ ...form, surgery_type: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, surgery_type: event.target.value })
          }}
          value={form.surgery_type}
          defaultValue={form.surgery_type}
          error={errors.ward}
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

export default SurgeryBookingForm

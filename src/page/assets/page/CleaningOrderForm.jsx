import {
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Grow,
  Alert
} from '@mui/material'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { BreadcrumbGenerator, Spinbox } from '../../../components'

import { getBuildings, getRooms } from '../logic/Premises'
import { issueOrder } from '../logic/Cleaning'

const CleaningOrderForm = () => {
  // Drop down items
  const [buildings, setBuildings] = useState([])
  const [rooms, setRooms] = useState([])

  // Validation and feedback
  const [message, setMessage] = useState()
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    floor: 0
  })

  const navigate = useNavigate()

  useEffect(() => {
    setMessage({
      text: 'Loading buildings...',
      severity: 'info',
      loading: true
    })

    getBuildings()
      .then(result => {
        setBuildings(result)
        setMessage(undefined)
      })
      .catch(() => {
        setMessage({
          text: 'Failed to load buildings list - Please try again later',
          severity: 'error'
        })

        setTimeout(() => setMessage(undefined), 7000)
      })
  }, [])

  useEffect(() => {
    if (!form.building) {
      return
    }

    handleValidation()
  }, [form])

  useEffect(() => {
    if (!(form && form.building)) {
      return
    }

    getRooms(form.building)
      .then(result => {
        setRooms(
          result.filter(room => {
            return room.floor === form.floor
          })
        )
      })
      .catch(() => {
        setMessage({
          text: 'Failed to load available rooms',
          severity: 'error'
        })
        setTimeout(() => setMessage(undefined), 7000)
      })
  }, [form.building, form.floor])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    if (!form.room) {
      setMessage({
        severity: 'error',
        text: 'A room is required - Please select a room'
      })
      errors.room = true
    }

    if (!form.building) {
      setMessage({
        severity: 'error',
        text: 'A building is required - Please select a building'
      })
      errors.building = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    setMessage({ text: 'Submitting order...', severity: 'info' })

    const identifier = rooms
      .filter(room => {
        return room.name === form.room
      })
      .at(0).room_id

    issueOrder(identifier)
      .then(() => {
        setMessage({ text: 'Order sucessfully placed', severity: 'success' })
      })
      .catch(() => {
        setMessage({
          text: 'Failed to issue order - Please try again later.',
          severity: 'error'
        })

        setTimeout(() => setMessage(undefined), 7000)
      })
  }

  const renderBuildingSearch = params => {
    return (
      <TextField
        {...params}
        label="Enter a Building Name"
        onChange={event => {
          if (event.target.value) {
            setForm({ ...form, building: event.target.value })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.building}
      />
    )
  }

  const renderRoomSearch = params => {
    return (
      <TextField
        {...params}
        label="Enter a Room Name"
        onChange={event => {
          setForm({ ...form, room: event.target.value })
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.room}
      />
    )
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Submit a Cleaning Order</Typography>

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            variant="contained"
            disabled={Boolean(message)}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
          <Divider orientation="vertical" />
          <Button onClick={() => navigate(-1)}>Return</Button>
        </Box>
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
        <Autocomplete
          disablePortal
          disableClearable
          renderInput={renderBuildingSearch}
          onBlur={event => {
            setForm({ ...form, building: event.target.value })
          }}
          options={
            buildings
              ? buildings.map(building => {
                  return building.name
                })
              : []
          }
        />
        <Spinbox
          min={-20}
          max={20}
          label="Floor"
          onChange={event => {
            setForm({ ...form, floor: event.target.value })
          }}
        />
        <Autocomplete
          disablePortal
          disableClearable
          renderInput={renderRoomSearch}
          onBlur={event => {
            setForm({ ...form, room: event.target.value })
          }}
          options={
            rooms
              ? rooms.map(room => {
                  return room.name
                })
              : []
          }
        />
      </Stack>
    </Box>
  )
}

export default CleaningOrderForm

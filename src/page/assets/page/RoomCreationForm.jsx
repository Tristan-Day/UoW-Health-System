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
import { getBuildings, createPremises } from '../logic/Premises'

const RoomCreationForm = () => {
  const [buildings, setBuildings] = useState([])

  const [message, setMessage] = useState()
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    floor: 0
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBuildings()

        setBuildings(
          result.map(building => {
            return building.name
          })
        )
      } catch (error) {
        return
      }
    }
    fetchData()
    handleValidation()
  }, [])

  useEffect(() => {
    handleValidation()
  }, [form])

  async function handleValidation() {
    setMessage(undefined)
    const errors = {}

    if (!(form.building && form.building.trim())) {
      setMessage({
        severity: 'error',
        text: 'A building name is required - Please enter a building name'
      })
      errors.building = true
    }

    if (!(form.room && form.room.trim())) {
      setMessage({
        severity: 'error',
        text: 'A room name is required - Please enter a room name'
      })
      errors.room = true
    }

    setErrors(errors)

    // False indicates that the form was not validated
    return !Boolean(errors)
  }

  async function handleSubmit() {
    if (!handleValidation) {
      return
    }

    setMessage({ text: 'Creating room...', severity: 'info' })

    createPremises(form.room, form)
      .then(() => {
        setMessage({ text: 'Room sucessfully created', severity: 'success' })

        setTimeout(() => setMessage(undefined), 7000)
      })
      .catch(() => {
        setMessage({
          text: 'Failed to create room - Please try again later',
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
          setForm({ ...form, building: event.target.value })
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.building}
      />
    )
  }

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Create a Room</Typography>

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
          freeSolo
          disableClearable
          renderInput={renderBuildingSearch}
          onBlur={event => {
            setForm({ ...form, building: event.target.value })
          }}
          options={buildings ? buildings : []}
        />
        <Spinbox
          min={-20}
          max={20}
          label="Floor"
          onChange={event => {
            setForm({ ...form, floor: event.target.value })
          }}
        />
        <TextField
          label="Enter a Room Name"
          onChange={event => {
            setForm({ ...form, room: event.target.value })
          }}
          onBlur={event => {
            setForm({ ...form, room: event.target.value })
          }}
          error={errors.room}
        />
        <TextField
          multiline
          rows={4}
          label="Description"
          onChange={event =>
            setForm({ ...form, description: event.target.value.trim() })
          }
        />
      </Stack>
    </Box>
  )
}

export default RoomCreationForm

import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

function EditTask(props) {
  const [edit, setEdit] = useState(props.isEdit && false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [patientId, setPatientId] = useState(0)
  const [durationQuarterHour, setDurationQuarterHour] = useState(1)

  function formatStartTime() {
    const time = new Date()
    time.setHours(Math.floor(startTime / 4))
    time.setMinutes((startTime % 4) * 15)
    console.log(time)
    console.log(dayjs(time))
    return dayjs(time)
  }

  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h4">Task</Typography>
      {/* Form */}
      <Typography sx={{ marginTop: 1 }}>Task name</Typography>
      <TextField
        size="small"
        placeholder="Task name"
        value={name}
        onChange={e => setName(e.target.value)}
      ></TextField>

      <Typography sx={{ marginTop: 1 }}>Task description</Typography>
      <TextField
        size="small"
        placeholder="Task description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></TextField>

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
              value={formatStartTime()}
              onChange={e => {
                const quarterHours = e.$H * 4 + Math.floor(e.$m / 15)
                console.log('quarterHours: ' + quarterHours)
                setStartTime(quarterHours)
              }}
            />
          </Grid>
        </Grid>

        <Typography sx={{ marginTop: 1 }}>Patient</Typography>
        <TextField size="small" placeholder="Patient name"></TextField>
        {/* time textfield that only goes up in increments of 15 */}

        <InputLabel
          id="duration-select-label"
          sx={{ display: 'block', marginTop: 1 }}
        >
          Duration
        </InputLabel>
        <Select
          labelId="duration-select-label"
          size="small"
          value={durationQuarterHour}
          onChange={e => {
            setDurationQuarterHour(e.target.value)
          }}
        >
          <MenuItem value={1}>15 minutes</MenuItem>
          <MenuItem value={2}>30 minutes</MenuItem>
          <MenuItem value={3}>45 minutes</MenuItem>
          <MenuItem value={4}>1 hour</MenuItem>
          <MenuItem value={5}>1 hour 15 minutes</MenuItem>
          <MenuItem value={6}>1 hour 30 minutes</MenuItem>
          <MenuItem value={7}>1 hour 45 minutes</MenuItem>
          <MenuItem value={8}>2 hours</MenuItem>
        </Select>

        <Button variant="contained" sx={{ display: 'block', marginTop: 2 }}>
          Submit
        </Button>
      </LocalizationProvider>
    </Box>
  )
}

export default EditTask

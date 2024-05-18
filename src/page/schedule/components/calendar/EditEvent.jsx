import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  duration
} from '@mui/material'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import PatientSearch from './PatientSearch'
import ScheduleItemAPI from '../../apis/ScheduleItemAPI'
import { Check, ClearAll, Delete, QuestionAnswer, QuestionMark } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import { getCurrentUser } from 'aws-amplify/auth'
import ScheduleValidator from './ScheduleValidator'
import PropsConfirmationDialogue from './PropsConfirmationDialogue'

function EditEvent(props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState(0)
  const [patientId, setPatientId] = useState(0)
  const [durationQuarterHour, setDurationQuarterHour] = useState(1)

  const [message, setMessage] = useState('')
  const [messageIcon, setMessageIcon] = useState('CHECK')
  const [severity, setSeverity] = useState('success')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [lastIdSelected, setLastIdSelected] = useState(0)

  useEffect(() => {
    console.log('editEvent reloaded')
    console.log(props.cardSelected + ':' + lastIdSelected)

    if (props.cardSelected === 0 && lastIdSelected > 0) {
      console.log('resetting')
      setLastIdSelected(0)
      setName('')
      setDescription('')
      setStartTime('')
      setStartDate('')
      setPatientId(0)
      setDurationQuarterHour(1)
    }

    if (props.cardSelected != lastIdSelected && props.cardSelected > 0) {
      console.log('loading card on editPage')
      setLastIdSelected(props.cardSelected)

      //TODO: switch this to an API call for the individual ID
      console.log('getting items on editpage')

      console.log(props.scheduleItems)
      ScheduleItemAPI.getPatient()
        .then(scheduleItems => {
          //TODO: switch this to an API call for the individual ID
          console.log('getting items on editpage')

          console.log(scheduleItems)
          let filteredScheduleItems = scheduleItems.success.rows.filter(
            item => {
              // console.log(item)
              console.log('check iteration')
              console.log(item.schedule_item_id)
              console.log(props.cardSelected)
              return parseInt(item.schedule_item_id) == props.cardSelected
            }
          )

          const content = filteredScheduleItems[0]

          console.log('matching cards')
          console.log(content)

          setName(content.task)
          setDescription(content.description)

          let contentDate = new Date(content.start_timestamp)
          setStartDate(contentDate)

          let quarterHours =
            Math.floor(contentDate.getHours() * 4) +
            Math.floor(contentDate.getMinutes() / 15)

          setStartTime(quarterHours)

          console.log('patient id')
          console.log(content.patient_id)
          console.log(parseInt(content.patient_id))

          setPatientId(parseInt(content.patient_id))
          setDurationQuarterHour(content.estimated_duration_minutes)
        })
        .catch(e => {
          console.log(e)
        })
    }
  })

  function formatStartTime() {
    const time = new Date()
    time.setHours(Math.floor(startTime / 4))
    time.setMinutes((startTime % 4) * 15)
    console.log(time)
    console.log(dayjs(time))
    return dayjs(time)
  }

  async function createEvent() {
    let startTimeStamp = new Date(startDate)
    startTimeStamp.setHours(Math.floor(startTime / 4))
    startTimeStamp.setMinutes((startTime % 4) * 15)

    if(name.length === 0 || startDate.length === 0 || startTime.length === 0 ) {
      setMessage(
        'This action could not be performed - please ensure the name, start date and time are filled out'
      )
      setMessageIcon('CROSS')
      setSeverity('error')
      return;
    }

    if (
      !(await ScheduleValidator.scheduleIsClear(
        startTimeStamp,
        duration,
        lastIdSelected
      ))
    ) {
      setMessage(
        'This overlaps with another item in your schedule. Please alter the date of this item or another.'
      )
      setMessageIcon('CROSS')
      setSeverity('error')
      return
    }

    if (props.cardSelected > 0) {
      ScheduleItemAPI.upsertPatient(
        'UPDATE',
        startTimeStamp.toISOString(),
        durationQuarterHour,
        patientId,
        name,
        description,
        'EVENT',
        props.cardSelected
      )
        .then(res => {
          console.log(res)
          setMessage(
            'Event successfully ' +
              (props.cardSelected === 0 || !props.cardSelected  ? 'created' : 'updated')
          )
          setMessageIcon('CHECK')
          setSeverity('success')
          props.refresh()
        })
        .catch(error => {
          console.log(error)
          setMessage(
            'There was an error and the event was not successfully ' +
              (props.cardSelected === 0 || !props.cardSelected  ? 'created' : 'updated') +
              ' - please try again later'
          )
          setMessageIcon('CROSS')
          setSeverity('error')
        })
      return
    }

    ScheduleItemAPI.upsertPatient(
      'INSERT',
      startTimeStamp.toISOString(),
      durationQuarterHour,
      patientId,
      name,
      description,
      'EVENT',
      null
    )
      .then(res => {
        console.log(res)
        setMessage(
          'Event successfully ' +
            (props.cardSelected === 0 ? 'created' : 'updated')
        )
        setMessageIcon('CHECK')
        setSeverity('success')
        props.refresh()
      })
      .catch(error => {
        console.log(error)
        setMessage(
          'There was an error and the event was not successfully ' +
            (props.cardSelected === 0 ? 'created' : 'updated') +
            ' - please try again later'
        )
        setMessageIcon('CROSS')
        setSeverity('error')
      })
  }

  function deleteEvent() {
    let startTimeStamp = new Date(startDate)
    startTimeStamp.setHours(Math.floor(startTime / 4))
    startTimeStamp.setMinutes((startTime % 4) * 15)

    ScheduleItemAPI.delete(lastIdSelected)
      .then(res => {
        console.log(res)
        setMessage('Task successfully deleted')
        setMessageIcon('CHECK')
        setSeverity('success')
        setShowDeleteDialog(false)
        props.refresh()
      })
      .catch(error => {
        console.log(error)
        setMessage(
          'There was an error and the task was not successfully deleted - please try again later'
        )
        setMessageIcon('CROSS')
        setSeverity('error')
        setShowDeleteDialog(false)
      })
  }

  function clearEvent() {
    //clear the task number
    props.clearSelectedCard()

    //remove any banners
    setMessage('')
  }

  return (
    <Box sx={{ padding: 1 }}>
      {showDeleteDialog && (
        <PropsConfirmationDialogue
          message="Are you sure you want to proceed?"
          proceedResponse="Delete"
          denyResponse="Don't delete"
          onProceed={deleteEvent}
          onClose={() => setShowDeleteDialog(false)}
          open={showDeleteDialog}
          value={showDeleteDialog}
        />
      )}
      {message.length == 0 ? null : (
        <Alert
          icon={<Check fontSize="inherit" />}
          sx={{ marginBottom: 2 }}
          severity={severity}
        >
          {message}
        </Alert>
      )}
      <Typography variant="h4">Event</Typography>
      {/* Form */}
      <Typography sx={{ marginTop: 1 }}>Event name</Typography>
      <TextField
        size="small"
        placeholder="Task name"
        value={name}
        onChange={e => setName(e.target.value)}
      ></TextField>

      <Typography sx={{ marginTop: 1 }}>Event description</Typography>
      <TextField
        size="small"
        placeholder="Task description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      ></TextField>

      <Typography sx={{ marginTop: 1 }}>Event start time</Typography>
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

        <Typography sx={{ marginTop: 1}}>
          Patient
          <Tooltip title="This is optional and associates a patient with the item.">
            <QuestionMark style={{width: 14}} />
          </Tooltip>
        </Typography>
        <PatientSearch setPatient={setPatientId} overWriteValue={patientId} />
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

        <Grid container sx={{ marginTop: 2 }}>
          <Grid item xs>
            <Button variant="contained" onClick={createEvent}>
              {props.cardSelected === 0 || !props.cardSelected
                ? 'Create'
                : 'Update'}
            </Button>
          </Grid>
          {props.cardSelected ? (
            <Grid item xs sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                sx={{ marginRight: 1 }}
                onClick={clearEvent}
                startIcon={<ClearAll />}
              >
                Empty Page
              </Button>
              <Button
                variant="outlined"
                // sx={{ display: 'block', marginTop: 2 }}
                onClick={() => setShowDeleteDialog(true)}
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </LocalizationProvider>
    </Box>
  )
}

export default EditEvent

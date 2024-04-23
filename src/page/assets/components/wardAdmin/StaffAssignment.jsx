import { Alert, Box, InputLabel, Typography } from '@mui/material'
import SimpleDatePicker from './SimpleDatePicker'
import { useEffect, useState } from 'react'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import StaffSwitchBoard from './StaffSwitchBoard'
import { getWindowHeight } from '../../../schedule/components/Util'

function StaffAssignment(props) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')

  const [windowHeight, setWindowHeight] = useState(getWindowHeight())

  useEffect(() => {
    function handleHeightResize() {
      setWindowHeight(getWindowHeight())
    }

    window.addEventListener('resize', handleHeightResize)
    return () => {
      window.removeEventListener('resize', handleHeightResize)
    }
  }, [props.ward])

  function toggleDatePicker() {
    setDatePickerOpen(!datePickerOpen)
  }

  function onNewDateAccepted(val) {
    setSelectedDate(val)
    toggleDatePicker()
  }

  function showAlertMessage(message, severity = 'success') {
    if (message === '') {
      setAlertOpen(false)
      return
    }
    setAlertMessage(message)
    setAlertOpen(true)
    setAlertSeverity(severity)
  }

  if (!props.ward) {
    return (
      <Typography
        variant="h6"
        sx={{ margin: 'auto', textAlign: 'center', marginTop: 10 }}
      >
        Please select a ward to continue
      </Typography>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: 'fit-content' }}>
          <InputLabel>Shift date</InputLabel>
          <SimpleDatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            toggleDatePicker={toggleDatePicker}
          />
        </Box>
        {alertOpen ? (
          <Alert
            sx={{
              width: '60%',
              height: 'fit-content',
              marginTop: 2.5,
              marginLeft: 2
            }}
            severity={alertSeverity}
          >
            {alertMessage}
          </Alert>
        ) : null}
      </Box>

      {/* Body */}

      {/* Date Picker */}
      <Box
        sx={
          datePickerOpen
            ? {}
            : { visibility: 'hidden', height: 0, overflow: 'hidden' }
        }
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            defaultValue={dayjs(selectedDate)}
            onAccept={val => onNewDateAccepted(val)}
            onClose={toggleDatePicker}
          />
        </LocalizationProvider>
      </Box>

      {/* Main Body */}
      <Box
        sx={
          !datePickerOpen
            ? { height: windowHeight / 1.5 }
            : {
                visibility: 'hidden',
                height: 0,
                overflow: 'hidden',
                height: windowHeight / 1.5
              }
        }
      >
        <StaffSwitchBoard
          showAlertMessage={showAlertMessage}
          date={selectedDate}
          ward={props.ward}
        />
      </Box>
    </Box>
  )
}

export default StaffAssignment

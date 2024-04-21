import { Alert, Box, InputLabel } from '@mui/material'
import SimpleDatePicker from './SimpleDatePicker'
import { useState } from 'react'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import StaffSwitchBoard from './StaffSwitchBoard'

function StaffAssignment(props) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')

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
            ? {}
            : { visibility: 'hidden', height: 0, overflow: 'hidden' }
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

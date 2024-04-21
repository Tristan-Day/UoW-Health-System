import { Alert, Box, InputLabel } from '@mui/material'
import CalendarNavbar from '../../../schedule/components/calendar/CalendarNavbar'
import SimpleDatePicker from './SimpleDatePicker'
import { useState } from 'react'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import StaffSwitchBoard from './StaffSwitchBoard'

function StaffAssignment() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  function toggleDatePicker() {
    setDatePickerOpen(!datePickerOpen)
  }

  function onNewDateAccepted(val) {
    setSelectedDate(val)
    toggleDatePicker()
  }

  return (
    <Box>
      <Box sx={{display: 'flex'}}>
        <Box sx={{width: 'fit-content'}}>
          <InputLabel>Shift date</InputLabel>
          <SimpleDatePicker
            date={selectedDate}
            setDate={setSelectedDate}
            toggleDatePicker={toggleDatePicker}
          />
        </Box>
        <Alert sx={{width: '60%', height: 'fit-content', marginTop: 2.5, marginLeft: 2}}>
          This is a test
        </Alert>
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
        <StaffSwitchBoard />
      </Box>
    </Box>
  )
}

export default StaffAssignment

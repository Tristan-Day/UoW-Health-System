import { Box } from '@mui/material'
import CalendarNavbar from './CalendarNavbar'
import { useState } from 'react'
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const CALENDAR = 'CALENDAR'
const DATE_PICKER = 'DATE_PICKER'
const SEARCH = 'SEARCH'

function Calendar(props) {
  const [page, setPage] = useState(CALENDAR)
  const [dateStr, setDateStr] = useState(new Date())

  function toggleDatePicker(date) {
    if (page !== DATE_PICKER) {
      setPage(DATE_PICKER)
    } else {
      setDateStr(date)
      setPage(CALENDAR)
    }
  }

  function onNewDateAccepted(val) {
    let newDate = new Date(val.$d)
    toggleDatePicker(newDate)
  }

  return (
    <Box>
      <CalendarNavbar
        openCreatePage={props.openCreatePage}
        toggleDatePicker={toggleDatePicker}
        date={dateStr}
        setDate={setDateStr}
      />
      {page === DATE_PICKER ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            defaultValue={dayjs(dateStr)}
            onAccept={val => onNewDateAccepted(val)}
          />
        </LocalizationProvider>
      ) : null}
    </Box>
  )
}

export default Calendar

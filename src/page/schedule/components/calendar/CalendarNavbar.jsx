import {
  ArrowBack,
  ArrowForward,
  ChevronLeft,
  ChevronRight,
  Refresh
} from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { DIRECTION, decrementDate, incrementDate, toTwoDigits } from '../Util'

function CalendarNavbar(props) {
  const [searchValue, setSearchValue] = useState('')

  function openCreatePage() {
    props.openCreatePage()
  }

  function onSearchBarChange(e) {
    setSearchValue(e.target.value)
  }

  function getDateString() {
    const dateObj = new Date(props.date)
    return (
      toTwoDigits(dateObj.getDate()) +
      '/' +
      toTwoDigits(dateObj.getMonth() + 1) +
      '/' +
      dateObj.getFullYear()
    )
  }

  function moveToPeripheralDate(direction) {
    if (direction === DIRECTION.NEXT) {
      props.setDate(incrementDate(props.date))
    }

    if (direction === DIRECTION.PREVIOUS) {
      props.setDate(decrementDate(props.date))
    }
  }

  function toggleDatePicker() {
    props.toggleDatePicker(props.date)
  }

  return (
    <Box>
      <Grid container>
        <Grid item>
          <IconButton
            aria-label="toggle edit page open"
            onClick={openCreatePage}
            sx={{ marginLeft: 1 }}
          >
            <Tooltip title="Toggle editing and creating page open and closed">
              {props.editPageOpen ? <ArrowBack /> : <ArrowForward />}
            </Tooltip>
          </IconButton>
        </Grid>
        <Grid item xs>
          <Divider orientation="vertical" sx={{ paddingLeft: 1 }} />
        </Grid>
        <Grid item>
          <IconButton
            aria-label="refresh"
            onClick={props.refresh}
            sx={{ marginLeft: 1 }}
          >
            <Tooltip title="Refresh">
              <Refresh />
            </Tooltip>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="previous date"
            onClick={() => moveToPeripheralDate(DIRECTION.PREVIOUS)}
          >
            <Tooltip title="Previous day">
              <ChevronLeft />
            </Tooltip>
          </IconButton>
        </Grid>
        <Grid item>
          <Tooltip title="Open date picker">
            <Button onClick={toggleDatePicker}>{getDateString()}</Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="next date"
            onClick={() => moveToPeripheralDate(DIRECTION.NEXT)}
          >
            <Tooltip title="Next day">
              <ChevronRight />
            </Tooltip>
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CalendarNavbar

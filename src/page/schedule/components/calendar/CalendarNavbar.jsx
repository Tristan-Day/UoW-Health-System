import { ArrowBack, ArrowForward, ChevronLeft, ChevronRight, Refresh } from '@mui/icons-material'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
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
          <IconButton aria-label="toggle edit page open" onClick={openCreatePage} sx={{marginLeft: 1}}>
          { props.editPageOpen ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        </Grid>
        <Grid item xs>
          <Divider
            orientation="vertical"
            sx={{ paddingLeft: 1}}
          />
        </Grid>
        <Grid item>
          <IconButton aria-label="refresh" onClick={props.refresh} sx={{marginLeft: 1}}>
           <Refresh />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="previous date"
            onClick={() => moveToPeripheralDate(DIRECTION.PREVIOUS)}
          >
            <ChevronLeft />
          </IconButton>
        </Grid>
        <Grid item>
          <Button onClick={toggleDatePicker}>{getDateString()}</Button>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="next date"
            onClick={() => moveToPeripheralDate(DIRECTION.NEXT)}
          >
            <ChevronRight />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}

export default CalendarNavbar

import { ArrowBack, ArrowForward, ChevronLeft, ChevronRight } from '@mui/icons-material'
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
      toTwoDigits(dateObj.getMonth()) +
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
          <IconButton aria-label="open edit page" onClick={openCreatePage}>
          { props.editPageOpen ? <ArrowBack /> : <ArrowForward />}
          </IconButton>
        </Grid>
        <Grid item>
          <Divider
            orientation="vertical"
            sx={{ paddingLeft: 1}}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{ paddingLeft: 1, paddingRight: 1 }}
            size="small"
            value={searchValue}
            onChange={e => onSearchBarChange(e)}
          />
        </Grid>
        <Grid item xs>
          <Button>Search</Button>
        </Grid>
        <Grid item>
          <IconButton
            aria-label="open edit page"
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
            aria-label="open edit page"
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

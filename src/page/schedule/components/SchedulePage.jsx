import { Box, Divider, Grid, Typography } from '@mui/material'
import { BreadcrumbGenerator } from '../../../components'
import { useEffect, useRef, useState } from 'react'
import Calendar from './calendar/Calendar'
import EditPage from './calendar/EditPage'
import { getWindowWidth } from './Util'

function SchedulePage() {
  const [editPageOpen, setEditPageOpen] = useState(true)
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function isLargeScreen(size) {
    console.log(size)
    return size > 1200
  }

  function canShowEditPage(size) {
    return editPageOpen
  }

  //conditional rendering based on mobile and desktop screen sizes
  function canShowCalendarPage(size) {
    return isLargeScreen(size) || (!isLargeScreen(size) && !canShowEditPage())
  }

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">Schedule</Typography>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      {/* High level components */}
      <Box>
        <Grid container spacing={0}>
          {canShowEditPage(windowWidth) ? (
            <Grid item xs>
              {/* EditPage */}
              <EditPage closePage={() => setEditPageOpen(false)} />
            </Grid>
          ) : null}
          {canShowCalendarPage(windowWidth) ? (
            <Grid item xs>
              {/* Calender */}
              <Calendar editPageOpen={editPageOpen} openCreatePage={() => setEditPageOpen(!editPageOpen)} />
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </Box>
  )
}

export default SchedulePage

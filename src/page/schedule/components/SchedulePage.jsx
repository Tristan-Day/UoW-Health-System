import { Box, Divider, Grid, Typography } from '@mui/material'
import { BreadcrumbGenerator } from '../../../components'
import { useEffect, useRef, useState } from 'react'
import Calendar from './calendar/Calendar'
import EditPage from './calendar/EditPage'
import { getWindowWidth } from './Util'
import ScheduleItemAPI from '../apis/ScheduleItemAPI'

function SchedulePage() {
  const [editPageOpen, setEditPageOpen] = useState(true)
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())
  const [cardSelected, setCardSelected] = useState(0)
  const [cardType, setCardType] = useState('TASK')

  const [scheduleItems, setScheduleItems] = useState([])

  useEffect(() => {

    refreshScheduleItems();

    function handleResize() {
      setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function refreshScheduleItems() {
    //get items from API
    ScheduleItemAPI.getPatient()
      .then(res => {
        console.log(res.success.rows);
        setScheduleItems([]);
        setScheduleItems(res.success.rows)
      })
      .catch(e => {
        console.log(e)
      })
  }

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

  function onCardClicked(id, type) {
    console.log(id + ' : ' + type)
    setCardSelected(parseInt(id))
    setCardType(type)
    setEditPageOpen(true)
  }

  function clearSelectedCard() {
    setCardSelected(0)
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
              <EditPage
                cardSelected={cardSelected}
                cardType={cardType}
                clearSelectedCard={clearSelectedCard}
                closePage={() => setEditPageOpen(false)}
                refresh={refreshScheduleItems}
              />
            </Grid>
          ) : null}
          {canShowCalendarPage(windowWidth) ? (
            <Grid item xs>
              {/* Calender */}
              <Calendar
                cardClicked={onCardClicked}
                cardType={cardType}
                editPageOpen={editPageOpen}
                openCreatePage={() => setEditPageOpen(!editPageOpen)}
                scheduleItems={scheduleItems}
                refresh={refreshScheduleItems}
              />
            </Grid>
          ) : null}
        </Grid>
      </Box>
    </Box>
  )
}

export default SchedulePage

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import { toTwoDigits } from '../Util'
import { useEffect, useState } from 'react'
import ScheduleItemAPI from '../../apis/ScheduleItemAPI'

function getHour(quarterHours) {
  let hours = Math.floor(quarterHours / 4)
  let remainder = (quarterHours % 4) * 15

  return toTwoDigits(hours) + ':' + toTwoDigits(remainder)
}

function CalendarItemCard(props) {
  let topOffset = 35 + props.quartersStart * 94
  let duration = 85 + (props.quartersDuration - 1) * 94
  let isEvent = props.isEvent && true

  let backgroundColour = isEvent ? { backgroundColor: '#0D47A1' } : null

  return (
    <Box
      style={{ position: 'absolute', left: '25%', right: 80, top: topOffset }}
    >
      <Card
        style={{ height: duration, ...backgroundColour }}
        onClick={() => props.onClick(props.item)}
      >
        <CardContent sx={{ padding: 1 }}>
          <Typography variant="h6">{props.name}</Typography>
          <Typography variant="p">
            {getHour(props.quartersStart)} -{' '}
            {getHour(
              parseInt(props.quartersDuration) + parseInt(props.quartersStart)
            )}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

function DayDisplay(props) {
  const [items, setItems] = useState([])
  const [lastDate, setLastDate] = useState('')

  useEffect(() => {
    let equal = true
    // props.scheduleItems.forEach((item, index) => {
    //   console.log(JSON.stringify(item) + ' : ' + JSON.stringify(items))

    //   if (
    //     !(
    //       index < items.length &&
    //       JSON.stringify(item) === JSON.stringify(items[index])
    //     )
    //   ) {
    //     equal = false
    //   }
    // })

    if (props.scheduleItems.length != items.length) {
      equal = false
    }

    if (!equal) {
      refresh()
    }

    if (items.length === 0) {
      refresh()
    }

    if (lastDate != props.date) {
      refresh()
    }
  })

  function refresh() {
    // if (lastDate != props.date) {
    setLastDate(props.date)

    console.log(props.scheduleItems)
    let filteredScheduleItems = props.scheduleItems.filter(item => {
      let selectedDate = new Date(props.date)
      let queryDate = new Date(item.start_timestamp)

      let daysEqual = selectedDate.getDate() === queryDate.getDate()
      let monthsEqual = selectedDate.getMonth() === queryDate.getMonth()
      let yearsEqual = selectedDate.getFullYear() === queryDate.getFullYear()

      return daysEqual && yearsEqual && monthsEqual
    })

    console.log(filteredScheduleItems)
    setItems(filteredScheduleItems)
    // }
  }

  function renderBackground(date) {
    let items = [<Box height={20}></Box>]

    let quarterHours = 24 * 4

    for (let i = 0; i < quarterHours; i++) {
      items.push(
        <Divider textAlign="left" orientation="horizontal" variant="fullWidth">
          {getHour(i)}
        </Divider>
      )
      items.push(<Box style={{ height: 70 }}></Box>)
    }

    return items
  }

  return (
    <Box>
      <Box
        width={'100%'}
        sx={{
          height: window.innerHeight / 1.5,
          overflow: 'scroll',
          overflowX: 'hidden',
          position: 'relative'
        }}
      >
        <Box style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
          {renderBackground(props.dateStr)}
        </Box>

        {items.map(e => {
          const itemTimestamp = new Date(e.start_timestamp)
          let quartersStart =
            itemTimestamp.getHours() * 4 +
            Math.floor(itemTimestamp.getMinutes() / 15)
          let quartersDuration = e.estimated_duration_minutes
          return (
            <CalendarItemCard
              id={e.schedule_item_id}
              onClick={event =>
                props.cardClicked(e.schedule_item_id, e.item_type)
              }
              quartersStart={quartersStart}
              quartersDuration={quartersDuration}
              name={e.task}
              isEvent={e.item_type === 'EVENT'}
              item={e}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default DayDisplay

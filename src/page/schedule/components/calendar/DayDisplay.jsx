import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import { toTwoDigits } from '../Util'

function getHour(quarterHours) {
  let hours = Math.floor(quarterHours / 4)
  let remainder = (quarterHours % 4) * 15

  return toTwoDigits(hours) + ':' + toTwoDigits(remainder)
}

function CalendarItemCard(props) {
    let topOffset = 35 + (props.quartersStart * 94);
    let duration = 85 + ((props.quartersDuration - 1) * 94);
    let isEvent = props.isEvent && true;

    let backgroundColour = isEvent ? { backgroundColor: '#0D47A1'} : null;

    return <Box style={{ position: 'absolute', left: '25%', right:80, top: topOffset}}>
    <Card style={{height: duration,  ...backgroundColour  }}>
      <CardContent sx={{ padding: 1 }}>
        <Typography variant="h6">Meeting</Typography>
        <Typography variant="p">{getHour(props.quartersStart)} - {getHour(props.quartersDuration + props.quartersStart)}</Typography>
      </CardContent>
    </Card>
  </Box>;
}

function DayDisplay() {
  function renderItems() {}

  function renderBackground() {
    let items = [<Box height={20}></Box>]

    let quarterHours = 24 * 4

    for (let i = 0; i < quarterHours; i++) {
      items.push(
        <Divider textAlign="left" orientation="horizontal" variant="fullWidth">
          {getHour(i)}
        </Divider>
      )
      items.push(<Box style={{height: 70}}></Box>)
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
          {renderBackground()}
        </Box>

        <CalendarItemCard quartersStart={4} quartersDuration={4} isEvent={false} />
        <CalendarItemCard quartersStart={1} quartersDuration={2} isEvent={true} />
      </Box>
    </Box>
  )
}

export default DayDisplay

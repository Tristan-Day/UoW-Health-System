import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton
} from '@mui/material'
import { useEffect, useState } from 'react'
import EditTask from './EditTask'
import { getWindowHeight, getWindowWidth } from '../Util'
import { Close, Task } from '@mui/icons-material'
import ScheduleItemAPI from '../../apis/ScheduleItemAPI'
import EditEvent from './EditEvent'
import EditAppointment from './EditAppointment'

const TASK = 'TASK'
const EVENT = 'EVENT'
const APPOINTMENT = 'APPOINTMENT'

function EditPage(props) {
  const [page, setPage] = useState(TASK)
  const [lastCardSelected, setLastCardSelected] = useState(0);
  // const [selectedCardContent, setSelectedCardContent] = useState({})

  useEffect(() => {
    console.log("editPage")
    console.log(props.cardSelected + " : " + lastCardSelected);
    console.log("cardType: " + props.cardType);

    if(parseInt(props.cardSelected) != lastCardSelected) {
      setLastCardSelected(props.cardSelected);
      setPage(props.cardType);
    }
  })

  function getButtonType(type) {
    if (type === page) {
      return 'contained'
    } else {
      return 'outlined'
    }
  }

  function canDisplayClose() {
    return getWindowWidth() < 1200
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ height: (getWindowHeight() > 600 ? getWindowHeight() - 300 : getWindowHeight() / 2), overflowY: 'auto' }}>
          <Grid container sx={{ marginTop: 1 }}>
            <Grid item>
              <Button
                size='small'
                variant={getButtonType(TASK)}
                onClick={() => setPage(TASK)}
              >
                Task
              </Button>
            </Grid>
            <Grid item>
              <Divider
                orientation={'vertical'}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            </Grid>
            <Grid item>
              <Button
                size='small'
                variant={getButtonType(EVENT)}
                onClick={() => setPage(EVENT)}
              >
                Event
              </Button>
            </Grid>
            <Grid item>
              <Divider
                orientation={'vertical'}
                sx={{ marginLeft: 1, marginRight: 1 }}
              />
            </Grid>
            <Grid item xs>
              <Button
                size='small'
                variant={getButtonType(APPOINTMENT)}
                onClick={() => setPage(APPOINTMENT)}
              >
                Appointment
              </Button>
            </Grid>
            {canDisplayClose() ? (
              <Grid item xs sx={{ textAlign: 'right' }}>
                <IconButton
                  variant={getButtonType(EVENT)}
                  onClick={props.closePage}
                >
                  <Close />
                </IconButton>
              </Grid>
            ) : null}
          </Grid>
          <Divider orientation={'horizontal'} sx={{ marginTop: 1.2 }} />
          {page === TASK ? (
            <EditTask cardSelected={props.cardType === TASK ? lastCardSelected : null} clearSelectedCard={props.clearSelectedCard} refresh={props.refresh} />
          ) : null}
          {page === EVENT ? (
            <EditEvent cardSelected={props.cardType === EVENT ? lastCardSelected : null} clearSelectedCard={props.clearSelectedCard} refresh={props.refresh} />
          ) : null}
          {page === APPOINTMENT ? (
            <EditAppointment cardSelected={props.cardType === APPOINTMENT ? lastCardSelected : null} clearSelectedCard={props.clearSelectedCard} refresh={props.refresh} />
          ) : null}
        </Box>
      </CardContent>
    </Card>
  )
}

export default EditPage

import { Box, Button, Card, CardContent, Divider, Grid, IconButton } from '@mui/material'
import { useState } from 'react'
import EditTask from './EditTask'
import { getWindowWidth } from '../Util'
import { Close } from '@mui/icons-material'

const TASK = 'TASK'
const EVENT = 'EVENT'

function EditPage(props) {
  const [page, setPage] = useState(TASK)

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
    <Card sx={{ outerHeight: 250 }}>
      <CardContent>
        <Box sx={{ height: window.innerHeight / 1.5 }}>
          <Grid container sx={{ marginTop: 1 }}>
            <Grid item>
              <Button
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
            <Grid item xs>
              <Button
                variant={getButtonType(EVENT)}
                onClick={() => setPage(EVENT)}
              >
                Event
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
          {page === TASK ? <EditTask /> : null}
          {page === EVENT ? <EditTask /> : null}
        </Box>
      </CardContent>
    </Card>
  )
}

export default EditPage

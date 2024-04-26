import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Box
} from '@mui/material'

import { AuthenticationContext } from '../App'

function Landing() {
  const navigate = useNavigate()
  const permissions = useContext(AuthenticationContext).permissions

  const ScheduleTaskPages = {
    'Personal Schedule': {
      description: 'View and manage your personal schedule.',
      site: 'schedule/personal'
    },
    'My Tasks and Ward': {
      description: 'View and manage your tasks.',
      site: 'schedule/assignment'
    }
  }

  const HospitalItemPages = {
    'Hospital Admin': {
      description: 'Manage cleaning orders or manage the setup of the system.',
      site: 'assets'
    },
    Patients: {
      description: 'Manage actions and information relating to patients.',
      site: 'patients'
    },
    Staff: {
      description:
        'Manage administrative information about staff, including schedules and roles.',
      site: 'staff'
    },
    'Ward Admin': {
      description:
        'Manage ward orders and notes.',
      site: 'assets/ward-admin'
    }
  }

  function canShow(keyName) {
    if (
      permissions.includes('personal.view') &&
      keyName === 'Personal Schedule'
    ) {
      return true
    }

    if (permissions.includes('tasks.view') && keyName === 'My Tasks and Ward') {
      return true
    }

    if (permissions.includes('premises.view') && keyName === 'Hospital Admin') {
      return true
    }

    if (permissions.includes('patient.view') && keyName === 'Patients') {
      return true
    }

    if (permissions.includes('staff.view') && keyName === 'Staff') {
      return true
    }

    if (permissions.includes('ward.admin') && keyName === 'Ward Admin') {
      return true
    }

    return false
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem'
        }}
      >
        <img src='../Usability Graphic.png' width='55%'></img>
      </Box>

      <br />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          marginLeft: '7%',
          marginRight: '7%'
        }}
      >
        {/* <Typography variant='body' textAlign='center' alignSelf='center' maxWidth='70%'>
          Usability is a significant concern in Hospital Management Systems,
          where user control, flexibility and error prevention have not been
          adequately addressed. This application seeks to present a slice of a
          usable management system that addresses these concerns.
        </Typography> */}

        <Box>
          {(canShow('Personal Schedule') || canShow('My Tasks')) && (
            <Box>
              <Typography variant='h5'>My Schedule and Tasks</Typography>
              <Divider sx={{ marginBottom: '1.2rem', marginTop: '0.75rem' }} />
            </Box>
          )}
          <Grid container spacing={2}>
            {Object.keys(ScheduleTaskPages).map(function (key) {
              if (!canShow(key)) {
                return null
              }

              return (
                <Grid item>
                  <Card
                    sx={{ width: '20rem', minHeight: '7rem' }}
                    onClick={() => navigate(ScheduleTaskPages[key].site)}
                  >
                    <CardContent>
                      <Typography variant='h5' component='Box'>
                        {key}
                      </Typography>
                      <Typography variant='body2'>
                        {ScheduleTaskPages[key].description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        <Box>
          {(canShow('Hospital Admin') ||
            canShow('Patients') ||
            canShow('Staff')) && (
            <Box>
              <Typography variant='h5'>Hospital Items</Typography>
              <Divider sx={{ marginBottom: '1.2rem', marginTop: '0.75rem' }} />
            </Box>
          )}

          <Grid container spacing={2}>
            {Object.keys(HospitalItemPages).map(function (key) {
              if (!canShow(key)) {
                return null
              }

              return (
                <Grid item>
                  <Card
                    sx={{ width: '20rem', minHeight: '7rem' }}
                    onClick={() => navigate(HospitalItemPages[key].site)}
                  >
                    <CardContent>
                      <Typography variant='h5' component='Box'>
                        {key}
                      </Typography>
                      <Typography variant='body2'>
                        {HospitalItemPages[key].description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default Landing

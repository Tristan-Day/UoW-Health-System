import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Card,
  Typography,
  Button,
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
      description: 'Manage ward orders and notes.',
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

  const isMobileView = /iPhone|iPod|Android/i.test(navigator.userAgent)

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding="1rem"
      >
        <Typography variant={isMobileView ? 'h2' : 'h1'}>Welcome</Typography>
        <Typography variant="overline">
          Winchester Health Systems - A Usable HMS
        </Typography>
      </Box>
      <br/>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          marginLeft: '7%',
          marginRight: '7%'
        }}
      >
        <Box>
          {(canShow('Personal Schedule') || canShow('My Tasks')) && (
            <Box>
              <Typography variant={isMobileView ? 'h5' : 'h4'}>My Schedule and Tasks</Typography>
              <Divider sx={{ marginBottom: '1.2rem', marginTop: '0.75rem' }} />
            </Box>
          )}
          <Box display="flex" flexGrow={1} flexWrap="wrap" gap="1.5rem">
            {Object.keys(ScheduleTaskPages).map(function (key) {
              if (!canShow(key)) {
                return null
              }

              return (
                <Card
                  sx={{
                    flexGrow: 1,
                    flexBasis: 0,
                    minWidth: 'fit-content',
                    padding: '1rem'
                  }}
                >
                  <Typography variant="h6" component="div">
                    {key}
                  </Typography>

                  <Box sx={{ height: '4rem', overflow: 'hidden' }}>
                    <Typography variant="caption">
                      {ScheduleTaskPages[key].description}
                    </Typography>
                  </Box>

                  <Box display="flex" flexGrow={1} justifyContent="right">
                    <Button
                      onClick={() => {
                        navigate(ScheduleTaskPages[key].site)
                      }}
                      variant="outlined"
                    >
                      View
                    </Button>
                  </Box>
                </Card>
              )
            })}
          </Box>
        </Box>

        <Box>
          {(canShow('Hospital Admin') ||
            canShow('Patients') ||
            canShow('Staff')) && (
            <Box>
              <Typography variant={isMobileView ? 'h5' : 'h4'}>Hospital Items</Typography>
              <Divider sx={{ marginBottom: '1.2rem', marginTop: '0.75rem' }} />
            </Box>
          )}

          <Box display="flex" flexGrow={1} flexWrap="wrap" gap="1.5rem">
            {Object.keys(HospitalItemPages).map(function (key) {
              if (!canShow(key)) {
                return null
              }

              return (
                <Card
                  sx={{
                    flexGrow: 1,
                    flexBasis: 0,
                    minWidth: 'fit-content',
                    padding: '1rem'
                  }}
                >
                  <Typography variant="h6" component="div">
                    {key}
                  </Typography>

                  <Box sx={{ height: '4rem', overflow: 'hidden' }}>
                    <Typography variant="caption">
                      {HospitalItemPages[key].description}
                    </Typography>
                  </Box>

                  <Box display="flex" flexGrow={1} justifyContent="right">
                    <Button
                      onClick={() => {
                        navigate(HospitalItemPages[key].site)
                      }}
                      variant="outlined"
                    >
                      View
                    </Button>
                  </Box>
                </Card>
              )
            })}
          </Box>
          <br/>
        </Box>
      </Box>
    </Box>
  )
}

export default Landing

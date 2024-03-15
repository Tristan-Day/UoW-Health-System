import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthenticationContext } from '../App'

function Landing() {
  const navigate = useNavigate()
  const permissions = useContext(AuthenticationContext).permissions

  const ScheduleTaskPages = {
    'Personal Schedule': {
      description: 'View and manage your personal schedule.',
      site: 'schedule/personal'
    },
    'My Tasks': {
      description: 'View and manage your tasks.',
      site: 'schedule/tasks'
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
    }
  }

  function canShow(keyName) {
    if (
      permissions.includes('personal.view') &&
      keyName === 'Personal Schedule'
    ) {
      return true
    }

    if (permissions.includes('tasks.view') && keyName === 'My Tasks') {
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

    return false
  }

  return (
    <div style={{ margin: '1rem' }}>
      <img src="../logo-text.svg" width={200}></img>
      <br></br>
      <Typography variant="body">
        Major usability concerns in Hospital Management Systems in the areas of
        user control and flexibility, error prevention and flexibility and
        efficiency of use have been identified. The purpose of this application
        is to present a small slice of a hospital management system to present a
        prototype which addresses many of these concerns.
      </Typography>

      <br></br>
      <br></br>

      <div>
        {(canShow('Personal Schedule') || canShow('My Tasks')) && (
          <div>
            <h2>My Schedule and Tasks</h2>
            <hr></hr>
          </div>
        )}
        <Grid container spacing={2}>
          {Object.keys(ScheduleTaskPages).map(function (key) {
            console.log(key)

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
                    <Typography variant="h5" component="div">
                      {key}
                    </Typography>
                    <Typography variant="body2">
                      {ScheduleTaskPages[key].description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>

      <div>
        {(canShow('Hospital Admin') ||
          canShow('Patients') ||
          canShow('Staff')) && (
            <div>
              <h2>Hospital Items</h2>
              <hr></hr>
            </div>
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
                    <Typography variant="h5" component="div">
                      {key}
                    </Typography>
                    <Typography variant="body2">
                      {HospitalItemPages[key].description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default Landing

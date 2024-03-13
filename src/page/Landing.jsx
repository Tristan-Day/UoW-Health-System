import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

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
      description: 'Manage administrative information about staff, including schedules and roles.',
      site: 'staff'
    }
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h1>Welcome Back!</h1>

      <div>
        <h2>My Schedule and Tasks</h2>
        <hr></hr>
        <Grid container spacing={2}>
          {Object.keys(ScheduleTaskPages).map(function (key) {
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
        <h2>Hospital Items</h2>
        <hr></hr>
        <Grid container spacing={2}>
          {Object.keys(HospitalItemPages).map(function (key) {
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

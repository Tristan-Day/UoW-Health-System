import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'

const Pages = {
  'Personal Schedule': {
    description: 'Manage your personal schedule.',
    site: 'personal'
  },
  'Task Management': {
    description: 'Assign and amend patient prescriptions.',
    site: 'tasks'
  }
}

const Links = () => {
  return <IndexGenerator title="Schedule Management" contents={Pages} />
}

const Schedule = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const ScheduleRoutes = (
  <Route path="schedule" element={<Schedule />}>
    <Route index path="*" element={<Links />} />

    <Route path="personal" element={<h1>My Schedule</h1>} />
    <Route path="tasks" element={<h1>Task Management</h1>} />
  </Route>
)

export { ScheduleRoutes }

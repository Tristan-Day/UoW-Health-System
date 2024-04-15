import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import { IndexGenerator } from '../../components'
import { useContext } from 'react'
import { AuthenticationContext } from '../../App'
import Events from './Events'
import ScheduleItemForm from './page/ScheduleItemForm'
const Links = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const pages = {}

  if (permissions.includes('personal.view')) {
    pages['Personal Schedule'] = {
      description: 'Manage your personal schedule.',
      site: 'personal'
    }
  }

  if (permissions.includes('tasks.view')) {
    pages['Task Management'] = {
      description: 'Assign and amend patient prescriptions.',
      site: 'tasks'
    }
  }
  if (permissions.includes('events.view')) {
    pages['Events Management'] = {
      description: 'Assign and amend patient prescriptions.',
      site: 'events'
    }
  }
  return <IndexGenerator title="Schedule Management" contents={pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const ScheduleRoutes = permissions => (
  <Route path="schedule" element={<Template />}>
    <Route index path="*" element={<Links />} />

    {permissions.includes('personal.view') ? (
      <Route path="personal" element={<h1>Schedules</h1>} />
    ) : null}

    {permissions.includes('tasks.view') ? (
      <Route path="tasks" element={<h1>Task Management</h1>} />
    ) : null}
     {permissions.includes('events.view') ? (
      <Route path="Events">
      <Route index element={<Events />} />
      <Route path="create" element={<ScheduleItemForm />} />
    </Route>
    ) : null}
 
  </Route>
)

export { ScheduleRoutes }

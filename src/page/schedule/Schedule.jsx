import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import { IndexGenerator } from '../../components'
import { useContext } from 'react'
import { AuthenticationContext } from '../../App'
import SchedulePage from './components/SchedulePage'
import WardAdmin from '../assets/WardAdmin'
import WardUser from '../assets/WardUser'

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
    <Route index path="*" element={<SchedulePage />} />

    <Route path="assignment">
      <Route index element={<WardUser />} />
    </Route>
  </Route>
)

export { ScheduleRoutes }

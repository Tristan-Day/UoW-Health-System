import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/IndexGenerator'

const Pages = {
  'Role Management': { description: 'Create and update staff roles.', site: 'roles' },
  'Staff List': { description: 'View, create, update and delete staff.', site: 'list' },
  'Schedule Management': { description: 'View, create, update and delete staff schedules.', site: 'schedules' },
}

const Links = () => {
  return (
    <IndexGenerator title="Staff Management" contents={Pages} />
  )
}

const Staff = () => {
  return (
    <Box style={{ padding: '2rem' }}>
      <Outlet />
    </Box>
  )
}

const StaffRoutes = (
  <Route path='staff' element={<Staff />}>
    <Route index path='*' element={<Links />} />

    <Route path='roles' element={<h1>Role Management</h1>} />
    <Route path='list' element={<h1>Staff List</h1>} />
    <Route path='schedules' element={<h1>Staff Schedule Management</h1>} />
  </Route>
)

export { StaffRoutes }
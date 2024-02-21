import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'

import { Roles, RoleDetails, RoleCreationForm, Staff } from '.'
import StaffCreationForm from './page/StaffCreationForm'

const Pages = {
  'Role Management': {
    description: 'Create and update staff roles.',
    site: 'roles'
  },
  'Staff List': {
    description: 'View, create, update and delete staff.',
    site: 'list'
  },
  'Schedule Management': {
    description: 'View, create, update and delete staff schedules.',
    site: 'schedules'
  }
}

const Links = () => {
  return <IndexGenerator title="Staff Management" contents={Pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const StaffRoutes = (
  <Route path="staff" element={<Template />}>
    <Route index path="*" element={<Links />} />

    <Route path="roles">
      <Route index element={<Roles />} />
      <Route path="create" element={<RoleCreationForm />} />
      <Route path=":identifier" element={<RoleDetails />} />
    </Route>

    <Route path="list">
      <Route index element={<Staff />} />
      <Route path="create" element={<StaffCreationForm />} />
    </Route>

    <Route path="schedules" element={<h1>Staff Schedule Management</h1>} />
  </Route>
)

export { StaffRoutes }

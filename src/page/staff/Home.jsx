import { Box } from '@mui/material'

import { useContext } from 'react'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'
import { AuthenticationContext } from '../../App'

import {
  Roles,
  RoleDetails,
  RoleCreationForm,
  Staff,
  StaffDetails,
  StaffCreationForm
} from '.'

const Links = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const pages = {}

  if (permissions.includes('roles.view')) {
    pages['Role Management'] = {
      description: 'Create and update staff roles.',
      site: 'roles'
    }
  }

  if (permissions.includes('staff.view')) {
    pages['Staff List'] = {
      description: 'View, create, update and delete staff.',
      site: 'list'
    }
  }

  return <IndexGenerator title="Staff Management" contents={pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const StaffRoutes = permissions => {
  return (
    <Route path="staff" element={<Template />}>
      <Route index path="*" element={<Links />} />

      {permissions.includes('roles.view') ? (
        <Route path="roles">
          <Route index element={<Roles />} />
          <Route path="create" element={<RoleCreationForm />} />
          <Route path=":identifier" element={<RoleDetails />} />
        </Route>
      ) : null}

      {permissions.includes('staff.view') ? (
        <Route path="list">
          <Route index element={<Staff />} />
          <Route path="create" element={<StaffCreationForm />} />
          <Route path=":identifier" element={<StaffDetails />} />
        </Route>
      ) : null}
    </Route>
  )
}

export { StaffRoutes }

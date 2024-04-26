import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'

const Pages = {
  'Treatment Appointments': {
    description: 'Create and cancel patient treatment appointments.',
    site: 'treatment-appointments'
  },
  'Prescription Management': {
    description: 'Assign and amend patient prescriptions.',
    site: 'treatment-prescriptions'
  },
  'Care Instructions': {
    description: 'Manage patient care instructions.',
    site: 'care-instructions'
  },
  'Care Orders': {
    description: 'Create, amend and delete patient care orders.',
    site: 'care-orders'
  }
}

const Links = () => {
  return <IndexGenerator title="Patient Management" contents={Pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const PatientRoutes = permissions => (
  <Route path="patients" element={<Template />}>
    <Route index path="*" element={<Links />} />

    {permissions.includes('appointments.view') ? (
      <Route
        path="treatment-appointments"
        element={<h1>Treatment Appointments</h1>}
      />
    ) : null}

    {permissions.includes('prescriptions.view') ? (
      <Route
        path="treatment-prescriptions"
        element={<h1>Prescription Management</h1>}
      />
    ) : null}

    {permissions.includes('care-instructions.view') ? (
      <Route path="care-instructions">
        <Route index element={<h1>Care Instructions</h1>} />
      </Route>
    ) : null}

    {permissions.includes('care-orders.view') ? (
      <Route path="care-orders">
        <Route index element={<h1>Care Orders</h1>} />
      </Route>
    ) : null}
  </Route>
)

export { PatientRoutes }

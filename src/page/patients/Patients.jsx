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

const Patients = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const PatientRoutes = (
  <Route path="patients" element={<Patients />}>
    <Route index path="*" element={<Links />} />

    <Route
      path="treatment-appointments"
      element={<h1>Treatment Appointments</h1>}
    />
    <Route
      path="treatment-prescriptions"
      element={<h1>Prescription Management</h1>}
    />
    <Route path="care-instructions" element={<h1>Care Instructions</h1>} />
    <Route path="care-orders" element={<h1>Care Orders</h1>} />
  </Route>
)

export { PatientRoutes }

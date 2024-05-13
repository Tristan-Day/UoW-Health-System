import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'
import PatientsPage from './patientPage'

const Pages = {
  'Patients': {
    description: 'Create, read, update and deleting patients.',
    site: 'patient'
  },
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

const PatientRoutes = permissions => {
  return (
    <Route path="patients" element={<Patients />}>
      <Route index path="*" element={<Links />} />

      {permissions.includes('treatments.view') ? (
        <Route path="treatments">
          <Route index element={<h1>Treatment Appointments</h1>} />
        </Route>
      ) : null}

      {permissions.includes('prescriptions.view') ? (
        <Route path="prescriptions">
          <Route index element={<h1>Prescription Management</h1>} />
        </Route>
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

      {permissions.includes('patient.view') ? (
        <Route path="patient">
          <Route index element={<PatientsPage />} />
        </Route>
      ) : null}

    </Route>
  )
}

export { PatientRoutes }

import { Box } from '@mui/material'

import { useContext } from 'react'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/generator/IndexGenerator'
import { AuthenticationContext } from '../../App'

import { Cleaning, Premises, RoomCreationForm, CleaningOrderForm } from '.'
import Wards from './Wards'
import WardCreationForm from './page/WardCreationForm'
import Treatments from './Treatments'
import TreatmentCreationForm from './page/TreatmentCreationForm'

const Links = () => {
  const permissions = useContext(AuthenticationContext).permissions
  const pages = {}

  if (permissions.includes('premises.view')) {
    pages['Premises Management'] = {
      description: 'Create, view, update and delete physical spaces.',
      site: 'premises'
    }
  }

  if (permissions.includes('cleaning.view')) {
    pages['Cleaning Orders'] = {
      description: 'Issue, view, fulfil and cancel hospital cleaning orders.',
      site: 'cleaning'
    }
  }

  pages['Ward Management'] = {
    description: 'Create, view, update and delete wards.',
    site: 'wards'
<<<<<<< HEAD
  },
  'Cleaning Orders': {
    description: 'Issue, view, fulfil and cancel hospital cleaning orders.',
    site: 'cleaning'
  },
  'Treatments': {
    description: 'Create, view, update and delete treatment services provided by the hopsital.',
    site: 'treatments'
=======
>>>>>>> c0265560e06dded77ab68f8c1b55eafa78ceac8a
  }

  return <IndexGenerator title="Asset Management" contents={pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const AssetRoutes = permissions => {
  return (
    <Route path="assets" element={<Template />}>
      <Route index path="*" element={<Links />} />

      {permissions.includes('cleaning.view') ? (
        <Route path="cleaning">
          <Route index element={<Cleaning />} />
          <Route path="create" element={<CleaningOrderForm />} />
        </Route>
      ) : null}

      {permissions.includes('premises.view') ? (
        <Route path="premises">
          <Route index element={<Premises />} />
          <Route path="create" element={<RoomCreationForm />} />
        </Route>
      ) : null}

<<<<<<< HEAD
    <Route path="wards">
      <Route index element={<Wards />} />
      <Route path="create" element={<WardCreationForm />} />
    </Route>

    <Route path="treatments">
      <Route index element={<Treatments />} />
      <Route path="create" element={<TreatmentCreationForm />} />
    </Route>

  </Route>
)
=======
      <Route path="wards" element={<h1>Ward Management</h1>} />
    </Route>
  )
}
>>>>>>> c0265560e06dded77ab68f8c1b55eafa78ceac8a

export { AssetRoutes }

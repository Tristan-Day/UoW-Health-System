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
import TreatmentCategories from './TreatmentCategories'
import TreatmentCategoriesCreationForm from './page/TreatmentCategoriesCreationForm'
import WardAdmin from './WardAdmin'

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

  if (permissions.includes('wards.view')) {
    pages['Ward Management'] = {
      description: 'Create, view, update and delete wards.',
      site: 'wards'
    }
  }

  if (permissions.includes('ward.admin')) {
    pages['Ward Admin'] = {
      description: 'Manage ward notes, orders and staff assignment for a shift',
      site: 'ward-admin'
    }
  }

  if (permissions.includes('treatments.view')) {
    pages['Treatments'] = {
      description:
        'Create, view, update and delete treatment services provided by the hopsital.',
      site: 'treatments'
    }
  }

  if (permissions.includes('treatment.categories.view')) {
    pages['Treatment Categories'] = {
      description:
        'Create, view, update and delete treatment categories within the hopsital.',
      site: 'treatment-categories'
    }
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

      {permissions.includes('wards.view') ? (
        <Route path="wards">
          <Route index element={<Wards />} />
          <Route path="create" element={<WardCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('treatments.view') ? (
        <Route path="treatments">
          <Route index element={<Treatments />} />
          <Route path="create" element={<TreatmentCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('treatment.categories.view') ? (
        <Route path="treatment-categories">
          <Route index element={<TreatmentCategories />} />
          <Route path="create" element={<TreatmentCategoriesCreationForm />} />
        </Route>
      ) : null}

      {permissions.includes('ward.admin') ? (
        <Route path="ward-admin">
          <Route index element={<WardAdmin />} />
        </Route>
      ) : null}
    </Route>
  )
}

export { AssetRoutes }

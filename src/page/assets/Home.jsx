import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/IndexGenerator'

import { Cleaning, Premises, RoomCreationForm, CleaningOrderForm } from '.'
import Wards from './Wards'

const Pages = {
  'Premises Management': {
    description: 'Create, view, update and delete physical spaces.',
    site: 'premises'
  },
  'Ward Management': {
    description: 'Create, view, update and delete wards.',
    site: 'wards'
  },
  'Cleaning Orders': {
    description: 'Issue, view, fulfil and cancel hospital cleaning orders.',
    site: 'cleaning'
  }
}

const Links = () => {
  return <IndexGenerator title="Asset Management" contents={Pages} />
}

const Template = () => {
  return (
    <Box style={{ padding: '1rem' }}>
      <Outlet />
    </Box>
  )
}

const AssetRoutes = (
  <Route path="assets" element={<Template />}>
    <Route index path="*" element={<Links />} />

    <Route path="cleaning">
      <Route index element={<Cleaning />} />
      <Route path="create" element={<CleaningOrderForm />} />
    </Route>

    <Route path="premises">
      <Route index element={<Premises />} />
      <Route path="create" element={<RoomCreationForm />} />
    </Route>

    <Route path="wards">
      <Route index element={<Wards />} />
      <Route path="create" element={<RoomCreationForm />} />
    </Route>

    <Route path="wards" element={<h1>Ward Management</h1>} />
  </Route>
)

export { AssetRoutes }

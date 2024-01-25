import { Box } from '@mui/material'
import { Outlet, Route } from 'react-router-dom'

import IndexGenerator from '../../components/IndexGenerator'
import { CleaningOrders } from './'

const Pages = {
  'Cleaning Orders': { description: 'Issue, view, fulfil and cancel hospital cleaning orders.', site: 'cleaning-orders' },
  'Physical Layout': { description: 'Create, view, update and delete physical spaces.', site: 'physical-layout' },
  'Ward Management': { description: 'Create, view, update and delete wards.', site: 'ward-management' },
}

const Links = () => {
  return (
    <IndexGenerator title="Premises Management" contents={Pages} />
  )
}

const Premises = () => {
  return (
    <Box style={{ padding: '2rem' }}>
      <Outlet />
    </Box>
  )
}

const PremisesRoutes = (
  <Route path='premises' element={<Premises />}>
    <Route index path='*' element={<Links />} />

    <Route path='cleaning-orders' element={<CleaningOrders />} />
    <Route path='physical-layout' element={<h1>Physical Layout</h1>} />
    <Route path='ward-management' element={<h1>Ward Management</h1>} />
  </Route>
)

export { PremisesRoutes }
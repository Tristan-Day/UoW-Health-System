import { Amplify } from 'aws-amplify'
import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { Home } from './page'

import { ScheduleRoutes } from './page/schedule'
import { PatientRoutes } from './page/patients'
import { AssetRoutes } from './page/assets'
import { StaffRoutes } from './page/staff'

import awsExports from './aws-exports'
Amplify.configure(awsExports)

// Autodetect Theme Preference
var theme = 'light'
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  theme = 'dark'
}

function App() {
  return (
    // Wrap all routes with Cognito Authentication
    <Authenticator>
      <BrowserRouter>
        <ThemeProvider theme={createTheme({ palette: { mode: theme } })}>
          <CssBaseline />
          <Routes>
            <Route path="*" element={<Home />}>
              {ScheduleRoutes} {PatientRoutes} {AssetRoutes} {StaffRoutes}
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </Authenticator>
  )
}

export default withAuthenticator(App)

import { Amplify } from 'aws-amplify'
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createContext, useEffect, useState } from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { Navigation, Authentication, Landing } from './page'
import { getAuthorisation } from './logic/authentication'

import { StaffRoutes, PatientRoutes, AssetRoutes, ScheduleRoutes } from './page'

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

export const AuthenticationContext = createContext({
  authorised: false,
  permissons: []
})

function App() {
  const [authorisation, setAuthorisation] = useState({
    authorised: false,
    permissions: []
  })

  useEffect(() => {
    getAuthorisation()
      .then(result => {
        setAuthorisation({
          authorised: true,
          permissions: result
        })
      })
      .catch(() =>
        setAuthorisation({
          authorised: false,
          permissions: []
        })
      )
  }, [])

  useEffect(() => {
    console.log(authorisation)
  }, [authorisation])

  return (
    <AuthenticationContext.Provider value={authorisation}>
      <Authenticator>
        <BrowserRouter>
          <ThemeProvider theme={createTheme({ palette: { mode: theme } })}>
            <CssBaseline />
            {authorisation.authorised ? (
              <Routes>
                <Route path="*" element={<Navigation />}>
                  <Route index path="*" element={<Landing />} />
                  {ScheduleRoutes(authorisation.permissions)} {PatientRoutes(authorisation.permissions)}
                  {AssetRoutes(authorisation.permissions)} {StaffRoutes(authorisation.permissions)}
                </Route>
              </Routes>
            ) : (
              <Authentication />
            )}
          </ThemeProvider>
        </BrowserRouter>
      </Authenticator>
    </AuthenticationContext.Provider>
  )
}

export default withAuthenticator(App)

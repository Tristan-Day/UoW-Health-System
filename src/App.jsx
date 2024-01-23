import '@aws-amplify/ui-react/styles.css'

import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Premises } from './page'

Amplify.configure(awsExports)

function App() {
  return (
    // Wrap all routes with Cognito authentication
    <Authenticator>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<h1>Welcome to the Hospital Management System</h1>} />
          <Route path='staff' element={<h1>Placeholder</h1>} />
          <Route path='premises' element={Premises()} />

          <Route path='patients' element={<h1>Placeholder</h1>} />
          <Route path='schedule' element={<h1>Placeholder</h1>} />

        </Routes>
      </BrowserRouter>
    </Authenticator>
  );
}

export default withAuthenticator(App)

{/* <Route path='settings' element={<Settings />}>
<Route path='*' element={<AccountOverview />} />
<Route path='animals' element={<PetOverview />} />
</Route> */}
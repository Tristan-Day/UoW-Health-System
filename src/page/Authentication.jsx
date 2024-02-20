import { Typography, Stack } from '@mui/material'

import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'

const Authentication = () => {
  const [user, setUser] = useState({ username: 'Loading...' })

  useEffect(() => {
    getCurrentUser()
      .then(result => {
        setUser(result)
      })
      .catch(() => {
        setUser({ username: 'Unable to determine User ID' })
      })
  }, [])

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h4">
        You are not yet Authorised to Access this System
      </Typography>
      <Typography variant="h5">
        Please send the following code to your system administrator
      </Typography>
      <Typography variant="h2" sx={{ paddingTop: '2rem' }}>
        {user.username}
      </Typography>
    </Stack>
  )
}

export default Authentication

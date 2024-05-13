import { Typography, Stack, CircularProgress, Box } from '@mui/material' // Import Box component
import { getCurrentUser } from 'aws-amplify/auth'
import { useEffect, useState } from 'react'

const Authentication = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getCurrentUser()
      .then(result => {
        setUser(result)
      })
      .catch(() => {
        setUser({ username: 'Unable to determine User ID' })
      })
  }, [])

  const isMobileView = /iPhone|iPod|Android/i.test(navigator.userAgent)

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {user ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '100%',
            padding: '2rem'
          }}
        >
          <Typography variant={isMobileView ? 'h5' : 'h4'}>
            Authorisation Pending
          </Typography>
          <Typography variant={isMobileView ? 'caption' : 'body'} sx={{ paddingTop: '1rem' }}>
            Please send the following code to your system administrator if this page does not disapear
          </Typography>
          <Typography variant={isMobileView ? 'overline' : 'h2'} sx={{ paddingTop: '2rem' }}>
            {user.username}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            height: '100%'
          }}
        >
          <Typography variant="h4">Checking Authorization</Typography>
          <CircularProgress />
        </Box>
      )}
    </Stack>
  )
}

export default Authentication

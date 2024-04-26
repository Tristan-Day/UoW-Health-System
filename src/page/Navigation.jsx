import { useState } from 'react'
import { signOut } from 'aws-amplify/auth'

import { Outlet, useNavigate } from 'react-router-dom'
import { styled, useTheme } from '@mui/material/styles'

import {
  Toolbar,
  ListItem,
  Box,
  ListItemIcon,
  ListItemButton,
  AppBar,
  List,
  Typography,
  IconButton,
  ListItemText,
  Divider,
  Drawer
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LogoutIcon from '@mui/icons-material/Logout'
import HomeIcon from '@mui/icons-material/Home'

import BusinessIcon from '@mui/icons-material/Business'
import LockPersonIcon from '@mui/icons-material/LockPerson'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'

const DrawerOverrides = {
  width: 300,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 300,
    boxSizing: 'border-box'
  }
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between'
}))

const DrawerContents = {
  'Schedule Management': { icon: <AssignmentTurnedInIcon />, site: 'schedule' },
  'Patient Management': { icon: <MonitorHeartIcon />, site: 'patients' },
  'Staff Management': { icon: <LockPersonIcon />, site: 'staff' },
  'Asset Management': { icon: <BusinessIcon />, site: 'assets' }
}

const Navigation = () => {
  const theme = useTheme()

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <Box>
      <AppBar
        position="static"
        sx={{ position: 'sticky', top: '0', zIndex: 100 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => {
              setOpen(true)
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Health System</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={DrawerOverrides}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" paddingLeft="0.5rem">
            Health System
          </Typography>
          <IconButton
            onClick={() => {
              setOpen(false)
            }}
          >
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem key="Home" disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/')
                setOpen(false)
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Homepage" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <List>
          {Object.keys(DrawerContents).map(function (key) {
            return (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(DrawerContents[key].site)
                    setOpen(false)
                  }}
                >
                  <ListItemIcon>{DrawerContents[key].icon}</ListItemIcon>
                  <ListItemText primary={key} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
        <Divider />
        <ListItemButton
          onClick={async () => {
            await signOut()
          }}
          style={{ position: 'absolute', bottom: '0', left: '0', right: '0' }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={'Logout'} />
        </ListItemButton>
      </Drawer>
      <Outlet />
    </Box>
  )
}

export default Navigation

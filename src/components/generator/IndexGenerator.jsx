import {
  Typography,
  Card,
  IconButton,
  Divider,
  Box,
  Button
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

import { useNavigate } from 'react-router-dom'
import BreadcrumbGenerator from './BreadcumbGenerator'

export default function IndexGenerator({ title, contents }) {
  const navigate = useNavigate()

  const IndexItem = ({ index }) => {
    return (
      <Card sx={{ flexGrow: 1, flexBasis: 0, flexShrink: 2, minWidth: 'fit-content', padding: '1rem' }}>
        <Typography variant="h6" component="div">
          {index}
        </Typography>

        <Box sx={{ height: '4rem', overflow: 'hidden' }}>
          <Typography variant="caption">
            {contents[index].description}
          </Typography>
        </Box>

        <Box display="flex" flexGrow={1} justifyContent="right">
          <Button
            onClick={() => {
              navigate(contents[index].site)
            }}
            variant="outlined"
          >
            View
          </Button>
        </Box>
      </Card>
    )
  }

  const isMobileView = /iPhone|iPod|Android/i.test(navigator.userAgent)

  return (
    <Box>
      <BreadcrumbGenerator />

      <Box display="flex" justifyContent="space-between">
        <Typography variant={isMobileView ? 'h4' : 'h3'}>{title}</Typography>

        {isMobileView ? (
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <Button variant="outlined" onClick={() => navigate('/')}>
            Return
          </Button>
        )}
      </Box>

      <Divider sx={{ marginTop: '1rem', marginBottom: '2rem' }} />

      <Box display="flex" flexWrap="wrap" gap="1.5rem" justifyContent='center'>
        {Object.keys(contents).map(function (key) {
          return <IndexItem key={key} index={key} />
        })}
      </Box>
    </Box>
  )
}

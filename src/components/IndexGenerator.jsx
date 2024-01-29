import {
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Box
} from '@mui/material'

import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from './BreadcumbGenerator'

const IndexGenerator = props => {
  const navigate = useNavigate()

  return (
    <Box>
      <BreadcrumbGenerator />
      <Typography variant="h4">{props.title}</Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '2rem' }} />

      <Grid container spacing={2}>
        {Object.keys(props.contents).map(function (key) {
          return (
            <Grid item>
              <Card
                sx={{ width: '20rem', minHeight: '7rem' }}
                onClick={() => {
                  navigate(props.contents[key].site)
                }}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {key}
                  </Typography>
                  <Typography variant="body2">
                    {props.contents[key].description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default IndexGenerator

import { useNavigate } from 'react-router-dom'
import { Typography, Card, CardContent, Grid, Divider } from '@mui/material'

import BreadCrumbGenerator from './Breadcumbs'

const IndexGenerator = (props) => {
  const navigate = useNavigate()

  return (
    <div>
      <BreadCrumbGenerator />
      <Typography variant='h4'>{props.title}</Typography>
      <Divider sx={{ marginTop: '1rem', marginBottom: '2rem' }} />
      <Grid container spacing={2}>
        {
          Object.keys(props.contents).map(function (key) {
            return (
              <Grid item>
                <Card sx={{ width: '20rem', minHeight: '7rem' }} onClick={() => { navigate(props.contents[key].site) }}>
                  <CardContent>
                    <Typography variant='h5' component='div'>
                      {key}
                    </Typography>
                    <Typography variant='body2'>
                      {props.contents[key].description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
    </div>
  )
}

export default IndexGenerator
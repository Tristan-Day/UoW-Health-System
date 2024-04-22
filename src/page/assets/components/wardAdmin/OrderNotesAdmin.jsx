import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  getWindowHeight,
  getWindowWidth
} from '../../../schedule/components/Util'
import { Add, Delete, Edit, Person } from '@mui/icons-material'
import { getCurrentUser } from '@aws-amplify/auth'
import { getStaff } from '../../../staff/logic/Personel'

function OrderNoteCard(props) {
  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex' }}>
          <Person sx={{ height: 1, alignSelf: 'center' }} />
          <Typography variant="p" sx={{ alignSelf: 'center', marginLeft: 1 }}>
            {props.author}
          </Typography>
          <IconButton
            children={<Edit />}
            sx={{
              marginLeft: 'auto',
              height: 1,
              alignSelf: 'center'
            }}
          ></IconButton>
          <IconButton
            children={<Delete />}
            sx={{ height: 1, alignSelf: 'center' }}
          ></IconButton>
        </Box>
        <Divider></Divider>
        <Typography variant="h6">{props.title}</Typography>
        <Typography variant="p">{props.content}</Typography>
      </CardContent>
    </Card>
  )
}

function OrderNotesAdmin() {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())
  const [windowHeight, setWindowHeight] = useState(getWindowHeight())

  const [notes, setNotes] = useState([
    {
      author: 'Ben Wright',
      title: 'This is the title',
      content: 'This is the content'
    },
    {
      author: 'Boris Johnson',
      title: 'Latin phrase',
      content: 'Linking latin phrase to answer to a question'
    }
  ])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    function handleWidthResize() {
      setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleWidthResize)

    function handleHeightResize() {
      setWindowHeight(getWindowHeight())
    }

    window.addEventListener('resize', handleHeightResize)
    return () => {
      window.removeEventListener('resize', handleWidthResize)
      window.removeEventListener('resize', handleHeightResize)
    }
  }, [])

  function isLargeScreen(size) {
    console.log(size)
    return size > 1200
  }

  async function addNote() {
    let userId = (await getCurrentUser()).userId

    // let staffInfo = await getStaff({identifier: userId});

    // console.log(staffInfo)
    setNotes([
      {
        author: 'Ben Wright',
        title: 'Example title',
        content: 'Example content'
      },
      ...notes
    ])
  }

  return (
    <Box>
      {isLargeScreen(windowWidth) ? (
        <Grid container spacing={0}>
          {/* Order */}
          <Grid item xs>
            <Box sx={{ height: (windowHeight * 2) / 3, overflow: 'auto' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h6">Orders</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: 10, marginLeft: 'auto' }}
                >
                  Add Order
                </Button>
              </Box>
              {orders.map(note => {
                return <OrderNoteCard />
              })}
            </Box>
          </Grid>
          <Grid item>
            <Divider
              orientation="vertical"
              sx={{ marginLeft: 2, marginRight: 2 }}
            ></Divider>
          </Grid>
          {/* Note */}
          <Grid item xs>
            <Box sx={{ height: (windowHeight * 2) / 3, overflow: 'auto' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h6">Notes</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: 10, marginLeft: 'auto' }}
                  onClick={addNote}
                >
                  Add Note
                </Button>
              </Box>
              {notes.map(note => {
                return (
                  <OrderNoteCard
                    title={note.title}
                    content={note.content}
                    author={note.author}
                  />
                )
              })}
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ height: (windowHeight * 2) / 3 }}>
          {/* Order */}
          <Box sx={{ height: windowHeight / 3, overflow: 'auto' }}>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h6">Orders</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ borderRadius: 10, marginLeft: 'auto' }}
              >
                Add Order
              </Button>
            </Box>
            {orders.map(note => {
              return <OrderNoteCard />
            })}
          </Box>
          <Divider></Divider>
          {/* Note */}
          <Box sx={{ height: windowHeight / 3, paddingTop: 2 }}>
            <Box sx={{ height: windowHeight / 3, overflow: 'auto' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h6">Notes</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: 10, marginLeft: 'auto' }}
                  onClick={addNote}
                >
                  Add Note
                </Button>
              </Box>
              {notes.map(note => {
                return (
                  <OrderNoteCard
                    title={note.title}
                    content={note.content}
                    author={note.author}
                  />
                )
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default OrderNotesAdmin

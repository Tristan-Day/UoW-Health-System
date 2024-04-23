import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  getWindowHeight,
  getWindowWidth
} from '../../../schedule/components/Util'
import { Add, Delete, Edit, Person, Save } from '@mui/icons-material'
import { getCurrentUser } from '@aws-amplify/auth'
import { getStaff, getUser } from '../../../staff/logic/Personel'
import OrderNotesAPI from '../../logic/OrderNotes'

function OrderNoteCard(props) {
  const [editMode, setEditMode] = useState(false)

  const [title, setTitle] = useState(props.title)
  const [content, setContent] = useState(props.content)

  function toggleEditMode() {
    setEditMode(!editMode)
  }

  async function saveChanges() {
    //use ID to update data object
    let userId = (await getCurrentUser()).userId

    let staffInfo = await getUser(userId)

    console.log(staffInfo)

    let res = await OrderNotesAPI.upsertOrderNotes(
      'UPDATE',
      props.ward,
      content,
      title,
      staffInfo.first_name + ' ' + staffInfo.last_name,
      props.type,
      props.id
    )

    toggleEditMode()
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex' }}>
          <Person sx={{ height: 1, alignSelf: 'center', paddingBottom: 1 }} />
          <Typography variant="p" sx={{ alignSelf: 'center', marginLeft: 1, paddingBottom: 1 }}>
            {props.author}
          </Typography>
          {props.admin === true ? (
            !editMode ? (
              <IconButton
                onClick={toggleEditMode}
                children={<Edit />}
                sx={{
                  marginLeft: 'auto',
                  height: 1,
                  alignSelf: 'center'
                }}
              ></IconButton>
            ) : (
              <IconButton
                onClick={saveChanges}
                children={<Save />}
                sx={{
                  marginLeft: 'auto',
                  height: 1,
                  alignSelf: 'center'
                }}
              ></IconButton>
            )
          ) : null}

          {props.admin === true ? (
            <IconButton
              onClick={() => props.onDelete(props.id)}
              children={<Delete />}
              sx={{ height: 1, alignSelf: 'center' }}
            ></IconButton>
          ) : null}
        </Box>
        <Divider></Divider>
        {!editMode ? (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {title}
          </Typography>
        ) : (
          <Box>
            <TextField
              size="small"
              label="Title"
              sx={{ marginTop: 2 }}
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
            ></TextField>
          </Box>
        )}
        {!editMode ? (
          <Typography variant="p" sx={{ marginTop: 2 }} multiline>
            {content}
          </Typography>
        ) : (
          <Box>
            <TextField
              size="small"
              label="Content"
              sx={{ marginTop: 2 }}
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              fullWidth
              multiline
            ></TextField>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

function OrderNotesAdmin(props) {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())
  const [windowHeight, setWindowHeight] = useState(getWindowHeight())

  const [notes, setNotes] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    function handleWidthResize() {
      setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleWidthResize)

    function handleHeightResize() {
      setWindowHeight(getWindowHeight())
    }

    getItems()

    window.addEventListener('resize', handleHeightResize)
    return () => {
      window.removeEventListener('resize', handleWidthResize)
      window.removeEventListener('resize', handleHeightResize)
    }
  }, [props.ward])

  async function getItems() {
    let res = await OrderNotesAPI.getOrderNotes(props.ward)

    let filteredNotes = res.success.rows.filter(item => {
      return item.type === 'NOTE'
    })

    setNotes(filteredNotes)

    let filteredOrders = res.success.rows.filter(item => {
      return item.type === 'ORDER'
    })

    setOrders(filteredOrders)
  }

  function isLargeScreen(size) {
    console.log(size)
    return size > 1200
  }

  async function addNote() {
    let userId = (await getCurrentUser()).userId

    let staffInfo = await getUser(userId)

    let res = await OrderNotesAPI.upsertOrderNotes(
      'INSERT',
      props.ward,
      'TITLE',
      'CONTENT',
      staffInfo.first_name + ' ' + staffInfo.last_name,
      'NOTE',
      null
    )

    console.log(res)

    getItems()
  }

  async function addOrder() {
    let userId = (await getCurrentUser()).userId

    let staffInfo = await getUser(userId)

    let res = await OrderNotesAPI.upsertOrderNotes(
      'INSERT',
      props.ward,
      'TITLE',
      'CONTENT',
      staffInfo.first_name + ' ' + staffInfo.last_name,
      'ORDER',
      null
    )

    console.log(res)

    getItems()
  }

  async function removeCard(id) {
    let res = await OrderNotesAPI.deleteOrderNotes(parseInt(id))

    if ('success' in res) {
      getItems()
    }
  }

  if (!props.ward) {
    return (
      <Typography
        variant="h6"
        sx={{ margin: 'auto', textAlign: 'center', marginTop: 10 }}
      >
        Please select a ward to continue
      </Typography>
    )
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
                {props.admin === true ? (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: 10, marginLeft: 'auto' }}
                    onClick={addOrder}
                  >
                    Add Order
                  </Button>
                ) : null}
              </Box>
              {orders.map((note, index) => {
                return (
                  <OrderNoteCard
                    id={note.id}
                    title={note.title}
                    content={note.description}
                    author={note.author_name}
                    onDelete={removeCard}
                    ward={props.ward}
                    type={note.type}
                    admin={props.admin}
                  />
                )
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
                {props.admin === true ? (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: 10, marginLeft: 'auto' }}
                    onClick={addNote}
                  >
                    Add Note
                  </Button>
                ) : null}
              </Box>
              {notes.map((note, index) => {
                return (
                  <OrderNoteCard
                    id={note.id}
                    title={note.title}
                    content={note.description}
                    author={note.author_name}
                    onDelete={removeCard}
                    ward={props.ward}
                    type={note.type}
                    admin={props.admin}
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
              {props.admin === true ? (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ borderRadius: 10, marginLeft: 'auto' }}
                  onClick={addOrder}
                >
                  Add Order
                </Button>
              ) : null}
            </Box>
            {orders.map((note, index) => {
              return (
                <OrderNoteCard
                  id={note.id}
                  title={note.title}
                  content={note.description}
                  author={note.author_name}
                  onDelete={removeCard}
                  ward={props.ward}
                  type={note.type}
                  admin={props.admin}
                />
              )
            })}
          </Box>
          <Divider></Divider>
          {/* Note */}
          <Box sx={{ height: windowHeight / 3, paddingTop: 2 }}>
            <Box sx={{ height: windowHeight / 3, overflow: 'auto' }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h6">Notes</Typography>
                {props.admin === true ? (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ borderRadius: 10, marginLeft: 'auto' }}
                    onClick={addNote}
                  >
                    Add Note
                  </Button>
                ) : null}
              </Box>
              {notes.map((note, index) => {
                return (
                  <OrderNoteCard
                    id={note.id}
                    title={note.title}
                    content={note.description}
                    author={note.author_name}
                    onDelete={removeCard}
                    ward={props.ward}
                    type={note.type}
                    admin={props.admin}
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

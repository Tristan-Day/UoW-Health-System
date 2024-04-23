import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  InputLabel,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getStaff } from '../../../staff/logic/Personel'
import { CheckBox, Refresh } from '@mui/icons-material'
import ShiftAPI from '../../logic/Shifts'
import { getWindowHeight } from '../../../schedule/components/Util'

function StaffSwitchBoard(props) {
  const [staff, setStaff] = useState([])
  const [checkedList, setCheckedList] = useState([])
  const [shiftIdList, setShiftIdList] = useState(new Map([]))

  const [count, setCount] = useState(0)

  const [lastDate, setLastDate] = useState(new Date())

  const [windowHeight, setWindowHeight] = useState(getWindowHeight())

  useEffect(() => {
    if (count === 0) {
      getStaffFromDB()
      setCount(1)
    }

    if ('date' in props) {
      console.log(props.date)
      let propsDate = new Date(props.date)
      if (
        lastDate !=
        propsDate.getDate() +
          '/' +
          (propsDate.getMonth() + 1) +
          '/' +
          propsDate.getFullYear()
      ) {
        getShiftsByDate()
        setLastDate(
          propsDate.getDate() +
            '/' +
            (propsDate.getMonth() + 1) +
            '/' +
            propsDate.getFullYear()
        )
      }
    }
    function handleHeightResize() {
      setWindowHeight(getWindowHeight())
    }

    window.addEventListener('resize', handleHeightResize)
    return () => {
      window.removeEventListener('resize', handleHeightResize)
    }
  }, [props])

  async function getShiftsByDate() {
    props.showAlertMessage('')
    if (props.ward === '') {
      props.showAlertMessage('Please select a ward', 'error')
      return
    }

    try {
      let propsDate = new Date(props.date)
      const res = await ShiftAPI.getShift(
        propsDate.getDate() +
          '/' +
          (propsDate.getMonth() + 1) +
          '/' +
          propsDate.getFullYear()
      )

      if (res.success) {
        setCheckedList(
          res.success.rows.map(item => {
            return item.staff_id
          })
        )

        setShiftIdList(
          new Map(
            res.success.rows.map(item => {
              return [item.staff_id, item.shift_id]
            })
          )
        )
      }

      console.log(res)
    } catch (error) {
      console.log(error)
      setCheckedList([])
      props.showAlertMessage('Error loading shift information')
    }
  }

  async function addStaffToList(staffId, staffName) {
    try {
      let propsDate = new Date(props.date)
      const res = await ShiftAPI.upsertShift(
        'INSERT',
        props.ward,
        staffId,
        propsDate.getDate() +
          '/' +
          (propsDate.getMonth() + 1) +
          '/' +
          propsDate.getFullYear(),
        null
      )

      console.log(res)

      if (res.success) {
        let selectedDate = new Date(props.date)
        props.showAlertMessage(
          staffName +
            ' has been added to the shift on ' +
            selectedDate.getDate() +
            '/' +
            (selectedDate.getMonth() + 1) +
            '/' +
            selectedDate.getFullYear()
        )

        setCheckedList([...checkedList, staffId])
      }

      if (res.failure) {
        props.showAlertMessage('there was an error, please try again')
        return
      }
    } catch (error) {
      props.showAlertMessage('there was an error, please try again')
      return
    }
  }

  async function removeStaffFromList(staffId, staffName, shiftId) {
    try {
      console.log('shift id')
      console.log(shiftIdList.get(staffId))

      const res = await ShiftAPI.deleteShift(shiftIdList.get(staffId))

      console.log(res)

      if ('success' in res) {
        let selectedDate = new Date(props.date)
        props.showAlertMessage(
          staffName +
            ' has been removed from the shift on ' +
            selectedDate.getDate() +
            '/' +
            (selectedDate.getMonth() + 1) +
            '/' +
            selectedDate.getFullYear()
        )

        let alteredCheckList = [...checkedList]
        alteredCheckList.splice(checkedList.indexOf(staffId), 1)
        setCheckedList(alteredCheckList)
      }

      if (res.failure) {
        props.showAlertMessage('there was an error, please try again')
        return
      }
    } catch (error) {
      props.showAlertMessage('there was an error, please try again')
      return
    }
  }

  const columns = [
    {
      headerName: 'On Shift',
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => {
        if (checkedList.indexOf(params.row.staff_id) === -1) {
          return (
            <Button
              variant="outlined"
              onClick={() =>
                addStaffToList(
                  params.row.staff_id,
                  params.row.first_name + ' ' + params.row.last_name
                )
              }
            >
              ADD TO SHIFT
            </Button>
          )
        }
        return (
          <Button
            variant="contained"
            onClick={() =>
              removeStaffFromList(
                params.row.staff_id,
                params.row.first_name + ' ' + params.row.last_name
              )
            }
          >
            REMOVE FROM SHIFT
          </Button>
        )
      }
    },
    {
      field: 'identifier',
      headerName: 'ID',
      width: 200,
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      width: 130
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      width: 130
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      width: 250,
      disableColumnMenu: true,
      sortable: false
    },
    {
      field: 'phone_number',
      headerName: 'Phone Number',
      width: 250,
      disableColumnMenu: true,
      sortable: false
    }
  ]

  async function getStaffFromDB() {
    try {
      const staffFromDB = await getStaff()
      setStaff(
        staffFromDB.map(user => ({
          ...user,
          id: user.staff_id,
          identifier: user.staff_id
        }))
      )
    } catch (error) {
      console.log(error)
      setStaff([])
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <InputLabel sx={{ marginBotton: 2, marginTop: 2 }}>
          Staff on shift on this ward today
        </InputLabel>
        <Button
          startIcon={<Refresh />}
          sx={{ marginLeft: 'auto' }}
          onClick={getShiftsByDate}
        >
          Refresh page
        </Button>
      </Box>

      <DataGrid
        sx={{ height: windowHeight / 2 }}
        rows={staff}
        columns={columns}
        disableRowSelectionOnClick
      ></DataGrid>
    </Box>
  )
}

export default StaffSwitchBoard

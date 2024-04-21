import {
  Box,
  Button,
  FormControlLabel,
  InputLabel,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getStaff } from '../../../staff/logic/Personel'
import { CheckBox } from '@mui/icons-material'

function StaffSwitchBoard(props) {
  const [staff, setStaff] = useState([])
  const [checkedList, setCheckedList] = useState([])

  useEffect(() => {
    getStaffFromDB()
  }, [])

  async function addStaffToList(staffId, staffName) {
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

  async function removeStaffFromList(staffId, staffName) {
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

  const columns = [
    {
      headerName: 'On Shift',
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: params => {
        console.log(params.row)
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
      <InputLabel sx={{ marginBotton: 2, marginTop: 2 }}>
        Staff on shift on this ward today
      </InputLabel>
      <DataGrid
        rows={staff}
        columns={columns}
        disableRowSelectionOnClick
        checkboxSelection
      ></DataGrid>
    </Box>
  )
}

export default StaffSwitchBoard

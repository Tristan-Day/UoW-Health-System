import { Box, FormControlLabel, InputLabel, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { getStaff } from '../../../staff/logic/Personel'
import { CheckBox } from '@mui/icons-material'

const columns = [
  {
    headerName: 'On Shift',
    width: 200,
    disableColumnMenu: true,
    sortable: false,
    renderCell: params => {
      console.log(params.row)
      return (
        <FormControlLabel
          control={<CheckBox />}
          label="Include in shift"
          labelPlacement="end"
          sx={{ marginLeft: 0 }}
        ></FormControlLabel>
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

function StaffSwitchBoard() {
  const [staff, setStaff] = useState([])

  useEffect(() => {
    getStaffFromDB()
  }, [])

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
      <DataGrid rows={staff} columns={columns}></DataGrid>
    </Box>
  )
}

export default StaffSwitchBoard

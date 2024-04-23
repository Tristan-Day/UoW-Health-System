import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { BreadcrumbGenerator } from '../../components'
import { useEffect, useState } from 'react'
import WardsAPI from './logic/Wards'
import StaffAssignment from './components/wardAdmin/StaffAssignment'
import OrderNotesAdmin from './components/wardAdmin/OrderNotesAdmin'

const STAFF_ASSIGNMENT = 'STAFF_ASSIGNMENT'
const ORDERS_NOTES = 'ORDERS_NOTES'

function WardUser() {
  const [page, setPage] = useState(ORDERS_NOTES)
  const [wards, setWards] = useState([])

  const [selectedWard, setSelectedWard] = useState('')

  useEffect(() => {
    getWards()
  }, [])

  function getButtonStyling(buttonPage) {
    return buttonPage === page ? 'contained' : 'outlined'
  }

  async function getWards() {
    try {
      const res = await WardsAPI.getWard()
      console.log(res)
      if (res.rows) {
        setWards(res.rows)
      }
    } catch (error) {
      console.log(error)
      setWards([])
    }
  }

  return (
    <Box>
      {/* Header */}
      <BreadcrumbGenerator />
      <Typography variant="h4">Ward Orders and Notes</Typography>

      {/* Page navigation bar */}
      <Box sx={{ display: 'flex', marginTop: 1 }}>
        <Box>
          <InputLabel id="select-label">Ward</InputLabel>
          <Select
            id="ward-select"
            labelId="select-label"
            value={
              wards.length > 0 && selectedWard.length === ''
                ? wards[0].ward_id
                : selectedWard
            }
            size="small"
            placeholder="Select ward"
            onChange={e => setSelectedWard(e.target.value)}
          >
            {wards.map(ward => {
              return <MenuItem value={ward.ward_id}>{ward.ward_name}</MenuItem>
            })}
          </Select>
        </Box>
      </Box>

      <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

      {/* Body */}

      <OrderNotesAdmin ward={selectedWard} admin={false} />
    </Box>
  )
}

export default WardUser

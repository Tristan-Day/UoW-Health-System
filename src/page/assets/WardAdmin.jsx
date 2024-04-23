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

function WardAdmin() {
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
      <Typography variant="h4">Ward Administration</Typography>

      {/* Page navigation bar */}
      <Box sx={{ display: 'flex', marginTop: 1 }}>
        <Box sx={{ marginRight: 2 }}>
          <InputLabel id="button-label">Page</InputLabel>
          <ButtonGroup labelId="button-label" sx={{ marginTop: 0.25 }}>
            <Button
              variant={getButtonStyling(STAFF_ASSIGNMENT)}
              onClick={() => setPage(STAFF_ASSIGNMENT)}
            >
              Staff assignment
            </Button>
            <Button
              variant={getButtonStyling(ORDERS_NOTES)}
              onClick={() => setPage(ORDERS_NOTES)}
            >
              Orders / Notes
            </Button>
          </ButtonGroup>
        </Box>

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

      {/* Staff assignment page */}
      <Box
        sx={
          page === STAFF_ASSIGNMENT
            ? {}
            : { visibility: 'hidden', height: 0, overflow: 'hidden' }
        }
      >
        <StaffAssignment ward={selectedWard} />
      </Box>

      {/* Order and Notes page */}
      <Box
        sx={
          page === ORDERS_NOTES
            ? {}
            : { visibility: 'hidden', height: 0, overflow: 'hidden' }
        }
      >
        <OrderNotesAdmin ward={selectedWard} />
      </Box>
    </Box>
  )
}

export default WardAdmin

import {
    Typography,
    Box,
    Divider,
    TextField,
    Button,
    Stack,
    Autocomplete,
    Fab,
    Grow,
    Alert,
    Icon
} from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { BreadcrumbGenerator, Spinbox } from '../../../components'
//   import { getBuildings, createPremises } from '../logic/Premises'
import { MaterialIconPicker } from 'react-material-icon-picker'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { ArrowDropDown } from '@mui/icons-material'
import ScheduleItemAPI from '../logic/ScheduleItemAPI'
import EditScheduleItem from '../components/EditScheduleItem'

const ScheduleItemForm = props => {
    const [message, setMessage] = useState({})

    const navigate = useNavigate()
    const location = useLocation()

    console.log('props')
    console.log(location.state)

    let action = 'CREATE'
    if (
        location.state &&
        location.state.action &&
        location.state.action === 'UPDATE'
    ) {
        action = 'UPDATE'
    }

    let id = (location.state == null ? 0 : location.state.schedule_item_id)

    return (
        <Box>
            <BreadcrumbGenerator />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h4">
                    {action === 'UPDATE' ? 'Update' : 'Create'} a Schedule Item
                </Typography>
                <Button onClick={() => navigate(-1)}>Return</Button>
            </Box>
            <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

            <EditScheduleItem cardSelected={id} />

        </Box>
    )
}

export default ScheduleItemForm

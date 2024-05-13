import {
    Typography,
    Box,
    Divider,
    Button,
    Grow,
    Checkbox,
    FormControlLabel
} from '@mui/material'

import { DataGrid } from '@mui/x-data-grid'
import Alert from '@mui/material/Alert'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import BreadcrumbGenerator from '../../components/generator/BreadcumbGenerator'
import { AuthenticationContext } from '../../App'
import { Searchbox } from '../../components'

// import { cancelOrder, fulfilOrder } from './logic/Cleaning'
import PatientAPI from '../schedule/logic/PatientAPI'

const Columns = [
    {
        field: 'patient_id',
        headerName: 'id',
        width: 250
    },
    {
        field: 'first_name',
        headerName: 'First Name',
        width: 190
    },
    {
        field: 'last_name',
        headerName: 'Last Name',
        width: 190
    },
    {
        field: 'phone_number',
        headerName: 'Phone Number',
        width: 200
    },
    {
        field: 'email',
        headerName: 'Emnail Address ',
        width: 200
    },
    {
        field: 'described_symptoms',
        headerName: 'Describe Symnptoms ',
        width: 200
    },
    {
        field: 'nhs_number',
        headerName: 'NHS Number',
        width: 200
    },
    {
        field: 'gender',
        headerName: 'Gender',
        width: 200
    },
    {
        field: 'birthdate',
        headerName: 'DOB',
        width: 200
    },
    {
        field: 'deceased',
        headerName: 'Deceased',
        width: 200
    },
    {
        field: 'contact_relationship',
        headerName: 'Contact Relationship',
        width: 200
    },
    {
        field: 'contact_name',
        headerName: 'Contact Name',
        width: 200
    },
    {
        field: 'contact_telephone',
        headerName: 'Contact Telephone',
        width: 200
    },
    {
        field: 'contact_address',
        headerName: 'Contact Addess',
        width: 200
    },
    {
        field: 'commuication_language',
        headerName: 'Primary Language',
        width: 200
    },
]

const PatientsPage = () => {
    const permissions = useContext(AuthenticationContext).permissions

    const [message, setMessage] = useState()
    const [filter, setFilter] = useState()

    const [selection, setSelection] = useState()
    const [contents, setContents] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        handleSearch()
    }, [])

    useEffect(() => {
        if (message && !message.loading) {
            setTimeout(() => {
                setMessage(undefined)
            }, 7000)
        }
    }, [message])

    async function handleSearch(query) {
        setMessage({ text: 'Loading Records...', severity: 'info', loading: true })

        PatientAPI.getPatient()
            .then(result => {
                console.log(result)
                setContents(
                    result
                )
                setMessage(undefined)
            })
            .catch((err) => {
                console.log(err)
                setContents([])
                setMessage({
                    text: 'No records found',
                    severity: 'error',
                    loading: false
                })
            })
    }

    async function handleSelection(index) {
        if (!(contents[index] && contents[index].fulfilled)) {
            setSelection(index)
        } else {
            setSelection(undefined)
        }
    }

    return (
        <Box>
            <BreadcrumbGenerator />
            <Typography variant="h4">Cleaning Orders</Typography>

            <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

            <Box display="flex" justifyContent="space-between" flexWrap={'reverse'}>
                <Box display="flex" gap={2}>
                    <Searchbox label="Search Orders" onSubmit={handleSearch} />
                    <FormControlLabel
                        control={
                            <Checkbox onChange={event => setFilter(event.target.checked)} />
                        }
                        label="Include Fulfilled"
                        sx={{ alignItems: 'center' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <Button
                    >
                        Create New Order
                    </Button>
                    <Divider orientation="vertical" />
                    <Button
                    >
                        Cancel Order
                    </Button>
                    <Button
                    >
                        Fulfil Order
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ marginTop: '1rem', marginBottom: '1rem' }} />

            {message && (
                <Grow in={true}>
                    <Alert severity={message.severity} sx={{ marginBottom: '1rem' }}>
                        {message.text}
                    </Alert>
                </Grow>
            )}

            <DataGrid
                rows={contents}
                columns={Columns}
                onRowSelectionModelChange={model => handleSelection(model[0])}
                sx={{ height: '40vh' }}
                autoPageSize
            />
        </Box>
    )
}

export default PatientsPage

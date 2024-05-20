import { Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'
import PatientAPI from '../../apis/PatientAPI'
import { TextField } from '@mui/material'

function PatientSearch(props) {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(props.overWriteValue)

  useEffect(() => {
    PatientAPI.getPatient()
      .then(res => {
        console.log(res.success.rows)
        setPatients(res.success.rows)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  function setSelectedPatientInForm(patientId) {
    setSelectedPatient(patientId);
    props.setPatient(patientId);
  }

  const renderWardName = params => {
    return (
      <TextField
        {...params}
        value={getWardValue()}
        placeholder="Enter a patient name"
        onChange={(event, newVal) => {
          if (event.target.value) {
            setSelectedPatientInForm(parseInt(newVal.id))
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
      />
    )
  }

  const getWardValue = () => {
    if (props.overWriteValue == 0) {
      return null
    }

    let filteredPatients = patients.filter(
      patient => {
        return parseInt(patient.patient_id) == props.overWriteValue
      }
    )

    if (filteredPatients.length < 1) {
      return null
    }

    return {
      label:
        filteredPatients[0].first_name +
        ' ' +
        filteredPatients[0].last_name +
        ' : ' +
        filteredPatients[0].nhs_number,
      id: filteredPatients[0].patient_id
    }
  }

  return (
    <Autocomplete
      disablePortal
      label="Patient name..."
      renderInput={renderWardName}
      getOptionLabel={option => option.label}
      onChange={(e, newVal) => {
        console.log(newVal.id)
        setSelectedPatientInForm(parseInt(newVal.id))
      }}
      options={
        patients
          ? patients.map(patient => {
              // console.log(ward)
              return {
                label:
                  patient.first_name +
                  ' ' +
                  patient.last_name +
                  ' : ' +
                  patient.nhs_number,
                id: patient.patient_id
              }
            })
          : []
      }
      value={getWardValue()}
    />
  )
}

export default PatientSearch

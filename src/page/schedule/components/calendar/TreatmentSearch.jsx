import { Autocomplete, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import TreatmentsAPI from '../../apis/TreatmentAPI'

function TreatmentSearch(props) {
  const [treatments, setTreatments] = useState([])
  const [selectedTreatment, setSelectedTreatment] = useState(props.overWriteValue)

  useEffect(() => {
    TreatmentsAPI.getTreatment()
      .then(res => {
        console.log("treatments")
        console.log(res.rows)
        setTreatments(res.rows)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  function setSelectedTreatmentInForm(patientId) {
    setSelectedTreatment(patientId);
    props.setTreatment(patientId);
  }

  const renderWardName = params => {
    return (
      <TextField
        {...params}
        value={getTreatmentValue()}
        placeholder="Enter a treatment name"
        onChange={(event, newVal) => {
          // console.log(event.target.value)
          console.log(newVal.id)
          if (event.target.value) {
            setSelectedTreatmentInForm(parseInt(newVal.id))
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        // error={errors.ward_id}
      />
    )
  }

  const getTreatmentValue = () => {
    if (props.overWriteValue == 0) {
      return null
    }

    let filteredPatients = treatments.filter(
      patient => {
        return parseInt(patient.treatment_id) == props.overWriteValue
      }
    )

    if (filteredPatients.length < 1) {
      return null
    }
    
    return {
      label:
        filteredPatients[0].name
    }
  }

  return (
    <Autocomplete
      disablePortal
      label="Treatment name..."
      renderInput={renderWardName}
      getOptionLabel={option => option.label}
      onChange={(e, newVal) => {
        console.log(newVal.id)
        setSelectedTreatmentInForm(parseInt(newVal.id))
      }}
      options={
        treatments
          ? treatments.map(patient => {
              // console.log(ward)
              return {
                label:
                  patient.name,
                id: patient.treatment_id
              }
            })
          : []
      }
      value={getTreatmentValue()}
    />
  )
}

export default TreatmentSearch

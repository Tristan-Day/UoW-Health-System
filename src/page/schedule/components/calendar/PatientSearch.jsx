import { Autocomplete } from '@mui/material'

function PatientSearch() {
  const renderWardName = params => {
    return (
      <TextField
        {...params}
        label="Enter a ward name"
        onChange={(event, newVal) => {
          // console.log(event.target.value)
          // console.log(newVal)
          if (event.target.value) {
            setForm({ ...form, ward_id: parseInt(newVal.id) })
          }
        }}
        InputProps={{ ...params.InputProps, type: 'search' }}
        error={errors.ward_id}
      />
    )
  }

  const getWardValue = () => {
    if (!form.ward_id) {
      return null
    }

    let filteredWards = wards.filter(ward => ward.ward_id === form.ward_id)

    if (filteredWards.length === 0) {
      return null
    }

    return { label: filteredWards[0].ward_name, id: filteredWards[0].ward_id }
  }

  return (
    <Autocomplete
      disablePortal
      label="Ward name..."
      renderInput={renderWardName}
      getOptionLabel={option => option.label}
      onChange={(e, newVal) => {
        // console.log(newVal)
        setForm({ ...form, ward_id: newVal.id })
      }}
      options={
        wards
          ? wards.map(ward => {
              // console.log(ward)
              return { label: ward.ward_name, id: ward.ward_id }
            })
          : []
      }
      value={getWardValue()}
    />
  )
}

export default PatientSearch

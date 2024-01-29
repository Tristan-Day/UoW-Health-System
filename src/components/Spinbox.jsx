import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

import { useState } from 'react'

const Spinbox = props => {
  const [value, setValue] = useState(0)

  function handleChange(value) {
    if (isNaN(value)) {
      if (typeof props.min !== 'undefined' && props.min > 0) {
        setValue(props.min)
      } else {
        setValue(0)
      }
      return
    }

    if (typeof props.min !== 'undefined' && value < props.min) {
      return
    }

    if (typeof props.max !== 'undefined' && value > props.max) {
      return
    }

    setValue(value)

    if (props.onChange) {
      props.onChange({ target: { value: value } })
    }
  }

  return (
    <TextField
      label={props.label}
      error={props.error}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              onClick={() => handleChange(value - 1)}
              disabled={typeof props.min !== 'undefined' && value === props.min}
            >
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => handleChange(value + 1)}
              disabled={typeof props.max !== 'undefined' && value === props.max}
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      value={value}
      onChange={event => handleChange(parseInt(event.target.value))}
    />
  )
}

export default Spinbox

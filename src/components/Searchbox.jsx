import { TextField, InputAdornment, IconButton } from '@mui/material/'
import SearchIcon from '@mui/icons-material/Search'

import { useState } from 'react'

const Searchbox = props => {
  const [query, setQuery] = useState()

  return (
    <TextField
      onKeyDown={event =>
        event.key === 'Enter' ? props.onSubmit(query) : null
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <IconButton
              size="small"
              disabled={props.loading}
              onClick={() => props.onSubmit(query)}
            >
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
      onChange={event => setQuery(event.target.value)}
      label={props.label}
    />
  )
}

export default Searchbox

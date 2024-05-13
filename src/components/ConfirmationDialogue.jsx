import { Fragment } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

const ConfirmationDialogue = props => {
  const handleCloseSuccess = () => {
    props.onProceed()
    props.state.handle(false)
  }

  const handleClose = () => {
    props.onClose()
    props.state.handle(false)
  }

  return (
    <Fragment>
      <Dialog open={props.state.value} onClose={handleClose}>
        <DialogTitle>Delete Resource?</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.message}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            onClick={handleClose}
            sx={{ margin: '0 0 .8rem .75rem' }}
            variant="outlined"
          >
            {props.denyResponse}
          </Button>
          <Button
            onClick={handleCloseSuccess}
            autoFocus
            sx={{ margin: '0 .75rem .8rem 0' }}
            variant="contained"
          >
            {props.proceedResponse}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ConfirmationDialogue

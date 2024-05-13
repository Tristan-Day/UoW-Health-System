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
  //props = message, proceedResponse, denyResponse, onProceed

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
        <DialogTitle id="alert-dialog-title">{'Delete Resource?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
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

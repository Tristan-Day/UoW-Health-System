import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Fragment, useState } from 'react'

const ConfirmationDialogue = props => {
  //props = message, proceedResponse, denyResponse, onProceed
  const [open, setOpen] = useState(false)

  const handleCloseSuccess = () => {
    props.onProceed()
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"This will delete this resource"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{props.denyResponse}</Button>
          <Button onClick={handleCloseSuccess} autoFocus>
            {props.proceedResponse}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ConfirmationDialogue

import { Typography, Box, Button, Paper } from '@mui/material'

import { styled } from '@mui/material/styles'

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { useState, useEffect } from 'react'

const ProfileImage = props => {
  const [image, setImage] = useState()

  useEffect(() => {
    props.onUpdate(image)
  }, [image])

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    width: 1
  })

  async function handleFileUpload(event) {
    const reader = new FileReader()

    reader.onloadend = () => {
      setImage({
        preview: URL.createObjectURL(event.target.files[0]),
        data: reader.result
      })
    }

    reader.readAsDataURL(event.target.files[0])
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      {image ? (
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '5%',
            overflow: 'clip'
          }}
        >
          <img
            src={image.preview}
            style={{
              width: '200px',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: 'inherit'
            }}
          />
        </Box>
      ) : (
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
            height: 200,
            gap: 2
          }}
        >
          <AssignmentIndIcon fontSize="large" />
          <Typography>No Image Set</Typography>
        </Paper>
      )}
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </Button>
    </Box>
  )
}

export default ProfileImage

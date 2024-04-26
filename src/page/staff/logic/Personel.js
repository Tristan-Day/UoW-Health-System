import { get, del, post, put } from 'aws-amplify/api'

const resizeImage = async source => {
  const maxWidth = 200
  const maxHeight = 200

  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      let width = image.width
      let height = image.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      context.drawImage(image, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg'))
    }

    image.onerror = error => {
      reject(error)
    }

    image.src = source
  })
}

export const getStaff = async query => {
  const operation = post({
    apiName: 'StaffHandler',
    path: `/v1/resources/staff/search`,
    options: {
      body: { query: query }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const createUser = async (identifier, form) => {
  // Process an optional image
  var image = undefined
  if (form.image) {
    image = await resizeImage(form.image)
  }

  const operation = put({
    apiName: 'StaffHandler',
    path: `/v1/resources/staff/${identifier}/create`,
    options: {
      body: {
        ...form,
        image: image
      }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const getUser = async identifier => {
  const operation = get({
    apiName: 'StaffHandler',
    path: `/v1/resources/staff/${identifier}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const deleteUser = async identifier => {
  const operation = del({
    apiName: 'StaffHandler',
    path: `/v1/resources/staff/${identifier}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const updateUser = async (identifier, user) => {
  // Process an optional image
  var image = undefined
  if (user.image) {
    image = await resizeImage(user.image)
  }

  const operation = put({
    apiName: 'StaffHandler',
    path: `/v1/resources/staff/${identifier}/update`,
    options: {
      body: {
        ...user,
        image: image
      }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

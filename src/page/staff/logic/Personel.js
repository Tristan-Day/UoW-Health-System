import { get, del, post, put } from 'aws-amplify/api'

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
  const image = new Image()

  image.onload = async () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    const scaleFactor = Math.min(200 / image.width, 200 / image.height)

    context.drawImage(
      image,
      0,
      0,
      image.width * scaleFactor,
      image.height * scaleFactor
    )
    canvas.toDataURL('image/jpeg')

    const operation = put({
      apiName: 'StaffHandler',
      path: `/v1/resources/staff/${identifier}/create`,
      options: {
        body: {
          first_name: form.first_name,
          last_name: form.last_name,

          email_address: form.email_address,
          phone_number: form.phone_number,

          image: canvas.toDataURL('image/jpeg')
        }
      }
    })

    const response = await operation.response
    return (await response.body.json()).result
  }

  image.src = form.image.data
}

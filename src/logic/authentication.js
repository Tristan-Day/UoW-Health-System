import { getCurrentUser } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api'

export const isAuthorised = async () => {
  const user = await getCurrentUser()

  try {
    const operation = get({
      apiName: 'StaffHandler',
      path: `/v1/resources/staff/${user.username}`
    })

    await operation.response
    return true
  } catch (error) {
    return false
  }
}

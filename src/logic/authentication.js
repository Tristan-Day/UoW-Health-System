import { getCurrentUser } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api'

export const getAuthorisation = async () => {
  const user = await getCurrentUser()

  const operation = get({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/staff/${user.username}`
  })

  const response = await operation.response
  return (await response.body.json()).result.map(permission => {
    return permission.name
  })
}

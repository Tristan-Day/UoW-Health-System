import { get, del, post, put } from 'aws-amplify/api'

export const searchRoles = async query => {
  // Retreive all roles
  if (query) {
    const operation = post({
      apiName: 'PermissionHandler',
      path: `/v1/permissions/roles/search/`,
      options: {
        body: { query: query }
      }
    })

    const response = await operation.response
    return (await response.body.json()).result
  } else {
    const operation = post({
      apiName: 'PermissionHandler',
      path: `/v1/permissions/roles/search/`
    })

    const response = await operation.response
    return (await response.body.json()).result
  }
}

export const searchPermissions = async query => {
  // Retreive all permissions
  if (query) {
    const operation = post({
      apiName: 'PermissionHandler',
      path: `/v1/permissions/search/`,
      options: {
        body: { query: query }
      }
    })

    const response = await operation.response
    return (await response.body.json()).result
  } else {
    const operation = post({
      apiName: 'PermissionHandler',
      path: `/v1/permissions/search/`
    })

    const response = await operation.response
    return (await response.body.json()).result
  }
}

export const getRolePermissions = async role => {
  const operation = get({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/${role}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const getRoleMembers = async role => {
  const operation = get({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/${role}/members`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const updateRole = async (name, description, permissions) => {
  const operation = put({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/${name}/update`,
    options: {
      body: { description: description, permissions: permissions }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const createRole = async (name, description, permissions) => {
  const operation = put({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/${name}/create`,
    options: {
      body: { description: description, permissions: permissions }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const deleteRole = async name => {
  const operation = del({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/${name}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const grantRoles = async (identifier, roles) => {
  const operation = put({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/staff/${identifier}/grant`,
    options: {
      body: { roles: roles }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const grantPermissions = async (identifier, permissions) => {
  const operation = put({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/staff/${identifier}/grant`,
    options: {
      body: { permissions: permissions }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const getPermissions = async identifier => {
  const operation = get({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/staff/${identifier}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const getRoles = async identifier => {
  const operation = get({
    apiName: 'PermissionHandler',
    path: `/v1/permissions/roles/staff/${identifier}`
  })

  const response = await operation.response
  return (await response.body.json()).result
}
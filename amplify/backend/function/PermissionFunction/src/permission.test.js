const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

const ROLE = 'Test%20Role'
const STAFF_ID = 'bc923af4-137c-4b4c-92af-03e29f8efd77'

test('Retreive a permission', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/staff.view`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert permission description
  expect(JSON.parse(res.body).result.description).toBe(
    'View the current staff list'
  )
})

test('Create a new role', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: '/v1/permissions/roles/Test%20Role/create',
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description: 'Role creation demonstration' })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Attempt to overwrite an existing role', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/roles/${ROLE}/create`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ description: 'Role creation demonstration' })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the error response code
  expect(res.statusCode).toBe(409)
})

test('Update a role and assign permissions', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/roles/${ROLE}/update`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'This is a test role',
      permissions: ['staff.view', 'staff.edit']
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Retreive a role', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/roles/${ROLE}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  let result = JSON.parse(res.body).result

  // Assert that permissions have been granted
  expect(result.description).toBe('This is a test role')
  expect(result.permissions.length).toBe(2)

  expect(result.permissions[0].name).toBe('staff.view')
  expect(result.permissions[1].name).toBe('staff.edit')
})

test('Grant a permission', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/staff/${STAFF_ID}/grant`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ permissions: ['staff.create'] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Attempt to grant an existing permission', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/staff/${STAFF_ID}/grant`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ permissions: ['staff.create'] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the error response code
  expect(res.statusCode).toBe(409)
})

test('Assign a role', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/roles/staff/${STAFF_ID}/grant`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ roles: ['Test Role'] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(JSON.parse(res.body))

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Get role members', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/roles/${ROLE}/members`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of assigned users
  expect(JSON.parse(res.body).result.length).toBe(1)
})

test('Get permission members', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/staff.view/members`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of assigned users
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Get staff roles', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/roles/staff/${STAFF_ID}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roles: ['Test Role', 'Invalid Role']
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  let result = JSON.parse(res.body).result

  // Assert the role name
  expect(result['Test Role']).toBe(true)
  expect(result['Invalid Role']).toBe(false)
})

test('Get staff permissions', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/staff/${STAFF_ID}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      permissions: ['staff.view', 'staff.edit', 'staff.create', 'staff.delete']
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  let result = JSON.parse(res.body).result

  // Assert assigned permissions
  expect(result['staff.view']).toBe(true)
  expect(result['staff.edit']).toBe(true)

  expect(result['staff.create']).toBe(true)
  expect(result['staff.delete']).toBe(false)
})

test('Get all staff permissions', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/permissions/staff/${STAFF_ID}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert assigned permissions
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(3)
})

test('Retreive all roles', async () => {
  const payload = {
    httpMethod: 'POST',
    path: `/v1/permissions/roles/search`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of returned items
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Retreive all permissions', async () => {
  const payload = {
    httpMethod: 'POST',
    path: `/v1/permissions/search`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of returned items
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Delete a role', async () => {
  const payload = {
    httpMethod: 'DELETE',
    path: `/v1/permissions/roles/${ROLE}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Revoke a permission', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/permissions/staff/${STAFF_ID}/revoke`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ permissions: ['staff.create'] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

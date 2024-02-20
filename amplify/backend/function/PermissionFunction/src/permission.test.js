const lambdaLocal = require("lambda-local")
const PROFILE = "Winchester Health Systems"


test('Retreive a permission', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/permissions/test.permission.alpha",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert permission description
  expect(JSON.parse(res.body).result.description).toBe("This is a test permission")
})

test('Create a new role', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/roles/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "description": "Role creation demonstration" })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Attempt to overwrite an existing role', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/roles/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "description": "Role creation demonstration" })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the error response code
  expect(res.statusCode).toBe(409)
})

test('Update a role and assign permissions', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/roles/TEST/update",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "description": "This is a test role", permissions: ["test.permission.alpha"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Retreive a role', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/permissions/roles/TEST",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert that permissions have been granted
  expect(JSON.parse(res.body).result.description).toBe("Role creation demonstration")
  expect(JSON.parse(res.body).result.permissions[0].name).toBe("test.permission.alpha")
})

test('Grant a permission', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/staff/ACCESS/grant",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "permissions": ["test.permission.beta"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Attempt to grant an existing permission', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/staff/ACCESS/grant",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "permissions": ["test.permission.beta"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the error response code
  expect(res.statusCode).toBe(409)
})

test('Assign a role', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/roles/staff/ACCESS/grant",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "roles": ["TEST"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Get role members', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/permissions/roles/TEST/members",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
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
    "httpMethod": "GET",
    "path": "/v1/permissions/test.permission.beta/members",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of assigned users
  expect(JSON.parse(res.body).result.length).toBe(1)
})

test('Get staff roles', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/permissions/roles/staff/ACCESS",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "roles": ["TEST"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the role name
  expect(JSON.parse(res.body).result["TEST"]).toBe(true)
})

test('Get staff permissions', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/permissions/staff/ACCESS",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "permissions": ["test.permission.alpha", "test.permission.beta"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert assigned permissions
  expect(JSON.parse(res.body).result["test.permission.alpha"]).toBe(true)
  expect(JSON.parse(res.body).result["test.permission.beta"]).toBe(true)
})

test('Retreive all roles', async () => {
  const payload = {
    "httpMethod": "POST",
    "path": `/v1/permissions/roles/search`,
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
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
    "httpMethod": "POST",
    "path": `/v1/permissions/search`,
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)

  // Assert the number of returned items
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(2)
})

test('Delete a role', async () => {
  const payload = {
    "httpMethod": "DELETE",
    "path": "/v1/permissions/roles/TEST",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": ""
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})

test('Revoke a permission', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/permissions/staff/ACCESS/revoke",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ "permissions": ["test.permission.beta"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(200)
})
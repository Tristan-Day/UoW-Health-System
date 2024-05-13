const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

// Retreives the test room identifier from the database
async function getTestIdentifier() {
  const payload = {
    httpMethod: 'POST',
    path: `/v1/resources/rooms/search`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: 'Test Room' })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  if (res.statusCode !== 200) {
    throw new Error('Unable to retreive room identifier')
  }

  return JSON.parse(res.body).result[0].room_id
}

test('Create a new room', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/resources/rooms/Test%20Room/create`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      building: 'Butterfield Wing',
      floor: 2
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

test('Create a new room without specifying a floor', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/resources/rooms/Test%20Room/create`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      building: 'Butterfield Wing'
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(400)
})

test('Create a new room without specifying a building', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: '/v1/resources/rooms/Test%20Room/create',
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      floor: 2
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(400)
})

test('Update a room description', async () => {
  const identifier = await getTestIdentifier()

  const payload = {
    httpMethod: 'PUT',
    path: `/v1/resources/rooms/${identifier}/update`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'This is a test room'
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

test('Retreive details of a room', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/resources/rooms/Test%20Room`,
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

  // Assert the room name
  expect(result.room).toBe('Test Room')
  expect(result.description).toBe('This is a test room')
})

test('Retreive all rooms', async () => {
  const payload = {
    httpMethod: 'POST',
    path: `/v1/resources/rooms/search`,
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
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(2)
})

test('Delete a room', async () => {
  const identifier = await getTestIdentifier()

  const payload = {
    httpMethod: 'DELETE',
    path: `/v1/resources/rooms/${identifier}`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: 'This is a test room'
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

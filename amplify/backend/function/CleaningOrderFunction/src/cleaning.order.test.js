const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

// Ward A - Nightinggale Wing
const ROOM_ID = '114'

// Staff Member Tristan Day
const STAFF_ID = '758601d7-eb34-45d3-989b-394d14c901a5'

test('Issue a new cleaning order', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/issue`,
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

test('Attempt to issue a duplicate order', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/issue`,
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
  expect(res.statusCode).toBe(409)
})

test('Collect active cleaning orders', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/orders/cleaning/room/${ROOM_ID}`,
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

  // Assert there is more than one order
  expect(JSON.parse(res.body).result.length).toBe(1)
})

test('Collect all cleaning orders', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/orders/cleaning/all`,
    queryStringParameters: {
      fulfilled: true
    },
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

  // Assert there is more than one order
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Fulfill a cleaning order', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/fulfil`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cleaner: STAFF_ID
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

test('Attempt to fulfill a completed order', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/fulfil`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cleaner: STAFF_ID
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(409)
})

test('Collect all cleaning orders for a room', async () => {
  const payload = {
    httpMethod: 'GET',
    path: `/v1/orders/cleaning/room/${ROOM_ID}`,
    queryStringParameters: {
      fulfilled: true
    },
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

  // Assert there is more than one order
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Cancel an order', async () => {
  var payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/issue`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  payload = {
    httpMethod: 'DELETE',
    path: `/v1/orders/cleaning/room/${ROOM_ID}`,
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

const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

// Room identifier must be set statically since lambda-local does not support simultanious executions due to port conflict
const ROOM_ID = '1'

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

test('Fulfill a cleaning order', async () => {
  const payload = {
    httpMethod: 'PUT',
    path: `/v1/orders/cleaning/room/${ROOM_ID}/fulfil`,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cleaner: 'TEST-CLEANER'
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
      cleaner: 'TEST-CLEANER'
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

test('Collect all cleaning orders', async () => {
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

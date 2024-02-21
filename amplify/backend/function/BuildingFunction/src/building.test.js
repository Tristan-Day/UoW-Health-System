const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

test('Get all buildings', async () => {
  const payload = {
    httpMethod: 'GET',
    path: '/v1/resources/buildings',
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

  // Assert the number of returned responses
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

test('Get all rooms within a building', async () => {
  const payload = {
    httpMethod: 'GET',
    path: '/v1/resources/buildings/TEST-BUILDING/',
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

  // Assert the number of returned responses
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
})

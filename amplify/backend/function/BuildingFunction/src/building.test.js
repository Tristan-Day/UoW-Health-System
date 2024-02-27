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

  // Assert record count
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(5)
})

test('Get all rooms within a building', async () => {
  const payload = {
    httpMethod: 'GET',
    path: '/v1/resources/buildings/Butterfield%20Wing/',
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

  // Assert record count
  expect(result.length).toBeGreaterThanOrEqual(1)

  // Assert result contents
  expect(result.at(0).floor).toBe(0)
  expect(result.at(0).name).toBe('Kitchen')

  expect(result.at(2).floor).toBe(1)
  expect(result.at(2).name).toBe('Food Storage A')
})

test('Retreive an invalid building', async () => {
  const payload = {
    httpMethod: 'GET',
    path: '/v1/resources/buildings/Invalid/',
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
  expect(res.statusCode).toBe(404)
})

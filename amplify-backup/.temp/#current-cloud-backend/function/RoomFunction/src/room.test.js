const lambdaLocal = require("lambda-local")
const PROFILE = "Winchester Health Systems"

// Function to parse a name and turn it into a usable identifier
async function lookup(name) {
  const payload = {
    "httpMethod": "GET",
    "path": `/v1/resources/rooms/${name}`,
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

  if (res.statusCode !== 200) {
    console.log(res)
    throw new Error("Unable to retreive room identifier")
  }

  return JSON.parse(res.body).result[0]
}

test('Create a new room', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/rooms/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "building": "TEST-BUILDING",
      "floor": 0,
    })
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

test('Create a new room without specifying a floor', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/rooms/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "building": "West Downs Centre",
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(400)
})

test('Create a new room without specifying a building', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/rooms/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "floor": 0,
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  // Assert the response code
  expect(res.statusCode).toBe(400)
})

test('Update a room description', async () => {
  const identifier = (await lookup("TEST")).room_id

  const payload = {
    "httpMethod": "PUT",
    "path": `/v1/resources/rooms/${identifier}/update`,
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "description": "This is a test room",
    })
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

test('Retreive details of a room', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": `/v1/resources/rooms/TEST`,
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

  // Assert the room name
  expect(JSON.parse(res.body).result[0].room).toBe("TEST")

  // Assert the room floor and description
  expect(JSON.parse(res.body).result[0].floor).toBe(0)
  expect(JSON.parse(res.body).result[0].description).toBe("This is a test room")
})

test('Retreive all rooms', async () => {
  const payload = {
    "httpMethod": "POST",
    "path": `/v1/resources/rooms/search`,
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

test('Delete a room', async () => {
  const identifier = (await lookup("TEST")).room_id

  const payload = {
    "httpMethod": "DELETE",
    "path": `/v1/resources/rooms/${identifier}`,
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "description": "This is a test room",
    })
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



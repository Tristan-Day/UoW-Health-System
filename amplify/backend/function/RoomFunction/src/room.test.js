const lambdaLocal = require("lambda-local");
const PROFILE = "Winchester Health Systems"


async function lookup(name) {
  const payload = {
    "httpMethod": "GET",
    "path": `/v1/resources/room/${name}`,
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
    "path": "/v1/resources/room/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "building": "West Downs Centre",
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
  expect(res.statusCode).toBe(200);
});

test('Create a new room without specifying a floor', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/room/TEST/create",
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
  expect(res.statusCode).toBe(400);
});

test('Create a new room without specifying a building', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/room/TEST/create",
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
  expect(res.statusCode).toBe(400);
});

test('Update a room description', async () => {
  const identifier = (await lookup("TEST")).room_id

  const payload = {
    "httpMethod": "PUT",
    "path": `/v1/resources/room/${identifier}/update`,
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
  expect(res.statusCode).toBe(200);
});

test('Retreive a room', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": `/v1/resources/room/TEST`,
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
  expect(res.statusCode).toBe(200);

  // Assert the number of returned items
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)

  // Assert the room floor and description
  expect(JSON.parse(res.body).result[0].floor).toBe(0);
  expect(JSON.parse(res.body).result[0].description).toBe("This is a test room");
});


test('Delete a room', async () => {
  const identifier = (await lookup("TEST")).room_id

  const payload = {
    "httpMethod": "DELETE",
    "path": `/v1/resources/room/${identifier}`,
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
  expect(res.statusCode).toBe(200);
});



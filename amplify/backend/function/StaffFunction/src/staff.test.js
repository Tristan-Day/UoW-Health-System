const lambdaLocal = require("lambda-local");
const PROFILE = "Winchester Health Systems"


test('Create a new staff member', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/staff/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "first_name": "Boris",
      "last_name": "Cleverly",
      "phone_number": "07983808564",
      "email_address": "boris.cleverly@example.com"
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

test('Create a new staff member without required fields', async () => {
  const payload = {
    "httpMethod": "PUT",
    "path": "/v1/resources/staff/TEST/create",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "first_name": "Boris",
    })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  expect(res.statusCode).toBe(400);
});

test('Retreive a staff member', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/resources/staff/TEST",
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

  // Assert the returned fields
  expect(JSON.parse(res.body).result.first_name).toBe("Boris")
  expect(JSON.parse(res.body).result.last_name).toBe("Cleverly")
});

test('Retreive a staff member with an invalid identifier', async () => {
  const payload = {
    "httpMethod": "GET",
    "path": "/v1/resources/staff/INVALID",
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

  // Assert the error response code
  expect(res.statusCode).toBe(404);
});

test('Search for a staff member', async () => {
  const payload = {
    "httpMethod": "POST",
    "path": "/v1/resources/staff/search",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ query: "Tristan" })
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
  expect(JSON.parse(res.body).result.length).toBe(1)
});

test('Delete a staff member', async () => {
  const payload = {
    "httpMethod": "DELETE",
    "path": "/v1/resources/staff/TEST",
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
});

test('Delete a staff member with an invalid identifier', async () => {
  const payload = {
    "httpMethod": "DELETE",
    "path": "/v1/resources/staff/INVALID",
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

  // Assert the error response code
  expect(res.statusCode).toBe(404);
});

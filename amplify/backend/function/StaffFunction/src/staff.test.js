const lambdaLocal = require("lambda-local");
const PROFILE = "Winchester Health Systems"


test('Test staff creation', async () => {
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

  expect(res.statusCode).toBe(200);
});

test('Test staff creation without required fields', async () => {
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

test('Test staff retreival', async () => {
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

  expect(res.statusCode).toBe(200);

  expect(JSON.parse(res.body).result.first_name).toBe("Boris")
  expect(JSON.parse(res.body).result.last_name).toBe("Cleverly")
});

test('Test staff retreival with an invalid identifier', async () => {
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

  expect(res.statusCode).toBe(404);
});

test('Test staff search', async () => {
  const payload = {
    "httpMethod": "POST",
    "path": "/v1/resources/staff/search",
    "queryStringParameters": {
      "string": "Boris"
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ fields: ["first_name"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body).result.length).toBeGreaterThanOrEqual(1)
});

test('Test staff search on an invalid field', async () => {
  const payload = {
    "httpMethod": "POST",
    "path": "/v1/resources/staff/search",
    "queryStringParameters": {
      "string": "Boris"
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ fields: ["invalid_field"] })
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: "./index.js",
    profileName: PROFILE,
    verboseLevel: 0
  })

  expect(res.statusCode).toBe(400);
});

test('Test staff deletion', async () => {
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

  expect(res.statusCode).toBe(200);
});

test('Test staff deletion with invalid identifier', async () => {
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

  expect(res.statusCode).toBe(404);
});

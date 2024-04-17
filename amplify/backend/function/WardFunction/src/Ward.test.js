const lambdaLocal = require('lambda-local')
const PROFILE = 'Winchester Health Systems'

const route = '/v1/resources/ward'

//CRUD

const createBody = {
  WARD_ID: "TEST",
  WARD_NAME: "Test ward",
  SPECIALISATION: "test",
  DESCRIPTION: "test description",
  ICON_DATA: "personal_injury", //links to material icons component
  ACTION_TYPE: 'INSERT'
}

let successfulCreateId = 0

async function getLastCreatedItem() {
  const payload = {
    httpMethod: 'GET',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(JSON.parse(res.body).success.rows.slice(-1))

  return JSON.parse(res.body).success.rows.slice(-1)[0]
}

// 1 - create, correct

test('1 - create, correct', async () => {
  const payload = {
    httpMethod: 'POST',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createBody)
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('success')
})

// 2 - create, incorrect
test('2 - create, incorrect', async () => {
  createBody.WARD_ID = null

  const payload = {
    httpMethod: 'POST',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createBody)
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('failure')
})

// 3 - read, correct
test('3 - read, correct', async () => {
  const payload = {
    httpMethod: 'GET',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('success')
})

// 4 - read, incorrect
test('4 - read, incorrect', async () => {
  const payload = {
    httpMethod: 'GET',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    queryStringParameters: { INCORRECT_FIELD: 'val' }
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('failure')
})

// 5 - update, correct
test('5 - update, correct', async () => {
  //get last created ID
  let row = await getLastCreatedItem()

  let newRow = {
    WARD_ID: "TEST",
    WARD_NAME: "Test ward",
    SPECIALISATION: "test",
    DESCRIPTION: "test description",
    ICON_DATA: "personal_injury", //links to material icons component
    ACTION_TYPE: "UPDATE"
  }

  const payload = {
    httpMethod: 'POST',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRow)
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res.body)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('success')
})

// 6 - update, incorrect
test('6 - update, incorrect', async () => {
  //get last created ID
  let row = await getLastCreatedItem()

  let newRow = {
    WARD_ID: row.ward_id,
    INCORRECT_FIELD: "incorrect",
    NAME: "Test treatment",
    WARD_NAME: "Test ward",
    SPECIALISATION: "test",
    DESCRIPTION: "test description",
    ICON_DATA: "personal_injury", //links to material icons component
  }

  const payload = {
    httpMethod: 'POST',
    path: route,
    queryStringParameters: {},
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newRow)
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res.body)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('failure')
})

// 7 - delete, correct
test('7 - delete, correct', async () => {
  //get last created ID
  let row = await getLastCreatedItem()
  
  let deletionObject = {
    WARD_ID: "TEST"
  }

  console.log(deletionObject);

  const payload = {
    httpMethod: 'DELETE',
    path: route,
    headers: {
      'Content-Type': 'application/json'
    },
    queryStringParameters: deletionObject
  }

  const res = await lambdaLocal.execute({
    event: payload,
    lambdaPath: './index.js',
    profileName: PROFILE,
    verboseLevel: 0
  })

  console.log(res.body)

  // Assert the response code
  expect(JSON.parse(res.body)).toHaveProperty('success')
})

// 8 - delete, incorrect
test('8 - delete, incorrect', async () => {
    //get last created ID
    let row = await getLastCreatedItem()
  
    let deletionObject = {
        WARD_CATEGORY_ID: row.treatment_id
    }

    console.log(deletionObject);
  
    const payload = {
      httpMethod: 'DELETE',
      path: route,
      headers: {
        'Content-Type': 'application/json'
      },
      queryStringParameters: deletionObject
    }
  
    const res = await lambdaLocal.execute({
      event: payload,
      lambdaPath: './index.js',
      profileName: PROFILE,
      verboseLevel: 0
    })
  
    // console.log(res.body)
  
    // Assert the response code
    expect(JSON.parse(res.body)).toHaveProperty('failure')
  })
  
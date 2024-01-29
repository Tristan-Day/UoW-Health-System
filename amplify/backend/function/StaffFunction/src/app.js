/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')

// Declare a new express app
const app = express()
app.use(require('body-parser').json())
app.use(require('aws-serverless-express/middleware').eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const SecretsManager = require('@aws-sdk/client-secrets-manager')

var clientConnected = false
var client = null

async function setup() {
  if (clientConnected) {
    return
  }

  // Load credentials from secrets to avoid leakage
  const secretsClient = new SecretsManager.SecretsManagerClient({
    region: 'eu-west-1',
  })

  const response =
    await secretsClient.send(new SecretsManager.GetSecretValueCommand({
      SecretId: '/v1/database',
      VersionStage: 'AWSCURRENT',
    }))

  secrets = JSON.parse(response.SecretString)
  console.log('Sucessfully collected secrets')

  // Connect to Postgres
  const { Pool } = require('pg')

  client = new Pool({
    user: secrets.username,
    password: secrets.password,

    database: secrets.dbname,
    ssl: { rejectUnauthorized: false },

    host: secrets.host,
    port: secrets.port,
  })

  // Test the connection
  await client.connect()
  clientConnected = true

  console.log('Established database connection')
}

function getConstraintName(constraint) {
  switch (constraint) {
    case 'email_unique':
      field = 'Email address'
      break

    case 'phone_unique':
      field = 'Phone number'
      break

    default:
      field = 'Identifier'
      break
  }
}

app.get('/v1/resources/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Retreive a staff member from the database'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff member to retreive',                   
        required: true                     
  } */

  const result = await client.query(
    'SELECT * FROM system.staff WHERE staff_id = $1', [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows[0] })
  }
  else {
    res.status(404).json({ error: 'Staff member not found' })
  }
})

app.post('/v1/resources/staff/search', async function (req, res) {
  await setup()

  // #swagger.description = 'Search for a staff member by a given field'

  /* #swagger.parameters['fields'] = {
        in: 'body',                            
        description: 'The fields to search within',
        schema: 'object',
        required: true                   
  } */

  /* #swagger.parameters['string'] = {
        in: 'query',                            
        description: 'Search string or regex',                   
        required: true                     
  } */

  /* #swagger.parameters['regex'] = {
        in: 'query',                            
        description: 'Specifies if the string is a regex query',                   
        required: false                     
  } */

  /* #swagger.parameters['size'] = {
        in: 'query',                            
        description: 'Number of records in the page [Pagnetation]',                   
        required: false                     
  } */

  /* #swagger.parameters['index'] = {
        in: 'query',                            
        description: 'The page index to retreive [Pagnetation]',                   
        required: false                     
  } */

  // Basic error handling
  if (req.body.fields === undefined) {
    res.status(400).json({ error: `Missing body parameter 'fields'` })
    return
  }

  if (!(Array.isArray(req.body.fields))) {
    res.status(400).json({ error: `Parameter 'fields' must be of type 'array'` })
    return
  }

  if (req.query.string === undefined) {
    res.status(400).json({ error: `Missing body parameter 'string'` })
    return
  }

  if (typeof req.query.string !== 'string') {
    res.status(400).json({ error: `Parameter 'string' must be of type 'string'` });
    return;
  }

  // Prevent SQL injection attacks
  const allowlist = ['first_name', 'last_name', 'email_address', 'phone_number']

  excluded = req.body.fields.filter((value) => !(allowlist.includes(value)))
  columns = req.body.fields.filter((value) => allowlist.includes(value))

  if (excluded.length > 0) {
    res.status(400).json({ error: `Illegal field(s) '${excluded}'` })
    return
  }

  // Generate an SQL statement
  var conditions = []
  const condition = req.query.regex ? '~' : '='

  columns.forEach((field) => {
    conditions.push(`${field} ${condition} $1`)
  })
  var query = `SELECT * FROM system.staff WHERE ${conditions.join(' OR ')}`

  var result
  try {
    result = await client.query(query, [req.query.string])
  }
  catch (error) {
    res.status(500).send({ result: 'Unhandled error' })
    return
  }

  if (result.rows.length < 1) {
    res.status(404).json({ result: 'No matching staff' })
    return
  }

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    var pages = []

    while (result.rows.length > 0) {
      pages.push(result.rows.splice(0, pagnetationSize))
    }

    try {
      res.status(200).json({ result: pages[pagnetationIndex] })
    }
    catch (error) {
      res.status(416).json({ error: 'Page index out of range' })
    }
  }
  else {
    res.status(200).json({ result: result.rows })
  }
})

app.put('/v1/resources/staff/:identifier/create', async function (req, res) {
  await setup()

  // #swagger.description = 'Add a new staff member to the database'

  /* #swagger.parameters['identifier'] = {
      in: 'path',                            
      description: 'User identifier provided by cognito',                   
      required: true                     
  } */

  /* #swagger.parameters['first_name'] = {
        in: 'body',                            
        description: 'Users first name',
        schema: 'string',              
        required: true                     
  } */

  /* #swagger.parameters['last_name'] = {
        in: 'body',                            
        description: 'Users last name name',
        schema: 'string',               
        required: true                     
  } */

  /* #swagger.parameters['email_address'] = {
        in: 'body',                            
        description: 'Users email address',
        schema: 'string',                  
        required: true                     
  } */

  /* #swagger.parameters['phone_number'] = {
        in: 'body',                            
        description: 'Users phone number',
        schema: 'string',                 
        required: true                     
  } */

  const query = `
    INSERT INTO system.staff (staff_id, first_name, last_name, email_address, phone_number)
    VALUES ($1, $2, $3, $4, $5)
  `

  fields = [
    req.params.identifier, req.body.first_name, req.body.last_name,
    req.body.email_address, req.body.phone_number
  ]

  try {
    await client.query(query, fields)
    res.status(200).json({ result: 'User sucessfully created' })
  }
  catch (error) {
    console.log(error)

    if (error.constraint !== undefined) {
      const field = getConstraintName(error.constraint)
      res.status(400).json({ error: `${field} must be unique`, field: field })
    }
    else {
      res.status(400).json({ error: `Missing required field ${error.column}`, field: error.column })
    }
  }
})

app.put('/v1/resources/staff/:identifier/update', async function (req, res) {
  await setup()

  // #swagger.description = 'Update a staff member in the database'

  /* #swagger.parameters['identifier'] = {
      in: 'path',                            
      description: 'User identifier provided by cognito',             
      required: true                     
  } */

  /* #swagger.parameters['first_name'] = {
        in: 'body',                            
        description: 'Updated first name',
        schema: 'string',                 
        required: false                     
  } */

  /* #swagger.parameters['last_name'] = {
        in: 'body',                            
        description: 'Updated last name name',
        schema: 'string',                   
        required: false                     
  } */

  /* #swagger.parameters['email_address'] = {
        in: 'body',                            
        description: 'Updated email address',
        schema: 'string',                    
        required: false                     
  } */

  /* #swagger.parameters['phone_number'] = {
        in: 'body',                            
        description: 'Updated phone number',
        schema: 'string',                   
        required: false                     
  } */

  // Filter columns to generate a query based on provided body parameters
  const columns = ['first_name', 'last_name', 'email_address', 'phone_number'];

  const fields = columns.filter(field => req.body[field] !== undefined);
  const placeholders = fields.map((_, index) => `$${index + 2}`)

  const query = `
    INSERT INTO system.staff (staff_id, ${fields.join(", ")})
    VALUES ({${placeholders.join(', ')}})
  `

  try {
    await client.query(query, fields)
    res.status(200).json({ result: 'Update Sucessful' })
  }
  catch (error) {
    if (error.constraint !== undefined) {
      const field = getConstraintName(error.constraint)
      res.status(400).json({ error: `${field} must be unique`, field: field })
    }
  }
})

app.delete('/v1/resources/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Remove a staff member from the database'

  /* #swagger.parameters['identifier'] = {
      in: 'path',                            
      description: 'User identifier provided by cognito',                   
      required: true                     
  } */

  const result = await client.query(
    'DELETE FROM system.staff WHERE staff_id = $1', [req.params.identifier])

  if (result.rowCount > 0) {
    res.status(200).json({ result: 'Staff member sucessfully deleted' })
  }
  else {
    res.status(404).json({ error: 'Staff member not found' })
  }
})

app.listen(3000, function () {
  console.log('App started')
})

module.exports = app

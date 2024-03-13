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
    region: 'eu-west-1'
  })

  const response = await secretsClient.send(
    new SecretsManager.GetSecretValueCommand({
      SecretId: '/v1/database',
      VersionStage: 'AWSCURRENT'
    })
  )

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
    port: secrets.port
  })

  // Test the connection
  await client.connect()
  clientConnected = true

  console.log('Established database connection')
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
    'SELECT * FROM system.staff WHERE staff_id = $1',
    [req.params.identifier]
  )

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows[0] })
  } else {
    res.status(404).json({ error: 'Staff member not found' })
  }
})

app.post('/v1/resources/staff/search', async function (req, res) {
  await setup()

  // #swagger.description = 'Search for a staff member by a given field'

  /* #swagger.parameters['query'] = {
        in: 'body',                            
        description: 'The string to match to',
        schema: 'string',               
        required: false                     
  } */

  var result

  if (req.body.query) {
    const query = require('./queries').staff.search
    result = await client.query(query, [req.body.query])
  } else {
    const query = require('./queries').staff.all
    result = await client.query(query)
  }

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows })
  } else {
    res.status(404).json({ error: 'No Matching Staff' })
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

  fields = [
    req.body.first_name,
    req.body.last_name,

    req.body.email_address,
    req.body.phone_number,
    req.body.image
  ]

  try {
    const query = require('./queries').staff.create
    await client.query(query, [req.params.identifier, ...fields])

    res.status(200).json({ result: 'User Created' })
  } catch (error) {
    res.status(400).json({ error: error })
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

  fields = [
    req.body.first_name,
    req.body.last_name,

    req.body.email_address,
    req.body.phone_number,
    req.body.image
  ]

  try {
    const query = require('./queries').staff.update
    await client.query(query, [req.params.identifier, ...fields])

    res.status(200).json({ result: 'Update Sucessful' })
  } catch (error) {
    res.status(400).json({ error: error })
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
    'DELETE FROM system.staff WHERE staff_id = $1',
    [req.params.identifier]
  )

  if (result.rowCount > 0) {
    res.status(200).json({ result: 'User Sucessfully Deleted' })
  } else {
    res.status(404).json({ error: 'User not found' })
  }
})

app.listen(3000, function () {
  console.log('App started')
})

module.exports = app

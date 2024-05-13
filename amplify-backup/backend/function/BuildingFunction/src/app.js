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

app.get('/v1/resources/buildings', async function (req, res) {
  await setup()

  // #swagger.description = 'Retreive all buildings from the database'

  const query = 'SELECT building_id, name FROM system.buildings'
  const result = await client.query(query)

  res.status(200).json({
    result: result.rows
  })
})

app.get('/v1/resources/buildings/:building/', async function (req, res) {
  await setup()

  // #swagger.description = 'Retreive all rooms within a building'

  /* #swagger.parameters['building'] = {
      in: 'path',                            
      description: 'The building name',
      schema: 'string',                
      required: true                     
  } */

  const query = require('./queries').buildings.contents
  const result = await client.query(query, [req.params.building])

  if (result.rows.length > 0) {
    res.status(200).json({
      result: result.rows
    })
  } else {
    res.status(404).json({
      error: 'No rooms found'
    })
  }
})

app.listen(3000, function () {
  console.log('App started')
})

module.exports = app

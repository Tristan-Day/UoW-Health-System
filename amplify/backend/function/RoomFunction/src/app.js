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

app.get('/v1/resources/room/:name', async function (req, res) {
  await setup()

  // #swagger.description = 'Get rooms matching a given name'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The room name to lookup',                   
        required: true                     
  } */

  const query = require("./queries").rooms.select
  const result = await client.query(query, [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows })
  }
  else {
    res.status(404).json({ error: 'Room not found' })
  }
});

// ✔️ Validated by mock test 11/01/2024 (Tristan Day)

app.put('/v1/resources/room/:name/create', async function (req, res) {
  await setup()

  // #swagger.description = 'Create a new room'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The name of the room to create',                   
        required: true                     
  } */

  /* #swagger.parameters['building'] = {
        in: 'body',                            
        description: 'The building the room is located in',                   
        required: true                     
  } */

  /* #swagger.parameters['floor'] = {
        in: 'body',                            
        description: 'The floor number the room is located on',                   
        required: true                     
  } */

  /* #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'An optional description string',                   
        required: false                     
  } */

  if (req.body.building === undefined) {
    res.status(400).json({ error: "A buidling name is required" })
  }

  if (req.body.floor === undefined) {
    res.status(400).json({ error: "A floor number is required" })
  }

  // Attempt to retreive the building ID
  var buildingQuery = 'SELECT building_id FROM system.buildings WHERE name = $1'
  var buildingResult = await client.query(buildingQuery, [req.body.building]);

  if (buildingResult.rows.length !== 1) {
    // The building doesnt exist, create it
    buildingQuery = require("./queries").buildings.insert
    buildingResult = await client.query(query, [req.body.name]);
  }

  var query
  var fields

  // Logic to handle the optional room description
  if (req.body.description !== undefined) {
    query = 'INSERT INTO system.rooms (building_id, floor, name, description) VALUES ($1, $2, $3, $4)'
    fields = [buildingResult.rows[0].buidling_id, req.body.floor, req.params.name, req.body.description]
  }
  else {
    query = 'INSERT INTO system.rooms (building_id, floor, name) VALUES ($1, $2, $3)'
    fields = [buildingResult.rows[0].buidling_id, req.body.floor, req.params.name]
  }

  try {
    await client.query(query, fields)
    res.status(200).json({ result: "Room sucessfully created" })
  }
  catch (error) {
    res.status(409).json({ error: "Room already exists" })
  }
});

// ✔️ Validated by mock test 11/01/2024 (Tristan Day)

app.put('/v1/resources/room/:identifier/update', async function (req, res) {
  await setup()

  // #swagger.description = 'Update the description for a give room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room to update',                   
        required: true                     
  } */

  /* #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'The new description string',                   
        required: true                     
  } */

  const query = 'UPDATE system.rooms SET description = $2 WHERE room_id = $1'
  const result = await client.query(query, [req.params.identifier, req.body.description])

  if (result.rowCount > 0) {
    res.status(200).json({ result: "Room description sucessfully updated" })
  }
  else {
    res.status(404).json({ error: "Room not found" })
  }
});

// ✔️ Validated by mock test 11/01/2024 (Tristan Day)

app.delete('/v1/resources/room/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Delete a given room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room to delete',                   
        required: true                     
  } */

  const query = 'DELETE FROM system.rooms WHERE name = $1'
  const result = await client.query(query, [req.params.identifier])

  if (result.rowCount > 0) {
    res.status(200).json({ result: "Room sucessfully deleted" })
  }
  else {
    res.status(404).json({ error: "Room not found" })
  }
});

app.listen(3000, function () {
  console.log("App started")
});

module.exports = app

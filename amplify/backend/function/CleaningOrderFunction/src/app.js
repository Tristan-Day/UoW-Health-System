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

app.get('/v1/orders/cleaning/room/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get all cleaning orders for a given room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room to lookup',                   
        required: true                     
  } */

  /* #swagger.parameters['fulfilled'] = {
        in: 'query',                            
        description: 'Boolean exclusion of unfulfilled cleaning orders',                   
        required: false                     
  } */

  // Handle optional query paramter, exluding records without a fulfillment timestamp
  var filter = req.query.fulfilled ? "AND order.fulfilled IS NOT NULL" : ""

  // Import the SQL statement from order queries
  const query = require("./queries").orders.all + filter
  const result = await client.query(query, [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows })
  }
  else {
    res.status(404).json({ error: "No orders found" })
  }
})

app.post('/v1/orders/cleaning/room/:identifier/issue', async function (req, res) {
  await setup()

  // #swagger.description = 'Issue a new cleaning order for a given room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room to issue the order for',                   
        required: true                     
  } */

  // Check if there are any outstanding orders for the given room
  const query = require("./queries").orders.all + "AND order.fulfilled IS NOT NULL"
  const result = await client.query(query, [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(409).json({ error: "Room has an outstanding cleaning order" })
    return
  }

  // Generate a timestamp
  const timestamp = new Date().toISOString();

  try {
    // Since there are not outstanding orders, create a new order
    query = 'INSERT INTO system.cleaning_orders (room_id, date_added) VALUES ($1, $2)'
    await client.query(query, [roomResult.rows[0].room_id, timestamp])

    res.status(200).json({ response: "Cleaning order submitted" })
  }
  catch (error) {
    // Handle the conditon that the foreign key is invalid
    res.status(409).json({ error: "Room not found" })
  }
})

app.post('/v1/orders/cleaning/room/:identifier/fulfil', async function (req, res) {
  await setup()

  // #swagger.description = 'Fulfil a cleaning order for a given room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room identifier',                   
        required: true                     
  } */

  /* #swagger.parameters['cleaner'] = {
      in: 'body',                            
      description: 'Identifier of the cleaner',                   
      required: true                     
  } */

  if (req.body.cleaner === undefined) {
    res.status(400).json({ error: "A cleaner must be specified" })
    return
  }

  // Get the room_id and check if an outstanding order is already present
  var query = require("./queries").orders.all + "AND order.fulfilled IS NULL"
  const roomResult = await client.query(query, [req.params.identifier])

  if (roomResult.rows.length > 0) {
    res.status(409).json({ error: "Room does not exist or has no outstanding orders" })
    return
  }

  try {
    // Fulfil the order
    query = require("./queries").orders.fulfill
    const orderResult = await client.query(query, [roomResult.rows[0].room_id, req.body.cleaner])

    if (orderResult.rowCount > 0) {
      res.status(200).json({ response: "Cleaning order submitted" })
    }
    else {
      res.status(404).json({ error: "Room not found" })
    }
  }
  catch (error) {
    // Handle the case where the provided staff identifier is invalid
    res.status(404).json({ error: "Staff member not found" })
  }
})

app.delete('/v1/orders/cleaning/room/:identifier/cancel', async function (req, res) {
  await setup()

  // #swagger.description = 'Cancel a cleaning order for a given room'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The room identifier',                   
        required: true                     
  } */

  // Check if an outstanding order is present
  var query = require("./queries").orders.all + "AND order.fulfilled IS NULL"
  const roomResult = await client.query(query, [req.params.identifier])

  if (roomResult.rows.length === 0) {
    res.status(409).json({ error: "Room does not exist or has no outstanding orders" })
    return
  }

  // Cancel the order
  query = require("./queries").orders.cancel
  const orderResult = await client.query(query, [req.params.identifier])

  if (orderResult.rowCount > 0) {
    res.status(200).json({ response: "Cleaning order submitted" })
  }
  else {
    res.status(404).json({ error: "Room not found" })
  }
})

app.listen(3000, function () {
  console.log("App started")
})

module.exports = app

/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use
this file except in compliance with the License. A copy of the License is
located at http://aws.amazon.com/apache2.0/ or in the "license" file
accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
for the specific language governing permissions and limitations under the
License.
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
});

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
  });

  const response =
    await secretsClient.send(new SecretsManager.GetSecretValueCommand({
      SecretId: '/v1/database',
      VersionStage: 'AWSCURRENT',
    }));

  secrets = JSON.parse(response.SecretString);
  console.log('Sucessfully collected secrets')

  // Connect to Postgres
  const { Pool } = require('pg');

  client = new Pool({
    user: secrets.username,
    password: secrets.password,

    database: secrets.dbname,
    ssl: { rejectUnauthorized: false },

    host: secrets.host,
    port: secrets.port,
  });

  // Test the connection
  await client.connect()
  clientConnected = true

  console.log('Established database connection')
}

/****************************************************
 * Retreive a Single Staff Member from the Database *
 ****************************************************/

app.get('/v1/resources/staff/:identifier', async function (req, res) {
  await setup()

  const result = await client.query(
    'SELECT * FROM system.staff WHERE staff_id = $1', [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(200).json(result.rows)
  }
  else {
    res.status(404).json({ result: 'Staff member not found' })
  }
});

/************************************************************
 * Retreive Matching Staff Members by a given set of Fields *
 ************************************************************/

app.post('/v1/resources/staff/search', async function (req, res) {
  await setup()

  // Basic error handling
  if (req.body.fields === undefined) {
    res.status(404).send(`Missing body parameter 'fields'`)
  }

  if (req.query.string === undefined) {
    res.status(404).send(`Missing query parameter 'string'`)
  }

  // Prevent SQL injection attacks
  const whitelist = ['first_name', 'last_name', 'email_address', 'phone_number']

  excluded = req.body.fields.filter((value) => !(whitelist.includes(value)))
  columns = req.body.fields.filter((value) => whitelist.includes(value))

  if (excluded.length > 0) {
    res.status(404).json({ response: `Illegal field(s) '${excluded}'` })
  }

  // Generate an SQL statement
  var conditions = [];
  const condition = req.query.regex ? '~' : '='

  columns.forEach((field) => {
    conditions.push(`${field} ${condition} $1`);
  });
  var query = `SELECT * FROM system.staff WHERE ${conditions.join(' OR ')}`

  var result
  try {
    result = await client.query(query, [req.query.string])
  } catch (error) {
    console.log(error)

    res.status(500).send({ result: 'Unhandled error' })
    return
  }

  if (result.rowCount < 1) {
    res.status(404).json({ result: 'No matching staff' })
    return
  }

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size;
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    var pages = []

    while (result.rows.length > 0) {
      pages.push(a.splice(0, pagnetationSize))
    }

    try {
      res.status(200).json({ page: pages[pagnetationIndex], size: result.rowCount })
    } catch (error) {
      res.status(400).json({ result: 'Page index out of range' })
    }
  }
  else {
    res.status(200).json(result.rows)
  }
});

/********************************************************
 * Create or Update Single Staff Member in the Database *
 ********************************************************/

app.put('/v1/resources/staff/:identifier', async function (req, res) {
  await setup()

  const query = `
    INSERT INTO system.staff (staff_id, first_name, last_name, email_address, phone_number)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (staff_id) DO UPDATE
    SET first_name = $2, last_name = $3, email_address = $4, phone_number = $5
  `

  fields =
    [
      req.params.identifier, req.body.first_name, req.body.last_name,
      req.body.email_address, req.body.phone_number
    ]

  try {
    await client.query(query, fields)
    res.status(200).json({ result: 'Update Sucessful' })
  } catch (error) {
    console.log(error)

    if (error.constraint !== undefined) {
      var field;
      switch (error.constraint) {
        case 'email_unique':
          field = 'Email Address'
          break;

        case 'phone_unique':
          field = 'Phone Number'
          break;

        default:
          field = 'Identifier'
          break;
      }

      res.status(400).json({ result: `${field} must be unique` })
    }
    else {
      res.status(400).json({ result: `Missing required field ${error.column}` })
    }
  }
});

/**************************************************
 * Delete a Single Staff Member from the Database *
 **************************************************/

app.delete('/v1/resources/staff/:identifier', async function (req, res) {
  await setup()

  const result = await client.query(
    'DELETE FROM system.staff WHERE staff_id = $1', [req.params.identifier])

  if (result.rowCount > 0) {
    res.status(200).json({ result: 'Staff member sucessfully deleted' })
  }
  else {
    res.status(404).json({ result: 'Staff member not found' })
  }
});

app.listen(3000, function () {
  console.log('App started')
});

module.exports = app

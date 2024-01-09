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

// declare a new express app
const app = express()
app.use(require('body-parser').json())
app.use(require('aws-serverless-express/middleware').eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
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
  const {Pool} = require('pg');

  client = new Pool({
    user: secrets.username,
    password: secrets.password,

    database: secrets.dbname,
    ssl: {rejectUnauthorized: false},

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

app.get('/v1/resources/staff/:identifier', async function(req, res) {
  await setup()

  const result = await client.query('SELECT * FROM system.staff WHERE staff_id = $1', [req.params.identifier])
  
  if (result.rows.length > 0)
  {
    res.status(200).json(result.rows)
  }
  res.status(404).send()
});

// app.get('/v1/resources/staff/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// /****************************
// * Example post method *
// ****************************/

// app.post('/v1/resources/staff', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// app.post('/v1/resources/staff/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example put method *
// ****************************/

// app.put('/v1/resources/staff', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/v1/resources/staff/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example delete method *
// ****************************/

// app.delete('/v1/resources/staff', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/v1/resources/staff/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

app.listen(3000, function() {
  console.log('App started')
});

module.exports = app

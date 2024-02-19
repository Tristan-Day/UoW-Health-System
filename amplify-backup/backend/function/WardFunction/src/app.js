/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const SecretsManager = require('@aws-sdk/client-secrets-manager')
const AWS = require('aws-sdk')
const { Pool } = require('pg')
const WardAPI = require('./wardApi')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// Use Secrets to avoid leakage on Github

async function setup() {

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

  client = new Pool({
    user: secrets.username,
    password: secrets.password,

    database: secrets.dbname,
    ssl: { rejectUnauthorized: false },

    host: secrets.host,
    port: secrets.port,
  })

  // Test the connection
  const connection = await client.connect();

  return connection;
}

app.get('/v1/resources/ward', (req, res) => {

  // #swagger.description = 'View a treatment item'

  /* #swagger.parameters['WARD_ID'] = {
      in: 'query string',                            
      description: 'The unique ID for the ward.',               
      required: false              
  } */

  /* #swagger.parameters['WARD_NAME'] = {
    in: 'query string',                            
    description: 'The name of the ward.',               
    required: false              
  } */

  /* #swagger.parameters['SPECIALISATION'] = {
        in: 'query string',                            
        description: 'The ward specialisation.',               
        required: false              
  } */

  /* #swagger.parameters['DESCRIPTION'] = {
        in: 'query string',                            
        description: 'The ward description.',               
        required: false              
  } */

  /* #swagger.parameters['ICON_DATA'] = {
        in: 'query string',                            
        description: 'The reference for data for an icon.',               
        required: false              
  } */

  return WardAPI.query(req, res, setup);

});


app.post('/v1/resources/ward', (req, res) => {

  // #swagger.description = 'Import or update a ward'

  /* #swagger.parameters['ACTION_TYPE'] = {
        in: 'body',                            
        description: 'Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option.',               
        required: false
  } */

  /* #swagger.parameters['WARD_ID'] = {
      in: 'body',                            
      description: 'The unique ID for the ward.',               
      required: false              
  } */

  /* #swagger.parameters['WARD_NAME'] = {
    in: 'body',                            
    description: 'The name of the ward.',               
    required: false              
  } */

  /* #swagger.parameters['SPECIALISATION'] = {
        in: 'body',                            
        description: 'The ward specialisation.',               
        required: false              
  } */

  /* #swagger.parameters['DESCRIPTION'] = {
        in: 'body',                            
        description: 'The ward description.',               
        required: false              
  } */

  /* #swagger.parameters['ICON_DATA'] = {
        in: 'body',                            
        description: 'The reference for data for an icon.',               
        required: false              
  } */

  return WardAPI.upsert(req, res, setup);

});

app.put('/v1/resources/ward', (req, res) => {

  // #swagger.description = 'Import or update a ward'

  /* #swagger.parameters['ACTION_TYPE'] = {
        in: 'body',                            
        description: 'Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option.',               
        required: false
  } */

  /* #swagger.parameters['WARD_ID'] = {
      in: 'body',                            
      description: 'The unique ID for the ward.',               
      required: false              
  } */

  /* #swagger.parameters['WARD_NAME'] = {
    in: 'body',                            
    description: 'The name of the ward.',               
    required: false              
  } */

  /* #swagger.parameters['SPECIALISATION'] = {
        in: 'body',                            
        description: 'The ward specialisation.',               
        required: false              
  } */

  /* #swagger.parameters['DESCRIPTION'] = {
        in: 'body',                            
        description: 'The ward description.',               
        required: false              
  } */

  /* #swagger.parameters['ICON_DATA'] = {
        in: 'body',                            
        description: 'The reference for data for an icon.',               
        required: false              
  } */

  return WardAPI.upsert(req, res, setup);

});

app.delete('/v1/resources/ward', (req, res) => {

  // #swagger.description = 'Import or update a ward'

  /* #swagger.parameters['WARD_ID'] = {
      in: 'body',                            
      description: 'The unique ID for the ward.',               
      required: false              
  } */

  return WardAPI.delete(req, res, setup);

});


app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

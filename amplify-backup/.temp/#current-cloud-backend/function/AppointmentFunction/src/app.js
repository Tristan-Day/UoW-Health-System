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
const AWS = require('aws-sdk')
const { Pool } = require('pg')
const AppointmentAPI = require('./appointmentAPI')

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

const SecretsManager = require('@aws-sdk/client-secrets-manager')

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

app.get('/v1/resources/appointments', (req, res) => {

  // #swagger.description = 'Get a single appointment row, all rows or rows where a criteria is met'

  /* #swagger.parameters['APPOINTMENT_ID'] = {
        in: 'query string',                            
        description: 'The unique identifier for the appointment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['PATIENT_ID'] = {
        in: 'query string',                            
        description: 'The unique identifier for a patient',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['TREATMENT_ID'] = {
        in: 'query string',                            
        description: 'The unique identifier for a treatment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['SCHEDULE_ITEM_ID'] = {
        in: 'query string',                            
        description: 'The unique identifier for a schedule item',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['STAFF_ID'] = {
        in: 'query string',                            
        description: 'The unique identifier for a staff member',               
        required: false,
        type: 'integer'                  
  } */

  return AppointmentAPI.query(req, res, setup);
});

app.post('/v1/resources/appointments', (req, res) => {

  // #swagger.description = 'Insert or update an appointment'

  /* #swagger.parameters['ACTION_TYPE'] = {
        in: 'body',                            
        description: 'Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option.',               
        required: false,
        type: 'string'                  
  } */

  /* #swagger.parameters['APPOINTMENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for the appointment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['START_TIMESTAMP'] = {
      in: 'body',                            
      description: 'A timestamp showing the start of the appointment',               
      required: false,
      type: 'string (converted from ISO datetime)'                  
  } */

  /* #swagger.parameters['ESTIMATED_DURATION_MINUTES'] = {
    in: 'body',                            
    description: 'The estimated duration of an appointment in minutes',               
    required: false,
    type: 'integer'                  
  } */

  /* #swagger.parameters['PATIENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a patient',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['TREATMENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a treatment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['SCHEDULE_ITEM_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a schedule item',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['STAFF_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a staff member',               
        required: false,
        type: 'integer'                  
  } */

  return AppointmentAPI.upsert(req, res, setup);
});

app.put('/v1/resources/appointments', (req, res) => {

  // #swagger.description = 'Insert or update an appointment'

  /* #swagger.parameters['ACTION_TYPE'] = {
        in: 'body',                            
        description: 'Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option.',               
        required: false,
        type: 'string'                  
  } */

  /* #swagger.parameters['APPOINTMENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for the appointment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['START_TIMESTAMP'] = {
      in: 'body',                            
      description: 'A timestamp showing the start of the appointment',               
      required: false,
      type: 'string (converted from ISO datetime)'                  
  } */

  /* #swagger.parameters['ESTIMATED_DURATION_MINUTES'] = {
    in: 'body',                            
    description: 'The estimated duration of an appointment in minutes',               
    required: false,
    type: 'integer'                  
  } */

  /* #swagger.parameters['PATIENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a patient',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['TREATMENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a treatment',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['SCHEDULE_ITEM_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a schedule item',               
        required: false,
        type: 'integer'                  
  } */

  /* #swagger.parameters['STAFF_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for a staff member',               
        required: false,
        type: 'integer'                  
  } */

  return AppointmentAPI.upsert(req, res, setup);
});

app.delete('/v1/resources/appointments', (req, res) => {

  // #swagger.description = 'Delete an appointment'

  /* #swagger.parameters['APPOINTMENT_ID'] = {
        in: 'body',                            
        description: 'The unique identifier for the appointment',               
        required: false,
        type: 'integer'                  
  } */

  return AppointmentAPI.delete(req, res, setup)

});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

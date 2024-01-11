/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["SQL_HOST","SQL_USER","SQL_PASSWORD","SQL_PORT","SQL_DB_NAME"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_WARDHANDLER_APIID
	API_WARDHANDLER_APINAME
	ENV
	REGION
Amplify Params - DO NOT EDIT *//*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["SQL_HOST","SQL_USER","SQL_PASSWORD","SQL_PORT","SQL_DB_NAME"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["SQL_HOST","SQL_USER","SQL_PASSWORD","SQL_PORT","SQL_DB_NAME"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
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
  const pool = new Pool({
    user: "dbmasteruser",
    password: "%7E%7I2{{JGcj>+;;)&8V)O!alck8b,D",
    host: "ls-3bda3eee5c1f5cddd993bafcbed1131d817112cf.cof6aw3qpjit.eu-west-2.rds.amazonaws.com",
    port: "5432", // default Postgres port
    database: "postgres",
    ssl: {
      rejectUnauthorized: false
    }
  });

  const connection = await pool.connect();

  return connection;
}

/**********************
 * Example get method *
 **********************/

app.get('/ward', (req, res) => WardAPI.query(req, res, setup));

// app.get('/ward/*', (req, res) => WardAPI.query(req, res, setup));

/****************************
* Example post method *
****************************/

app.post('/ward', (req, res) => WardAPI.upsert(req, res, setup));

// app.post('/ward/*', (req, res) => WardAPI.upsert(req, res, setup));

/****************************
* Example put method *
****************************/

app.put('/ward', (req, res) => WardAPI.upsert(req, res, setup));

// app.put('/ward/*', (req, res) => WardAPI.upsert(req, res, setup));  

/****************************
* Example delete method *
****************************/

app.delete('/ward', (req, res) => WardAPI.delete(req, res, setup));

// app.delete('/ward/*', (req, res) => WardAPI.delete(req, res, setup));

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app

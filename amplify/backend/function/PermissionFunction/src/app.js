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

function pagnetate(items, size, index) {
  var pages = []

  while (items.length > 0) {
    pages.push(items.splice(0, size))
  }

  try {
    return pages[index]
  } catch (error) {
    throw new Error("Index out of range")
  }
}

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get all or check the presense of a set of given permissions'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff identifier provided by cognito',                   
        required: true                     
  } */

  // Import the SQL statement from permission queries
  const query = require("./queries").permissions.all
  const result = await client.query(query, [req.params.identifier])

  if (req.body.permissions === undefined) {
    res.status(200).json({ result: result.rows })
    return
  }

  if (!(Array.isArray(req.body.permissions))) {
    res.status(400).json({ result: "Permissions must be given as an array of identifiers" })
    return
  }

  // Check each supplied permission against the list of returned values 
  const mapping = req.body.permissions.map((item) => ({
    [item]: result.rows.filter((row) => row.name === item) > 0
  }))

  res.status(200).json(mapping)
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/roles/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get all or check the presense of a set of given roles'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff identifier provided by cognito',                   
        required: true                     
  } */

  /* #swagger.parameters['roles'] = {
      in: 'body',                            
      description: 'An array of role names to test the specified user against',                   
      required: true,           
  } */

  // Import the SQL statement from role queries
  const query = require("./queries").roles.all
  const result = await client.query(query, [req.params.identifier])

  if (req.body.roles === undefined) {
    res.status(200).json({ result: result.rows })
    return
  }

  if (!(Array.isArray(req.body.roles))) {
    res.status(400).json({ result: "Roles must be given as an array of identifiers" })
    return
  }

  // Check each supplied permission against the list of returned values 
  const mapping = req.body.roles.map((item) => ({
    [item]: result.rows.filter((row) => row.name === item).length > 0
  }))

  res.status(200).json(mapping)
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get a specific permission from a given name'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The permission to retreive',                   
        required: true                     
  } */

  const result = await client.query(
    'SELECT name, description FROM system.permissions WHERE name = $1', [req.params.identifier])

  if (result.rows.length > 0) {
    res.status(200).json(result.rows[0])
  }
  else {
    res.status(404).json({ result: 'Permission not found' })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/role/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get a specific role and its permissions from a given name'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The role to retreive',                   
        required: true                     
  } */

  var roleResult = await client.query(
    'SELECT name, description FROM system.roles WHERE name = $1', [req.params.identifier])

  if (roleResult.rows.length > 0) {
    // Get permissions attached to the role
    const query = require("./queries").roles.permissions
    const permissionResult = await client.query(query, [req.params.identifier])

    res.status(200).json({ ...roleResult.rows[0], permissions: permissionResult.rows })
  }
  else {
    res.status(404).json({ result: 'Role not found' })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/:identifier/members', async function (req, res) {
  await setup()

  // #swagger.description = 'Get staff associated with a specific permission. [Supports Pagnetation]'

  /* #swagger.parameters['identifier'] = {
      in: 'path',                            
      description: 'The permission to retreive members from',                   
      required: true                     
  } */

  /* #swagger.parameters['size'] = {
      in: 'query',                            
      description: 'Size of returned page',                   
      required: false                     
  } */

  /* #swagger.parameters['index'] = {
      in: 'query',                            
      description: 'Index of returned page',                   
      required: false                     
  } */

  // Import the SQL statement from role queries
  const query = require("./queries").permissions.members
  const result = await client.query(query, [req.params.identifier])

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    try {
      page = pagnetate(result.rows, pagnetationSize, pagnetationIndex)
      res.status(200).json({ result: page })
    }
    catch (error) {
      res.status(416).json({ result: 'Error pagentating results' })
    }
  }
  else {
    res.status(200).json(result.rows)
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.get('/v1/permissions/role/:identifier/members', async function (req, res) {
  await setup()

  // #swagger.description = 'Get staff associated with a specific role [Supports Pagnetation]'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The role to retreive members from',                   
        required: true                     
  } */

  /* #swagger.parameters['size'] = {
      in: 'query',                            
      description: 'Size of returned page',                   
      required: false                     
  } */

  /* #swagger.parameters['index'] = {
      in: 'query',                            
      description: 'Index of returned page',                   
      required: false                     
  } */

  // Import the SQL statement from role queries
  const query = require("./queries").roles.members
  const result = await client.query(query, [req.params.identifier])

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    try {
      page = pagnetate(result.rows, pagnetationSize, pagnetationIndex)
      res.status(200).json({ result: page })
    }
    catch (error) {
      res.status(416).json({ result: 'Error pagentating results' })
    }
  }
  else {
    res.status(200).json(result.rows)
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.put('/v1/permissions/staff/:identifier/grant', async function (req, res) {
  await setup()

  // #swagger.description = 'Grant a specific set of permissions to a given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff member grant permissions to',                   
        required: true                     
  } */

  /* #swagger.parameters['permissions'] = {
        in: 'body',                            
        description: 'An array of permission strings',                   
        required: true                     
  } */

  if (req.body.permissions === undefined) {
    res.status(400).json({ result: "A set of permissions must be specified within the request body" })
    return
  }

  if (!(Array.isArray(req.body.permissions))) {
    res.status(400).json({ result: "Permissions must be given as an array" })
    return
  }

  var errors = []
  var permissions = {}

  // Lookup the primary key for each permission
  for (permission of req.body.permissions) {
    const result = await client.query(
      'SELECT permission_id FROM system.permissions WHERE system.permissions."name" = $1', [permission]
    )

    if (result.rowCount > 0) {
      permissions[permission] = result.rows[0].permission_id
    }
    else {
      res.status(404).json({ result: `Permission '${permission}' not found` })
      return
    }
  }

  // Attempt to revoke each permission
  for (var [name, identifier] of Object.entries(permissions)) {

    try {
      await client.query(
        'INSERT INTO system.staff_permissions (staff_id, permission_id) VALUES ($1, $2)', [req.params.identifier, identifier]
      )
    }
    catch (error) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res.status(409).json({ result: "Some permissions where already granted", failed: errors })
  }
  else {
    res.status(200).json({ result: "All permissions sucessfully granted" })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.put('/v1/permissions/staff/:identifier/revoke', async function (req, res) {
  await setup()

  // #swagger.description = 'Revoke a specific set of permissions from given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff member revoke permissions from',                   
        required: true                     
  } */

  /* #swagger.parameters['permissions'] = {
        in: 'body',                            
        description: 'An array of permission strings',                   
        required: true                     
  } */

  if (req.body.permissions === undefined) {
    res.status(400).json({ result: "A set of permissions must be specified within the request body" })
    return
  }

  if (!(Array.isArray(req.body.permissions))) {
    res.status(400).json({ result: "Permissions must be given as an array" })
    return
  }

  var errors = []
  var permissions = {}

  // Lookup the primary key for each permission
  for (permission of req.body.permissions) {
    const result = await client.query(
      'SELECT permission_id FROM system.permissions WHERE system.permissions."name" = $1', [permission]
    )

    if (result.rowCount > 0) {
      permissions[permission] = result.rows[0].permission_id
    }
    else {
      res.status(404).json({ result: `Permission '${permission}' not found` })
      return
    }
  }

  // Attempt to revoke each permission
  for (var [name, identifier] of Object.entries(permissions)) {
    const result = await client.query(
      'DELETE FROM system.staff_permissions WHERE staff_id = $1 AND permission_id = $2', [req.params.identifier, identifier]
    )

    if (result.rowCount < 1) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res.status(409).json({ result: "Some permissions where not revoked due to an error", failed: errors })
  }
  else {
    res.status(200).json({ result: "All permissions sucessfully revoked" })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.put('/v1/permissions/roles/staff/:identifier/grant', async function (req, res) {
  await setup()

  // #swagger.description = 'Grant a specific set of roles to a given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff member grant roles to',                   
        required: true                     
  } */

  /* #swagger.parameters['roles'] = {
        in: 'body',                            
        description: 'An array of role strings',                   
        required: true                     
  } */

  if (req.body.roles === undefined) {
    res.status(400).json({ result: "A set of roles must be specified within the request body" })
    return
  }

  if (!(Array.isArray(req.body.roles))) {
    res.status(400).json({ result: "Roles must be given as an array" })
    return
  }

  var errors = []
  var roles = {}

  for (role of req.body.roles) {
    const result = await client.query(
      'SELECT role_id FROM system.roles WHERE system.roles."name" = $1', [role]
    )

    if (result.rowCount > 0) {
      roles[role] = result.rows[0].role_id
    }
    else {
      res.status(404).json({ result: `Role '${role}' not found` })
      return
    }
  }

  // Attempt to grant each role
  for (var [name, identifier] of Object.entries(roles)) {
    const result = await client.query(
      'INSERT INTO system.staff_roles (staff_id, role_id) VALUES ($1, $2)', [req.params.identifier, identifier]
    )

    if (result.rowCount < 1) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res.status(409).json({ result: "Some roles where not granted due to an error", failed: failedAssignments })
  }
  else {
    res.status(200).json({ result: "All roles sucessfully granted" })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.put('/v1/permissions/roles/staff/:identifier/revoke', async function (req, res) {
  await setup()

  // #swagger.description = 'Revoke a specific set of roles from given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff member revoke roles from',                   
        required: true                     
  } */

  /* #swagger.parameters['identifier'] = {
        in: 'body',                            
        description: 'An array of role strings',                   
        required: true                     
  } */

  if (req.body.roles === undefined) {
    res.status(400).json({ result: "A set of roles must be specified within the request body" })
    return
  }

  if (!(Array.isArray(req.body.roles))) {
    res.status(400).json({ result: "Roles must be given as an array" })
    return
  }

  var errors = []
  var roles = {}

  // Map readable permission names to permission identifiers
  for (role of req.body.roles) {
    const result = await client.query(
      'SELECT role_id FROM system.roles WHERE system.roles."name" = $1', [role]
    )

    if (result.rowCount > 0) {
      roles[role] = result.rows[0].role_id
    }
    else {
      res.status(404).json({ result: `Role '${role}' not found` })
      return
    }
  }

  // Attempt to revoke each role
  for (var [name, identifier] of Object.entries(roles)) {
    const result = await client.query(
      'DELETE FROM system.staff_roles WHERE staff_id = $1 AND role_id = $2', [req.params.identifier, identifier]
    )

    if (result.rowCount < 1) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res.status(409).json({ result: "Some roles where not revoked due to an error", failed: errors })
  }
  else {
    res.status(200).json({ result: "All roles sucessfully revoked" })
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.put('/v1/permissions/roles/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Create or Update a given role'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The role to update',                   
        required: true                     
  } */

  /* #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'The updated description string',                   
        required: false                     
  } */

  if (req.body.description !== undefined) {
    const query = `
      INSERT INTO system.roles (name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO UPDATE
      SET name = $1, description = $2
    `

    await client.query(query, [req.params.identifier, req.body.description])
    res.status(200).json({ result: "Role sucessfully updated" })
    return
  }

  try {
    await client.query('INSERT INTO system.roles (name) VALUES ($1)', [req.params.identifier])
    res.status(200).json("Role sucessfully updated")
  }
  catch (error) {
    res.status(409).json("Role already exists")
  }
})

// ✔️ Validated by mock test 10/01/2024 (Tristan Day)

app.delete('/v1/permissions/roles/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Delete a given role'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The role to delete',                   
        required: true                     
  } */

  const result = await client.query('DELETE FROM system.roles WHERE system.roles.name = $1', [req.params.identifier])

  if (result.rowCount > 0) {
    res.status(200).json("Role sucessfully deleted")
  }
  else {
    res.status(404).json("Role not found")
  }
})

app.listen(3000, function () {
  console.log("App started")
})

module.exports = app

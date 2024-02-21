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

function pagnetate(items, size, index) {
  var pages = []

  while (items.length > 0) {
    pages.push(items.splice(0, size))
  }

  try {
    return pages[index]
  } catch (error) {
    throw new Error('Index out of range')
  }
}

// Looks up the internal identifiers from a given set of names
async function identify(items, table, identifier) {
  var errors = []
  var identifiers = {}

  // Where item is the name to lookup
  for (item of items) {
    const result = await client.query(
      `SELECT ${identifier} FROM ${table} WHERE name = $1`,
      [item]
    )

    if (result.rowCount > 0) {
      identifiers[item] = result.rows[0][identifier]
    } else {
      errors.push(item)
    }
  }

  return { result: identifiers, errors: errors }
}

app.get('/v1/permissions/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get all or check the presense of a set of given permissions'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff identifier provided by cognito',
        schema: 'string',                
        required: true                     
  } */

  // Import the SQL statement from permission queries
  const query = require('./queries').permissions.assigned
  const result = await client.query(query, [req.params.identifier])

  if (req.body.permissions === undefined) {
    res.status(200).json({ result: result.rows })
    return
  }

  if (!Array.isArray(req.body.permissions)) {
    res.status(400).json({ error: 'Permissions must be given as an array' })
    return
  }

  // Check each permission against the list of returned values
  const mapping = {}

  req.body.permissions.forEach(item => {
    mapping[item] = result.rows.filter(row => row.name === item).length > 0
  })

  res.status(200).json({ result: mapping })
})

app.get('/v1/permissions/roles/staff/:identifier', async function (req, res) {
  await setup()

  // #swagger.description = 'Get all or check the presense of a set of given roles'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'The staff identifier provided by cognito',
        schema: 'string',                 
        required: true                     
  } */

  /* #swagger.parameters['roles'] = {
      in: 'body',                            
      description: 'An array of role names to test the specified user against',
      schema: 'array',                  
      required: true,           
  } */

  // Import the SQL statement from role queries
  const query = require('./queries').roles.assigned
  const result = await client.query(query, [req.params.identifier])

  if (req.body.roles === undefined) {
    res.status(200).json({ result: result.rows })
    return
  }

  if (!Array.isArray(req.body.roles)) {
    res.status(400).json({ error: 'Roles must be given as an array' })
    return
  }

  // Check each permission against the list of returned values
  const mapping = {}

  req.body.roles.forEach(item => {
    mapping[item] = result.rows.filter(row => row.name === item).length > 0
  })

  res.status(200).json({ result: mapping })
})

app.get('/v1/permissions/:name', async function (req, res) {
  await setup()

  // #swagger.description = 'Get a permission description from a given name'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The permission to retreive',
        schema: 'string',                   
        required: true                     
  } */

  const result = await client.query(
    'SELECT name, description FROM system.permissions WHERE name = $1',
    [req.params.name]
  )

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows[0] })
  } else {
    res.status(404).json({ error: 'Permission not found' })
  }
})

app.get('/v1/permissions/roles/:name', async function (req, res) {
  await setup()

  // #swagger.description = 'Get a role and its associated permissions'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The role to retreive from the database',
        schema: 'string',           
        required: true                     
  } */

  var query = 'SELECT name, description FROM system.roles WHERE name = $1'
  var roleResult = await client.query(query, [req.params.name])

  if (roleResult.rows.length === 0) {
    res.status(404).json({ error: 'Role not found' })
    return
  }

  // Get permissions attached to the role
  query = require('./queries').roles.permissions
  const permissionResult = await client.query(query, [req.params.name])

  res
    .status(200)
    .json({
      result: { ...roleResult.rows[0], permissions: permissionResult.rows }
    })
})

app.get('/v1/permissions/:name/members', async function (req, res) {
  await setup()

  // #swagger.description = 'Get staff associated with a specific permission. [Supports Pagnetation]'

  /* #swagger.parameters['name'] = {
      in: 'path',                            
      description: 'The permission name',
      schema: 'string',              
      required: true                     
  } */

  /* #swagger.parameters['size'] = {
      in: 'query',                            
      description: 'Size of the returned page',                   
      schema: 'integer',  
      required: false                     
  } */

  /* #swagger.parameters['index'] = {
      in: 'query',                            
      description: 'Index of the returned page',                   
      schema: 'integer',
      required: false                     
  } */

  // Import the SQL statement from role queries
  const query = require('./queries').permissions.members
  const result = await client.query(query, [req.params.name])

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    try {
      page = pagnetate(result.rows, pagnetationSize, pagnetationIndex)
      res.status(200).json({ result: page })
    } catch (error) {
      res.status(416).json({ error: 'Error pagentating results' })
    }
  } else {
    res.status(200).json({ result: result.rows })
  }
})

app.get('/v1/permissions/roles/:name/members', async function (req, res) {
  await setup()

  // #swagger.description = 'Get staff associated with a specific role [Supports Pagnetation]'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The role name',                   
        schema: 'string',  
        required: true                     
  } */

  /* #swagger.parameters['size'] = {
      in: 'query',                            
      description: 'Size of the returned page',                   
      schema: 'integer',  
      required: false                     
  } */

  /* #swagger.parameters['index'] = {
      in: 'query',                            
      description: 'Index of the returned page',
      schema: 'integer',                  
      required: false                     
  } */

  // Import the SQL statement from role queries
  const query = require('./queries').roles.members
  const result = await client.query(query, [req.params.name])

  // Split results if pagnetation parameters are supplied
  const pagnetationSize = req.query.size
  const pagnetationIndex = req.query.index

  if (pagnetationSize !== undefined && pagnetationIndex !== undefined) {
    try {
      page = pagnetate(result.rows, pagnetationSize, pagnetationIndex)
      res.status(200).json({ result: page })
    } catch (error) {
      res.status(416).json({ error: 'Error pagentating results' })
    }
  } else {
    res.status(200).json({ result: result.rows })
  }
})

app.put('/v1/permissions/staff/:identifier/grant', async function (req, res) {
  await setup()

  // #swagger.description = 'Grant a specific set of permissions to a given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'User identifier provided by cognito',
        schema: 'string',         
        required: true                     
  } */

  /* #swagger.parameters['permissions'] = {
        in: 'body',                            
        description: 'An array of permission strings',
        schema: 'array',               
        required: true                     
  } */

  if (req.body.permissions === undefined) {
    res
      .status(400)
      .json({
        error: 'A set of permissions must be specified within the request body'
      })
    return
  }

  if (!Array.isArray(req.body.permissions)) {
    res.status(400).json({ error: 'Permissions must be given as an array' })
    return
  }

  // Lookup the primary key for each permission
  const lookup = await identify(
    req.body.permissions,
    'system.permissions',
    'permission_id'
  )

  if (lookup.errors > 0) {
    res
      .status(404)
      .json({ error: 'Permission(s) not found', permissions: lookup.errors })
    return
  }

  var permissions = lookup.result
  var errors = []

  // Attempt to grant each permission
  for (var [name, identifier] of Object.entries(permissions)) {
    try {
      await client.query(
        'INSERT INTO system.staff_permissions (staff_id, permission_id) VALUES ($1, $2)',
        [req.params.identifier, identifier]
      )
    } catch (error) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res
      .status(409)
      .json({ error: 'Some permissions where already granted', failed: errors })
  } else {
    res.status(200).json({ result: 'All permissions sucessfully granted' })
  }
})

app.put('/v1/permissions/staff/:identifier/revoke', async function (req, res) {
  await setup()

  // #swagger.description = 'Revoke a specific set of permissions from given user'

  /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'User identifier provided by cognito',
        schema: 'string',                 
        required: true                     
  } */

  /* #swagger.parameters['permissions'] = {
        in: 'body',                            
        description: 'An array of permission strings',
        schema: 'array',                
        required: true                     
  } */

  if (req.body.permissions === undefined) {
    res
      .status(400)
      .json({
        error: 'A set of permissions must be specified within the request body'
      })
    return
  }

  if (!Array.isArray(req.body.permissions)) {
    res.status(400).json({ error: 'Permissions must be given as an array' })
    return
  }

  // Lookup the primary key for each permission
  const lookup = await identify(
    req.body.permissions,
    'system.permissions',
    'permission_id'
  )

  if (lookup.errors > 0) {
    res
      .status(404)
      .json({ error: 'Permission(s) not found', permissions: lookup.errors })
    return
  }

  var permissions = lookup.result
  var errors = []

  // Attempt to revoke each permission
  for (var [name, identifier] of Object.entries(permissions)) {
    const result = await client.query(
      'DELETE FROM system.staff_permissions WHERE staff_id = $1 AND permission_id = $2',
      [req.params.identifier, identifier]
    )

    if (result.rowCount < 1) {
      errors.push(name)
    }
  }

  if (errors.length > 0) {
    res
      .status(409)
      .json({
        error: 'Some permissions where not revoked due to an error',
        permissions: errors
      })
  } else {
    res.status(200).json({ result: 'All permissions sucessfully revoked' })
  }
})

app.put(
  '/v1/permissions/roles/staff/:identifier/grant',
  async function (req, res) {
    await setup()

    // #swagger.description = 'Grant a specific set of roles to a given user'

    /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'User identifier provided by cognito',
        schema: 'string',              
        required: true                     
  } */

    /* #swagger.parameters['roles'] = {
        in: 'body',                            
        description: 'An array of role strings',
        schema: 'array',                
        required: true                     
  } */

    if (req.body.roles === undefined) {
      res
        .status(400)
        .json({
          error: 'A set of roles must be specified within the request body'
        })
      return
    }

    if (!Array.isArray(req.body.roles)) {
      res.status(400).json({ error: 'Roles must be given as an array' })
      return
    }

    // Lookup the primary key for each role
    const lookup = await identify(req.body.roles, 'system.roles', 'role_id')

    if (lookup.errors > 0) {
      res
        .status(404)
        .json({ error: `Roles(s) not found`, roles: lookup.errors })
      return
    }

    var roles = lookup.result
    var errors = []

    // Attempt to grant each role
    for (var [name, identifier] of Object.entries(roles)) {
      try {
        await client.query(
          'INSERT INTO system.staff_roles (staff_id, role_id) VALUES ($1, $2)',
          [req.params.identifier, identifier]
        )
      } catch (error) {
        errors.push(name)
      }
    }

    if (errors.length > 0) {
      res
        .status(409)
        .json({
          error: 'Some roles where not granted due to an error',
          roles: errors
        })
    } else {
      res.status(200).json({ result: 'All roles sucessfully granted' })
    }
  }
)

app.put(
  '/v1/permissions/roles/staff/:identifier/revoke',
  async function (req, res) {
    await setup()

    // #swagger.description = 'Revoke a specific set of roles from given user'

    /* #swagger.parameters['identifier'] = {
        in: 'path',                            
        description: 'User identifier provided by cognito',
        schema: 'string',             
        required: true                     
  } */

    /* #swagger.parameters['roles'] = {
        in: 'body',                            
        description: 'An array of role strings',
        schema: 'array',              
        required: true                     
  } */

    if (req.body.roles === undefined) {
      res
        .status(400)
        .json({
          error: 'A set of roles must be specified within the request body'
        })
      return
    }

    if (!Array.isArray(req.body.roles)) {
      res.status(400).json({ error: 'Roles must be given as an array' })
      return
    }

    // Lookup the primary key for each role
    const lookup = await identify(req.body.roles, 'system.roles', 'role_id')

    if (lookup.errors > 0) {
      res
        .status(404)
        .json({ error: `Roles(s) not found`, roles: lookup.errors })
      return
    }

    var roles = lookup.result
    var errors = []

    // Attempt to revoke each role
    for (var [name, identifier] of Object.entries(roles)) {
      const result = await client.query(
        'DELETE FROM system.staff_roles WHERE staff_id = $1 AND role_id = $2',
        [req.params.identifier, identifier]
      )

      if (result.rowCount < 1) {
        errors.push(name)
      }
    }

    if (errors.length > 0) {
      res
        .status(409)
        .json({
          error: 'Some roles where not revoked due to an error',
          failed: errors
        })
    } else {
      res.status(200).json({ result: 'All roles sucessfully revoked' })
    }
  }
)

app.put('/v1/permissions/roles/:name/create', async function (req, res) {
  await setup()

  // #swagger.description = 'Add a new role to the database'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The role to create',
        schema: 'string',                
        required: true                     
  } */

  /* #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'The description string',
        schema: 'string',                  
        required: false                     
  } */

  var query = ''
  var fields = []

  // Handle the optional descriptor
  if (req.body.description !== undefined) {
    query = 'INSERT INTO system.roles (name, description) VALUES ($1, $2)'
    fields = [req.params.name, req.body.description]
  } else {
    query = 'INSERT INTO system.roles (name) VALUES ($1) RETURNING role_id'
    fields = [req.params.name]
  }

  try {
    await client.query(query, fields)
  } catch (error) {
    res.status(409).json({ error: 'Role already exists' })
  }

  // Handle optional permissions argument
  if (req.body.permissions === undefined) {
    res.status(200).json({ result: 'Role sucessfully created' })
    return
  }

  if (!Array.isArray(req.body.permissions)) {
    res.status(200).json({ result: 'Role sucessfully created' })
    return
  }

  // Lookup the primary key for each permission
  const lookup = await identify(
    req.body.permissions,
    'system.permissions',
    'permission_id'
  )

  if (lookup.errors > 0) {
    res
      .status(404)
      .json({ error: 'Permission(s) not found', permissions: errors })
    return
  }

  var permissions = lookup.result
  var errors = []

  // Lookup the primary key for the role
  const role = await (
    await identify([req.params.name], 'system.roles', 'role_id')
  ).result[req.params.name]

  // Attempt to grant each permission
  for (var [name, permission] of Object.entries(permissions)) {
    try {
      await client.query(
        'INSERT INTO system.role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [role, permission]
      )
    } catch (error) {
      errors.push(name)
    }
  }
})

app.put('/v1/permissions/roles/:name/update', async function (req, res) {
  await setup()

  // #swagger.description = 'Add a new role to the database'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The role to update',
        schema: 'string',                
        required: true                     
  } */

  /* #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'The description string',
        schema: 'string',                  
        required: false                     
  } */

  /* #swagger.parameters['permissions'] = {
        in: 'body',                            
        description: 'An array of permission strings',
        schema: 'array',                  
        required: false                     
  } */

  if (req.body.description !== undefined) {
    const query = 'UPDATE system.roles SET description = $2 WHERE name = $1'
    const result = await client.query(query, [
      req.params.name,
      req.body.description
    ])

    if (result.rowsRowcount == 0) {
      res.status(404).json({ error: 'Role not found' })
      return
    }
  }

  // Handle optional permissions argument
  if (req.body.permissions === undefined) {
    res.status(200).json({ result: 'Role sucessfully updated' })
    return
  }

  if (!Array.isArray(req.body.permissions)) {
    res.status(400).json({ error: 'Roles must be given as an array' })
    return
  }

  // Lookup the primary key for each permission
  const lookup = await identify(
    req.body.permissions,
    'system.permissions',
    'permission_id'
  )

  if (lookup.errors > 0) {
    res
      .status(404)
      .json({ error: 'Permission(s) not found', permissions: errors })
    return
  }

  var permissions = lookup.result
  var errors = []

  // Lookup the primary key for the role
  const role = await (
    await identify([req.params.name], 'system.roles', 'role_id')
  ).result[req.params.name]

  // Remove existing permissions
  await client.query('DELETE FROM system.role_permissions WHERE role_id = $1', [
    role
  ])

  // Attempt to grant each permission
  for (var [name, permission] of Object.entries(permissions)) {
    try {
      await client.query(
        'INSERT INTO system.role_permissions (role_id, permission_id) VALUES ($1, $2)',
        [role, permission]
      )
    } catch (error) {
      errors.push(name)
    }
  }

  res.status(200).json({ result: 'Role sucessfully updated', errors: errors })
})

app.post('/v1/permissions/roles/search', async function (req, res) {
  await setup()

  // #swagger.description = 'Retreive roles matching a given query'

  /* #swagger.parameters['query'] = {
        in: 'body',                            
        description: 'The string to match to',
        schema: 'string',               
        required: false                     
  } */

  var result

  if (req.body.query) {
    const query = require('./queries').roles.search
    result = await client.query(query, [req.body.query])
  } else {
    const query = require('./queries').roles.all
    result = await client.query(query)
  }

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows })
  } else {
    res.status(404).json({ error: 'No Matching Roles' })
  }
})

app.post('/v1/permissions/search', async function (req, res) {
  await setup()

  // #swagger.description = 'Retreive permissions matching a given query'

  /* #swagger.parameters['query'] = {
        in: 'body',                            
        description: 'The string to match to',
        schema: 'string',               
        required: false                     
  } */

  var result

  if (req.body.query) {
    const query = require('./queries').permissions.search
    result = await client.query(query, [req.body.query])
  } else {
    const query = require('./queries').permissions.all
    result = await client.query(query)
  }

  if (result.rows.length > 0) {
    res.status(200).json({ result: result.rows })
  } else {
    res.status(404).json({ error: 'No Matching Permissions' })
  }
})

app.delete('/v1/permissions/roles/:name', async function (req, res) {
  await setup()

  // #swagger.description = 'Delete a role from the database'

  /* #swagger.parameters['name'] = {
        in: 'path',                            
        description: 'The role to delete',
        schema: 'string',                   
        required: true                     
  } */

  const result = await client.query(
    'DELETE FROM system.roles WHERE name = $1',
    [req.params.name]
  )

  if (result.rowCount > 0) {
    res.status(200).json({ result: 'Role sucessfully deleted' })
  } else {
    res.status(404).json({ error: 'Role not found' })
  }
})

app.listen(3000, function () {
  console.log('App started')
})

module.exports = app

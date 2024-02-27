# Identity and Permission Management API
Handles staff permissions and roles

## Version: 1.0.0

**Schemes:** http

---
### /v1/permissions/staff/{identifier}

#### GET
##### Description

Get all or check the presense of a set of given permissions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The staff identifier provided by cognito | Yes | string |
| permissions | body | An array of permission names to test the specified user against | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

### /v1/permissions/roles/staff/{identifier}

#### GET
##### Description

Get all or check the presense of a set of given roles

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The staff identifier provided by cognito | Yes | string |
| roles | body | An array of role names to test the specified user against | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

### /v1/permissions/{name}

#### GET
##### Description

Get a permission description from a given name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The permission to retreive | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/permissions/roles/{name}

#### GET
##### Description

Get a role and its associated permissions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The role to retreive from the database | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

#### DELETE
##### Description

Delete a role from the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The role to delete | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/permissions/{name}/members

#### GET
##### Description

Get staff associated with a specific permission. [Supports Pagnetation]

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The permission name | Yes | string |
| size | query | Size of the returned page | No | string |
| index | query | Index of the returned page | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 416 | Range Not Satisfiable |

### /v1/permissions/roles/{name}/members

#### GET
##### Description

Get staff associated with a specific role [Supports Pagnetation]

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The role name | Yes | string |
| size | query | Size of the returned page | No | string |
| index | query | Index of the returned page | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 416 | Range Not Satisfiable |

### /v1/permissions/staff/{identifier}/grant

#### PUT
##### Description

Grant a specific set of permissions to a given user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| permissions | body | An array of permission strings | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/staff/{identifier}/revoke

#### PUT
##### Description

Revoke a specific set of permissions from given user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| permissions | body | An array of permission strings | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/roles/staff/{identifier}/grant

#### PUT
##### Description

Grant a specific set of roles to a given user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| roles | body | An array of role strings | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/roles/staff/{identifier}/revoke

#### PUT
##### Description

Revoke a specific set of roles from given user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| roles | body | An array of role strings | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/roles/{name}/create

#### PUT
##### Description

Add a new role to the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The role to create | Yes | string |
| description | body | The description string | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/roles/{name}/update

#### PUT
##### Description

Add a new role to the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The role to update | Yes | string |
| description | body | The description string | No | string |
| permissions | body | An array of permission strings | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |

### /v1/permissions/roles/search

#### POST
##### Description

Retreive roles matching a given query

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| query | body | The string to match to | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/permissions/search

#### POST
##### Description

Retreive permissions matching a given query

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| query | body | The string to match to | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

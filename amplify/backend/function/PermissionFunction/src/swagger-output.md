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

##### Responses

| Code | Description |
| ---- | ----------- |
| default |  |

### /v1/permissions/roles/staff/{identifier}

#### GET
##### Description

Get all or check the presense of a set of given roles

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The staff identifier provided by cognito | Yes | string |
| roles | body | An array of role names to test the specified user against | Yes | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| default |  |

### /v1/permissions/{identifier}

#### GET
##### Description

Get a specific permission from a given name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The permission to retreive | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/permissions/role/{identifier}

#### GET
##### Description

Get a specific role and its permissions from a given name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The role to retreive | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/permissions/{identifier}/members

#### GET
##### Description

Get staff associated with a specific permission. [Supports Pagnetation]

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The permission to retreive members from | Yes | string |
| size | query | Size of returned page | No | string |
| index | query | Index of returned page | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 416 | Range Not Satisfiable |

### /v1/permissions/role/{identifier}/members

#### GET
##### Description

Get staff associated with a specific role [Supports Pagnetation]

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The role to retreive members from | Yes | string |
| size | query | Size of returned page | No | string |
| index | query | Index of returned page | No | string |

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
| identifier | path | The staff member grant permissions to | Yes | string |
| permissions | body | An array of permission strings | Yes | { **"permissions"**:  } |

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
| identifier | path | The staff member revoke permissions from | Yes | string |
| permissions | body | An array of permission strings | Yes | { **"permissions"**:  } |

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
| identifier | path | The staff member grant roles to | Yes | string |
| roles | body | An array of role strings | Yes | { **"roles"**:  } |

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
| identifier | body | An array of role strings | Yes | { **"roles"**:  } |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

### /v1/permissions/roles/{identifier}

#### PUT
##### Description

Create or Update a given role

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The role to update | Yes | string |
| description | body | The updated description string | No | { **"description"**:  } |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 409 | Conflict |

#### DELETE
##### Description

Delete a given role

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The role to delete | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

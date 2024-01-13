# Premises Management API
Handles room management

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/room/{name}

#### GET
##### Description

Get rooms matching a given name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The name to lookup | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/resources/room/{name}/create

#### PUT
##### Description

Create a new room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| name | path | The name of the room to create | Yes | string |
| building | body | The building the room is located in | Yes | string |
| floor | body | The floor number the room is located on | Yes | string |
| description | body | An optional description string | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 409 | Conflict |

### /v1/resources/room/{identifier}/update

#### PUT
##### Description

Update the description for a give room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room to update | Yes | string |
| description | body | The new description string | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |

### /v1/resources/room/{identifier}

#### DELETE
##### Description

Delete a given room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room to delete | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |

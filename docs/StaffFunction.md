# Identity and Permission Management API
Handles staff registration, deletion, revision and search

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/staff/{identifier}

#### GET
##### Description

Retreive a staff member from the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The staff member to retreive | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

#### DELETE
##### Description

Remove a staff member from the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/resources/staff/search

#### POST
##### Description

Search for a staff member by a given field

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| query | body | The string to match to | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/resources/staff/{identifier}/create

#### PUT
##### Description

Add a new staff member to the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| first_name | body | Users first name | Yes | string |
| last_name | body | Users last name name | Yes | string |
| email_address | body | Users email address | Yes | string |
| phone_number | body | Users phone number | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

### /v1/resources/staff/{identifier}/update

#### PUT
##### Description

Update a staff member in the database

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | User identifier provided by cognito | Yes | string |
| first_name | body | Updated first name | No | string |
| last_name | body | Updated last name name | No | string |
| email_address | body | Updated email address | No | string |
| phone_number | body | Updated phone number | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

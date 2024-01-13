# Premises Cleaning and Management API
Handles cleaning orders

## Version: 1.0.0

**Schemes:** http

---
### /v1/orders/cleaning/room/{identifier}

#### GET
##### Description

Get all cleaning orders for a given room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room name to lookup | Yes | string |
| fulfilled | query | Boolean exclusion of fulfilled orders (default true) | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

#### DELETE
##### Description

Cancel a cleaning order for a given room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room identifier | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 404 | Not Found |

### /v1/orders/cleaning/room/{identifier}/issue

#### PUT
##### Description

Issue a new cleaning order for a given room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room identifier | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 409 | Conflict |

### /v1/orders/cleaning/room/{identifier}/fulfil

#### PUT
##### Description

Fulfil a cleaning order for a given room

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| identifier | path | The room identifier | Yes | string |
| cleaner | body | Staff identifier | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 409 | Conflict |

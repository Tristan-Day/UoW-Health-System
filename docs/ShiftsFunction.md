# Shifts API
Handles shift CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/shift

#### GET
##### Description

View a shift item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| SHIFT_ID | query string | The unique identifier for the shift item | No | string |
| WARD_ID | query string | The unique identifier for the ward item | No | string |
| STAFF_ID | query string | A staff member's unique id. | No | string |
| START_TIMESTAMP | query string | The start timestamp in ISO string format. | No | string |
| END_TIMESTAMP | query string | The end timestamp in ISO string format. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Update or create a shift item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| SHIFT_ID | body | The unique identifier for the shift item | No | object |
| WARD_ID | body | The unique identifier for the ward item | No | object |
| STAFF_ID | body | A staff member's unique id. | No | object |
| START_TIMESTAMP | body | The start timestamp in ISO string format. | No | object |
| END_TIMESTAMP | body | The end timestamp in ISO string format. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Update or create a shift item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| SHIFT_ID | body | The unique identifier for the shift item | No | object |
| WARD_ID | body | The unique identifier for the ward item | No | object |
| STAFF_ID | body | A staff member's unique id. | No | object |
| START_TIMESTAMP | body | The start timestamp in ISO string format. | No | object |
| END_TIMESTAMP | body | The end timestamp in ISO string format. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete a shift item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| SHIFT_ID | body | The unique identifier for the shift item | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

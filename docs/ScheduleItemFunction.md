# Schedule Item API
Handles schedule item CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/appointments/scheduleitem

#### GET
##### Description

View a schedule item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| SCHEDULE_ITEM_ID | query string | The unique identifier for the schedule item | No | string |
| START_TIMESTAMP | query string | The start timestamp in the string form of an ISO datetime | No | string |
| PATIENT_ID | query string | A patient's id. | No | string |
| TASK | query string | An overview of the task to be performed. | No | string |
| DESCRIPTION | query string | A description of the task to be performed. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Insert or update a schedule item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| SCHEDULE_ITEM_ID | body | The unique identifier for the schedule item | No | object |
| START_TIMESTAMP | body | The start timestamp in the string form of an ISO datetime | No | object |
| ESTIMATED_DURATION_MINUTES | body | The estimated length of the schedule item in minutes. | No | object |
| PATIENT_ID | body | A patient's id. | No | object |
| TASK | body | An overview of the task to be performed. | No | object |
| DESCRIPTION | body | A description of the task to be performed. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Insert or update a schedule item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| SCHEDULE_ITEM_ID | body | The unique identifier for the schedule item | No | object |
| START_TIMESTAMP | body | The start timestamp in the string form of an ISO datetime | No | object |
| ESTIMATED_DURATION_MINUTES | body | The estimated length of the schedule item in minutes. | No | object |
| PATIENT_ID | body | A patient's id. | No | object |
| TASK | body | An overview of the task to be performed. | No | object |
| DESCRIPTION | body | A description of the task to be performed. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete a schedule item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| SCHEDULE_ITEM_ID | body | The unique identifier for the schedule item | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| default |  |

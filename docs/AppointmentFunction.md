# Appointment API
Handles appointment CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/appointments

#### GET
##### Description

Get a single appointment row, all rows or rows where a criteria is met

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| APPOINTMENT_ID | query string | The unique identifier for the appointment | No | integer |
| PATIENT_ID | query string | The unique identifier for a patient | No | integer |
| TREATMENT_ID | query string | The unique identifier for a treatment | No | integer |
| SCHEDULE_ITEM_ID | query string | The unique identifier for a schedule item | No | integer |
| STAFF_ID | query string | The unique identifier for a staff member | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Insert or update an appointment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| APPOINTMENT_ID | body | The unique identifier for the appointment | No | object |
| START_TIMESTAMP | body | A timestamp showing the start of the appointment | No | object |
| ESTIMATED_DURATION_MINUTES | body | The estimated duration of an appointment in minutes | No | object |
| PATIENT_ID | body | The unique identifier for a patient | No | object |
| TREATMENT_ID | body | The unique identifier for a treatment | No | object |
| SCHEDULE_ITEM_ID | body | The unique identifier for a schedule item | No | object |
| STAFF_ID | body | The unique identifier for a staff member | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Insert or update an appointment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| APPOINTMENT_ID | body | The unique identifier for the appointment | No | object |
| START_TIMESTAMP | body | A timestamp showing the start of the appointment | No | object |
| ESTIMATED_DURATION_MINUTES | body | The estimated duration of an appointment in minutes | No | object |
| PATIENT_ID | body | The unique identifier for a patient | No | object |
| TREATMENT_ID | body | The unique identifier for a treatment | No | object |
| SCHEDULE_ITEM_ID | body | The unique identifier for a schedule item | No | object |
| STAFF_ID | body | The unique identifier for a staff member | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete an appointment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| APPOINTMENT_ID | body | The unique identifier for the appointment | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

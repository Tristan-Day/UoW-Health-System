# Patient API
Handles patient CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/treatments/patient

#### GET
##### Description

Insert or update a patient

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| PATIENT_ID | query string | The unique identifier for the patient | No | string |
| FIRST_NAME | query string | A patient's first name. | No | string |
| LAST_NAME | query string | A patient's last name. | No | string |
| PHONE_NUMBER | query string | A patient's phone number. | No | string |
| DESCRIBED_SYMPTOMS | query string | A patient's described symptoms. | No | string |
| EMAIL | query string | A patient's email. | No | string |
| NHS_NUMBER | query string | A patient's NHS number. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Insert or update a patient

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| FIRST_NAME | body | A patient's first name. | No | object |
| LAST_NAME | body | A patient's last name. | No | object |
| PHONE_NUMBER | body | A patient's phone number. | No | object |
| DESCRIBED_SYMPTOMS | body | A patient's described symptoms. | No | object |
| EMAIL | body | A patient's email. | No | object |
| NHS_NUMBER | body | A patient's NHS number. | No | object |
| PATIENT_ID | body | The unique identifier for the patient | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Insert or update a patient

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| PATIENT_ID | query string | The unique identifier for the patient | No | integer |
| FIRST_NAME | query string | A patient's first name. | No | string |
| LAST_NAME | query string | A patient's last name. | No | string |
| PHONE_NUMBER | query string | A patient's phone number. | No | string |
| DESCRIBED_SYMPTOMS | query string | A patient's described symptoms. | No | string |
| EMAIL | query string | A patient's email. | No | string |
| NHS_NUMBER | query string | A patient's NHS number. | No | string |

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
| PATIENT_ID | body | The unique identifier for the patient | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

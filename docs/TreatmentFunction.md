# Treatments API
Handles treatment CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/treatments

#### GET
##### Description

View a treatment item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| TREATMENT_ID | query string | The unique identifier for the treatment item. | No | string |
| NAME | query string | The name for the treatment item. | No | string |
| CATEGORY_ID | query string | The unique ID for the treatment category item. | No | string |
| WARD_ID | query string | The unique ID for the ward item. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Import or update a treatment item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| TREATMENT_ID | body | The unique identifier for the treatment item. | No | object |
| NAME | body | The name for the treatment item. | No | object |
| CATEGORY_ID | body | The unique ID for the treatment category item. | No | object |
| WARD_ID | body | The unique ID for the ward item. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Import or update a treatment item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| TREATMENT_ID | body | The unique identifier for the treatment item. | No | object |
| NAME | body | The name for the treatment item. | No | object |
| CATEGORY_ID | body | The unique ID for the treatment category item. | No | object |
| WARD_ID | body | The unique ID for the ward item. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete a treatment item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| TREATMENT_ID | body | The unique identifier for the treatment item. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

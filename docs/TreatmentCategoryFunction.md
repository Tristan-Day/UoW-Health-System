# Treatment Category API
Handles treatment category CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/treatments/category

#### GET
##### Description

View a category item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| TREATMENT_CATEGORY_ID | query string | The unique identifier for the category item | No | string |
| CATEGORY_NAME | query string | The unique name for the category item | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Import or update a category item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| TREATMENT_CATEGORY_ID | body | The unique identifier for the category item | No | object |
| CATEGORY_NAME | body | The unique name for the category item | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Import or update a category item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| TREATMENT_CATEGORY_ID | body | The unique identifier for the category item | No | object |
| CATEGORY_NAME | body | The unique name for the category item | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete a category item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| TREATMENT_CATEGORY_ID | body | The unique identifier for the category item | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

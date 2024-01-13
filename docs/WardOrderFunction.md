# Ward Order API
Handles ward order CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/ward/order

#### GET
##### Description

View an order item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| WARD_ORDER_ID | query string | The unique identifier for the ward order. | No | string |
| WARD_ID | query string | The unique identifier for the ward. | No | string |
| PRIORITY | query string | The priority of the ward order. | No | string |
| ORDER_DESCRIPTION | query string | The description of the ward order. | No | string |
| DATE_POSTED | query string | A string in the ISO date format. | No | string |
| HOURS_VALID_FOR | query string | An integer showing the number of hours the order is valid for. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Import or update a ward order

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| WARD_ORDER_ID | body | The unique identifier for the ward order. | No | object |
| WARD_ID | body | The unique identifier for the ward. | No | object |
| PRIORITY | body | The priority of the ward order. | No | object |
| ORDER_DESCRIPTION | body | The description of the ward order. | No | object |
| DATE_POSTED | body | A string in the ISO date format. | No | object |
| HOURS_VALID_FOR | body | An integer showing the number of hours the order is valid for. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Import or update a ward order

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| WARD_ORDER_ID | body | The unique identifier for the ward order. | No | object |
| WARD_ID | body | The unique identifier for the ward. | No | object |
| PRIORITY | body | The priority of the ward order. | No | object |
| ORDER_DESCRIPTION | body | The description of the ward order. | No | object |
| DATE_POSTED | body | A string in the ISO date format. | No | object |
| HOURS_VALID_FOR | body | An integer showing the number of hours the order is valid for. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Delete a ward order

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| WARD_ORDER_ID | body | The unique identifier for the ward order. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

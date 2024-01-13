# Wards API
Handles ward CRUD operations

## Version: 1.0.0

**Schemes:** http

---
### /v1/resources/ward

#### GET
##### Description

View a treatment item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| WARD_ID | query string | The unique ID for the ward. | No | string |
| WARD_NAME | query string | The name of the ward. | No | string |
| SPECIALISATION | query string | The ward specialisation. | No | string |
| DESCRIPTION | query string | The ward description. | No | string |
| ICON_DATA | query string | The reference for data for an icon. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### POST
##### Description

Import or update a ward

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| WARD_ID | body | The unique ID for the ward. | No | object |
| WARD_NAME | body | The name of the ward. | No | object |
| SPECIALISATION | body | The ward specialisation. | No | object |
| DESCRIPTION | body | The ward description. | No | object |
| ICON_DATA | body | The reference for data for an icon. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### PUT
##### Description

Import or update a ward

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| ACTION_TYPE | body | Value denoting whether the request is insert or update. The values INSERT and UPDATE are used to denote each option. | No | object |
| WARD_ID | body | The unique ID for the ward. | No | object |
| WARD_NAME | body | The name of the ward. | No | object |
| SPECIALISATION | body | The ward specialisation. | No | object |
| DESCRIPTION | body | The ward description. | No | object |
| ICON_DATA | body | The reference for data for an icon. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

#### DELETE
##### Description

Import or update a ward

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ------ |
| WARD_ID | body | The unique ID for the ward. | No | object |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |
| 400 | Bad Request |

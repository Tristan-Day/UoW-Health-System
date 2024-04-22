import { get, del, post, put } from 'aws-amplify/api'

class ShiftAPI {
  static getShift = async function (date) {
    const operation = await get({
      apiName: 'ShiftsHandler',
      path: `/v1/resources/shift`,
      options: {
        queryParams: {
          START_TIMESTAMP: date
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }

  static upsertShift = async function (
    actionType,
    wardId,
    staffId,
    startTimestamp,
    shiftId
  ) {
    if (wardId != null && actionType == 'INSERT') {
      const operation = await post({
        apiName: 'ShiftsHandler',
        path: `/v1/resources/shift`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            WARD_ID: wardId,
            STAFF_ID: staffId,
            START_TIMESTAMP: startTimestamp,
            END_TIMESTAMP: startTimestamp
          }
        }
      })

      const response = await operation.response
      let body = await response.body.json()
      console.log(body)
      return body
    }

    const operation = await post({
      apiName: 'ShiftsHandler',
      path: `/v1/resources/shift`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          SHIFT_ID: shiftId,
          WARD_ID: wardId,
          STAFF_ID: staffId,
          START_TIMESTAMP: startTimestamp,
          END_TIMESTAMP: startTimestamp
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }

  static deleteShift = async function (shiftId) {
    const operation = await del({
      apiName: 'ShiftsHandler',
      path: `/v1/resources/shift`,
      options: {
        queryParams: {
          SHIFT_ID: shiftId
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }
}

export default ShiftAPI

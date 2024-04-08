import { get, del, post, put } from 'aws-amplify/api'

class ScheduleItemAPI {
  static getPatient = async function () {
    try {
      const operation = get({
        apiName: 'ScheduleItemHandler',
        path: `/v1/resources/appointments/scheduleitem`
      })

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body
    } catch (error) {
      return error
    }
  }

  static upsertPatient = async function (
    actionType,
    startTimestamp,
    estimatedDuration,
    patientId,
    task,
    description,
    itemType,
    scheduleItemId
  ) {
    if (patientId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'ScheduleItemHandler',
        path: `/v1/resources/appointments/scheduleitem`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            START_TIMESTAMP: startTimestamp,
            ESTIMATED_DURATION_MINUTES: estimatedDuration,
            PATIENT_ID: patientId,
            TASK: task,
            DESCRIPTION: description,
            ITEM_TYPE: itemType
          }
        }
      })

      const response = await operation.response

      console.log(response);

      let body = await response.body.json()

      console.log(body)

      return body.success
    }

    const operation = post({
      apiName: 'ScheduleItemHandler',
      path: `/v1/resources/appointments/scheduleitem`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          SCHEDULE_ITEM_ID: scheduleItemId,
          START_TIMESTAMP: startTimestamp,
          ESTIMATED_DURATION_MINUTES: estimatedDuration,
          PATIENT_ID: patientId,
          TASK: task,
          DESCRIPTION: description,
          ITEM_TYPE: itemType
        }
      }
    })

    const response = await operation.response

    console.log(response);

    let body = await response.body.json()

    console.log(body)

    return body.success
  }

  static deletePatient = async function (scheduleItemId) {
    const operation = del({
      apiName: 'ScheduleItemHandler',
      path: `/v1/resources/appointments/scheduleitem`,
      options: {
        queryParams: {
          SCHEDULE_ITEM_ID: scheduleItemId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default ScheduleItemAPI

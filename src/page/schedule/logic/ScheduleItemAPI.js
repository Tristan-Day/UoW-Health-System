import { get, del, post, put } from 'aws-amplify/api'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getCurrentUser } from 'aws-amplify/auth';

class ScheduleItemAPI {
  static getPatient = async function () {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString()

      // console.log("authsession")
      // console.log((await fetchAuthSession()));


      // const user = await getCurrentUser();
      // const token = user.signInUserSession.idToken.toString();  

      // console.log("token");
      // console.log(token);

      const operation = get({
        apiName: 'ScheduleItemHandler',
        path: `/v1/resources/appointments/scheduleitem`,
        //  options: { headers: {Authorization: `Bearer ${token}`}}
      })

      //uses cookies to get specific user Id

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body.success
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
    scheduleItemId,
  ) {
    const authToken = (await fetchAuthSession()).tokens?.idToken?.toString()

    const user = await getCurrentUser();
    // const token = user.signInUserSession.idToken.jwtToken;



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
          },
          //   headers: {Authorization: `Bearer ${token}`}
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
        },
        // headers: {Authorization: `Bearer ${token}`}
      }
    })

    const response = await operation.response

    console.log(response);

    let body = await response.body.json()

    console.log(body)

    return body.success
  }

  static deletePatient = async function (scheduleItemId) {
    // const authToken = (await fetchAuthSession()).tokens?.idToken?.toString()
    const user = await getCurrentUser();
    // const token = user.signInUserSession.idToken.jwtToken;


    try {
      const operation = del({
        apiName: 'ScheduleItemHandler',
        path: `/v1/resources/appointments/scheduleitem`,
        options: {
          queryParams: {
            SCHEDULE_ITEM_ID: scheduleItemId
          },
          // headers: {Authorization: `Bearer ${token}`}
        }
      })

      const response = await operation.response
      const body = await response.body.json()
      console.log("Delete output")
      console.log(body)
      return body

    } catch (error) {
      console.log(`Error`)
      console.log(error)
      return error;
    }
    // const operation = del({
    //   apiName: 'ScheduleItemHandler',
    //   path: `/v1/resources/appointments/scheduleitem`,
    //   options: {
    //     queryParams: {
    //       SCHEDULE_ITEM_ID: scheduleItemId
    //     },
    //     // headers: {Authorization: `Bearer ${token}`}
    //   }
    // })

    // const response = await operation.response
    // const body = await response.body.json()
    // console.log("Delete output")
    // console.log(body)
    // return body
  }
}

export default ScheduleItemAPI


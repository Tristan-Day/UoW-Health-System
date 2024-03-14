import { get, del, post, put } from 'aws-amplify/api'

class TreatmentsAPI {
  static getTreatment = async function (query) {
    const operation = get({
      apiName: 'TreatmentHandler',
      path: `/v1/resources/treatments`,
      options: {}
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static upsertTreatment = async function (
    actionType,
    name,
    categoryId,
    wardId,
    treatmentId
  ) {
    if (actionType === 'INSERT') {
      const operation = post({
        apiName: 'TreatmentHandler',
        path: `/v1/resources/treatments`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            NAME: name,
            CATEGORY_ID: categoryId,
            WARD_ID: wardId
          }
        }
      })

      const response = await operation.response

      let body = await response.body.json()

      console.log('body')
      console.log(body)

      return body.success
    } else {
      const operation = post({
        apiName: 'TreatmentHandler',
        path: `/v1/resources/treatments`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            NAME: name,
            CATEGORY_ID: categoryId,
            WARD_ID: wardId,
            TREATMENT_ID: treatmentId
          }
        }
      })

      const response = await operation.response

      let body = await response.body.json()

      console.log('body')
      console.log(body)

      return body.success
    }
  }

  static deleteTreatment = async function (treatmentId) {
    const operation = del({
      apiName: 'TreatmentHandler',
      path: `/v1/resources/treatments`,
      options: {
        queryParams: {
          TREATMENT_ID: treatmentId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default TreatmentsAPI

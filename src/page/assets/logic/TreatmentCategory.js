import { get, del, post, put } from 'aws-amplify/api'

class TreatmentCategoriesAPI {
  static getTreatment = async function (query) {
    const operation = get({
      apiName: 'TreatmentCategoryHandler',
      path: `/v1/resources/treatments/category`,
      options: {}
    })

    const response = await operation.response
    return (await response.body.json()).success
  }

  static upsertTreatment = async function (actionType, name, categoryId) {
    if (categoryId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'TreatmentCategoryHandler',
        path: `/v1/resources/treatments/category`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            CATEGORY_NAME: name
          }
        }
      })

      const response = await operation.response
      let body = await response.body.json();

      console.log(body);

      return body.success
    }

    const operation = post({
      apiName: 'TreatmentCategoryHandler',
      path: `/v1/resources/treatments/category`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          CATEGORY_NAME: name,
          TREATMENT_CATEGORY_ID: categoryId
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json();

    console.log(body);

    return body.success
  }

  static deleteTreatment = async function (categoryId) {
    const operation = del({
      apiName: 'TreatmentCategoryHandler',
      path: `/v1/resources/treatments/category`,
      options: {
        queryParams: {
          TREATMENT_CATEGORY_ID: categoryId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default TreatmentCategoriesAPI

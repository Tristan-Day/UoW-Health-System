import { get, del, post, put } from 'aws-amplify/api'

class TreatmentsAPI {

    static getTreatment = async function(query) {
        const operation = get({
            apiName: 'TreatmentHandler',
            path: `/v1/resources/treatments`,
            options: {
            }
          });
      
          const response = ((await operation.response));
          return (await response.body.json()).success;
    }

    static upsertTreatment = async function(actionType, name, categoryId, wardId, treatmentId) {
      if(wardId != null && actionType == "INSERT") {
        const operation = post({
          apiName: 'TreatmentHandler',
          path: `/v1/resources/treatments`,
          options: {
            body: {
              ACTION_TYPE: actionType,
              NAME: name,
              CATEGORY_ID: categoryId,
              WARD_ID: wardId,
            }
          }
        });
    
        const response = ((await operation.response));

        let body = (await response.body.json());

        console.log(body);

        return body.success;
      }

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
      });
  
      const response = ((await operation.response));
      return (await response.body.json()).success;
    }

    static deleteTreatment = async function(wardId) {
      const operation = del({
        apiName: 'TreatmentHandler',
        path: `/v1/resources/treatments`,
        options: {
          queryParams: {
            WARD_ID: wardId
          },
        }
      });
  
      const response = ((await operation.response));
      return (await response.body.json());
    }

};

export default TreatmentsAPI;
import { get, del, post, put } from 'aws-amplify/api'

class WardsAPI {

    static getWard = async function(query) {
        const operation = get({
            apiName: 'WardHandler',
            path: `/v1/resources/ward`,
            options: {
            }
          });
      
          const response = ((await operation.response));
          return (await response.body.json()).success;
    }

    static upsertWard = async function(actionType, wardName, specialisation, description, iconData, wardId) {
      if(wardId != null && actionType == "INSERT") {
        const operation = post({
          apiName: 'WardHandler',
          path: `/v1/resources/ward`,
          options: {
            body: {
              ACTION_TYPE: actionType,
              WARD_NAME: wardName,
              DESCRIPTION: description,
              SPECIALISATION: specialisation,
              ICON_DATA: iconData,
              WARD_ID: wardId
            }
          }
        });
    
        const response = ((await operation.response));
        return (await response.body.json()).success;
      }

      const operation = post({
        apiName: 'WardHandler',
        path: `/v1/resources/ward`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            WARD_NAME: wardName,
            DESCRIPTION: description,
            SPECIALISATION: specialisation,
            ICON_DATA: iconData,
          }
        }
      });
  
      const response = ((await operation.response));
      return (await response.body.json()).success;
    }

    static deleteWard = async function(wardId) {
      const operation = del({
        apiName: 'WardHandler',
        path: `/v1/resources/ward`,
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

export default WardsAPI;
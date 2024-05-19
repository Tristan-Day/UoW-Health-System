import { get, del, post, put } from 'aws-amplify/api'

class SurgeryBookingAPI {

    static getSurgeryBooking = async function(query) {
        const operation = get({
            apiName: 'BookingSurgeryHandler',
            path: `/v1/resources/surgery`,
            options: {
            }
          });
      
          const response = ((await operation.response));
          return (await response.body.json()).success;
    }

    static upsertSurgeryBooking = async function(actionType, name, date, time, department, staffId, surgeryType, description, bookingType, id) {
      if(id != null && actionType == "INSERT") {
        const operation = post({
          apiName: 'BookingSurgeryHandler',
          path: `/v1/resources/surgery`,
          options: {
            body: {
              ACTION_TYPE: actionType,
              NAME: name,
              DATE: date,
              TIME: time,
              DEPARTMENT: department,
              STAFF_ID: staffId,
              SURGERY_TYPE: surgeryType,
              DESCRIPTION: description,
              BOOKING_TYPE: bookingType
            }
          }
        });
    
        const response = ((await operation.response));
        return (await response.body.json()).success;
      }

      const operation = post({
        apiName: 'BookingSurgeryHandler',
        path: `/v1/resources/surgery`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            NAME: name,
            DATE: date,
            TIME: time,
            DEPARTMENT: department,
            STAFF_ID: staffId,
            SURGERY_TYPE: surgeryType,
            DESCRIPTION: description,
            BOOKING_TYPE: bookingType,
            ID: id
          }
        }
      });
  
      const response = ((await operation.response));
      return (await response.body.json()).success;
    }

    static deleteSurgeryBooking = async function(wardId) {
      const operation = del({
        apiName: 'BookingSurgeryHandler',
        path: `/v1/resources/surgery`,
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

export default SurgeryBookingAPI;
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
      if(id != null && actionType === "UPDATE") {

        console.log("updating")

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
        console.log(response);
        return (await response.body.json());
      }

      console.log("creating")

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
          }
        }
      });
  
      const response = ((await operation.response));
      console.log(response);
      return (await response.body.json());
    }

    static deleteSurgeryBooking = async function(id) {
      const operation = del({
        apiName: 'BookingSurgeryHandler',
        path: `/v1/resources/surgery`,
        options: {
          queryParams: {
            ID: id
          },
        }
      });
  
      const response = ((await operation.response));
      return (await response.body.json());
    }

};

export default SurgeryBookingAPI;
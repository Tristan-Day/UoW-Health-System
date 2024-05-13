import { get, del, post, put } from 'aws-amplify/api'

class PatientAPI {
  static getPatient = async function () {
    try {
      const operation = get({
        apiName: 'PatientHandler',
        path: `/v1/resources/treatments/patient`
      })

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body
    } catch (error) {
      console.log(error);
      return error
    }
  }

  static upsertPatient = async function (
    actionType,
    fName,
    lName,
    phoneNumber,
    describedSymptoms,
    email,
    NHSNumber,
    patientId,
    gender,
    birthdate,
    deceased,
    contact_relationship,
    contact_name,
    contact_telephone,
    contact_address,
    communication_language,
  ) {
    if (patientId != null && actionType == 'INSERT') {
      const operation = post({
        apiName: 'PatientHandler',
        path: `/v1/resources/treatments/patient`,
        options: {
          body: {
            FIRST_NAME: fName,
            LAST_NAME: lName,
            PHONE_NUMBER: phoneNumber,
            DESCRIBED_SYMPTOMS: describedSymptoms,
            EMAIL: email,
            NHS_NUMBER: NHSNumber,
            GENDER: gender,
            BIRTHDATE: birthdate,
            DECEASED: deceased,
            CONTACT_RELATIONSHIP: contact_relationship,
            CONTACT_NAME: contact_name,
            CONTACT_TELEPHONE: contact_telephone,
            CONTACT_ADDRESS: contact_address,
            COMMUNICATION_LANGUAGE: communication_language,

          }
        }
      })

      const response = await operation.response
      let body = await response.body.json()

      console.log(body)

      return body.success
    }

    const operation = post({
      apiName: 'PatientHandler',
      path: `/v1/resources/treatments/patient`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          FIRST_NAME: fName,
          LAST_NAME: lName,
          PHONE_NUMBER: phoneNumber,
          DESCRIBED_SYMPTOMS: describedSymptoms,
          EMAIL: email,
          NHS_NUMBER: NHSNumber,
          GENDER: gender,
          BIRTHDATE: birthdate,
          DECEASED: deceased,
          CONTACT_RELATIONSHIP: contact_relationship,
          CONTACT_NAME: contact_name,
          CONTACT_TELEPHONE: contact_telephone,
          CONTACT_ADDRESS: contact_address,
          COMMUNICATION_LANGUAGE: communication_language,




        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()

    console.log(body)

    return body.success
  }

  static deletePatient = async function (patientId) {
    const operation = del({
      apiName: 'PatientHandler',
      path: `/v1/resources/treatments/patient`,
      options: {
        queryParams: {
          PATIENT_ID: patientId
        }
      }
    })

    const response = await operation.response
    return await response.body.json()
  }
}

export default PatientAPI

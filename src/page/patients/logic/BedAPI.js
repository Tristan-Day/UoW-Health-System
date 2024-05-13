import { get, del, post, put } from 'aws-amplify/api'

class BedAPI {
    static get = async function (query) {
        const operation = get({
            apiName: 'bedHandler',
            path: `/v1/resources/bed`,
            options: {
            }
        });

        const response = ((await operation.response));
        return (await response.body.json()).success;
    }

    static upsert = async function (availability, patientId, transfer, wardId, bedId, actionType) {
        if (wardId != null && actionType == "INSERT") {
            const operation = post({
                apiName: 'bedHandler',
                path: `/v1/resources/bed`,
                options: {
                    body: {
                        ACTION_TYPE: actionType,
                        AVAILABILITY: availability,
                        PATIENT_ID: patientId,
                        TRANSER: transfer,
                        WARD_ID: wardId
                    }
                }
            });

            const response = ((await operation.response));
            return (await response.body.json()).success;
        }

        const operation = post({
            apiName: 'bedHandler',
            path: `/v1/resources/bed`,
            options: {
                body: {
                    ACTION_TYPE: actionType,
                    AVAILABILITY: availability,
                    PATIENT_ID: patientId,
                    TRANSER: transfer,
                    BED_ID: bedId,
                    WARD_ID: wardId
                }
            }
        });

        const response = ((await operation.response));
        return (await response.body.json()).success;
    }

    static delete = async function (bedId) {
        const operation = del({
            apiName: 'BedHandler',
            path: `/v1/resources/bed`,
            options: {
                queryParams: {
                    BED_ID: bedId
                },
            }
        });

        const response = ((await operation.response));
        return (await response.body.json());
    }

};

export default BedAPI;
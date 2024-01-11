var assert = require('assert');
// var app = require('.././amplify/backendfunction\AppointmentFunction\src\app.js');
const lambdaLocal = require("lambda-local");
const path = require('path');

let payload = {
    "httpMethod": "post",
    "path": "/v1/resources/treatments/category",
    "queryStringParameters": {
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{\"CATEGORY_NAME\":\"NEUROLOGICAL_SURGICAL\", \"ACTION_TYPE\": \"INSERT\"}"
  };

it('should return a positive response', async function() {
    lambdaLocal.execute({
        event: payload,
        lambdaPath: path.join(__dirname, '../.././amplify/backend/function/TreatmentCategoryFunction/src/index.js')
    }).then(function (done) {
        let body = JSON.parse(done.body);
        console.log(body);
    }).catch(function(error) {
        console.log(error);
    });
});

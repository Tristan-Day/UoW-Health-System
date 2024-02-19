const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Identity and Permission Management API',
    description: 'Handles staff registration, deletion, revision and search'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
# Winchester Health Systems

UoW Health System *or WHS* is a hospital management system created as part of final year Software Engineering Module (3206) designed to demonstrate colaboration in the development of a full-stack web application.

The application is hosted on Amazon Web Services using Amplify, Lambda and, PostgreSQL and API Gateway. Currently, the master branch is configured with continuous deployment and integration.

## Features

* Register New Staff
* Define New Roles
* Define Physical Premises
* Create and Manage Cleaning Orders

## Colaborators

This project was completed thanks to the hard work of the following individuals.

* Tristan Day
* Ben Wright
* Bryan Anthony
* Ibtisam Kahim

## Documentation

Backend documentation was generated using [Swagger](https://swagger-autogen.github.io/docs/") and [Swagger-Markdown](https://github.com/syroegkin/swagger-markdown).

* To generate docs run ```npm run swagger``` then  ```npm run swagger-markdown```
* Alternatively, you can run the ```aggregate-docs.py``` script, which will generate markdown files for each backend service.

## Testing

* Backend services were tested using [Lambda Local](https://github.com/ashiina/lambda-local) for mocking and [Jest](https://github.com/jestjs/jest) for test scheduling an execution.
* These can be run individually by opening a terminal in the service `src` directory and then running `jest`.

*Note: Due to slight incompatibilities between Lambda Local and Jest, you must manually exit the test using `CTRL + C` to avoid a port conflict when scheduling later tests.*

## Code Formatting

This project was formatted using [Prettier - The Opinionated Code Formatter](https://github.com/prettier/prettier)

*Please see the included `.prettierrc` file for more information*

## Deploying the Application on the Cloud

To deploy this application, you will require the following:

* Node Package Manager v10.2.4 or later
* Amplify Node Package v12.8.2 or later
* An Amazon Web Services IAM role with appropriate Amplify Access Permissions

To deploy the application 

1. Use `amplify configure` to setup your AWS profile configuration
2. Use `amplify publish` to push the stack defined in the repository to your AWS account.


## Running the Application Locally

In the project directory, you can run:

`npm start`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To run the application locally, you must first install project dependencies with

`npm install`

Then run the application using

`npm start`

This will run the application in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

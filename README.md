# Winchester Health Systems

UoW Health System *or WHS* is a hospital management system created as part of final year Software Engineering Module (3206) designed to demonstrate colaboration in the development of a full-stack web application.

The application is hosted on Amazon Web Services using Amplify, Lambda and, PostgreSQL and API Gateway. Currently, the master branch is configured with continuous deployment and integration.

## Features

NO CURRENTLY COMPLETE

## Colaborators

This project was completed thanks to the hard work of the following individuals.

* Tristan Day
* Ben Wright
* Brian Anthony
* Ibtisam Kahim

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
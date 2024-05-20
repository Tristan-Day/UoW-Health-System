
import { get, del, post, put } from 'aws-amplify/api'
import HealthcareplanAPI from '../../src/page/assets/logic/healthcareplanapi';

class HealthcareplanValidator {

    static fields = {
        ACTION_TYPE: String,
        ID: Number,
        PATIENT_ID: String,
        TITLE: String,
        DIAGNOSIS: String,
        HEALTHCAREPLAN: String,
        STAGE: String,
        ASSESSMENT: String,
        PLANNING: String,
        IMPLEMENTATION: String,
        EVALUATION: String,
        CREATED_AT: String,
    };

    static ID_COLUMN_NAME = "ID";

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty(this.ID_COLUMN_NAME)) {
            return true;
        }

        if (search.length === 0) {
            return true;
        }

        //check that all fields in the query statement are correct
        let falseElementCount = 0;
        search.forEach(element => {

            if (!Object.keys(this.fields).includes(element)) {
                falseElementCount++;
            }

        });

        if (falseElementCount == 0) {
            return true;
        }

        return false;

    };

    static upsertIsValid = function (searchBody) {

        let search = Object.keys(searchBody);

        console.log(search);

        //ID
        if (search.hasOwnProperty(this.ID_COLUMN_NAME)) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        //check that all fields in the query statement are correct
        let falseElementCount = 0;
        search.forEach(element => {

            if (!Object.keys(this.fields).includes(element)) {
                falseElementCount++;
            }

        });

        if (falseElementCount == 0) {
            return true;
        }

        return false;

    };

    static deleteIsValid = function (deleteBody) {

        let search = Object.keys(deleteBody);

        //ID
        if (search.hasOwnProperty(this.ID_COLUMN_NAME)) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = [this.ID_COLUMN_NAME];

        //check that all fields in the query statement are correct
        let falseElementCount = 0;
        search.forEach(element => {

            if (!deleteFields.includes(element)) {
                falseElementCount++;
            }

        });

        if (falseElementCount == 0) {
            return true;
        }

        return false;

    };
    static checkIfHealthcarePlanExists = async function (careplanName) {
        try {
            const careplanExists = await HealthcarePlanAPI.checkIfDrugExists(careplanName);
            return careplanExists;
        } catch (error) {
            console.error("Error checking if careplan exists:", error);
            return false;
        }
    };
    

}

class HealthcarePlanAPI {
    static ID_COLUMN_NAME = "ID";

    static getValueForKey = function (query, key) {
        return Object.values(query)[Object.keys(query).indexOf(key)];
    }

    static query = async function (req, res, setup) {
        let client = await setup();



        if (!Validator.searchIsValid(req.query)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }


        let result = {};




        try {
            console.log("starting query");

            let paramLength = Object.keys(req.query).length;

            let query;

            console.log(req.query);


            if (Object.keys(req.query).includes(this.ID_COLUMN_NAME)) {
                console.log("selecting one by ID");



                query = await client.query('SELECT * FROM "system".healthcareplan WHERE ID = ' + Number(req.query[this.ID_COLUMN_NAME]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".healthcareplan;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes(this.ID_COLUMN_NAME)) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".healthcareplan WHERE ";
                let columnsArray = Object.keys(req.query);
                let values = Object.values(req.query);

                values.forEach((value, index) => {
                    console.log(value);
                    console.log(typeof value);

                    if (typeof value == "string") {
                        queryString += columnsArray[index] + " LIKE '" + value + "%' ";
                    } else {
                        queryString += columnsArray[index] + " = " + value + " ";
                    }

                    if (index < values.length - 1) {
                        queryString += "OR ";
                    }
                });

                queryString += ";";

                console.log(queryString);

                query = await client.query(queryString);

                result = { success: query };

            }

        } catch (error) {

            console.log(error);

            result = { failure: error };

        }

        res.json(result);

    }

    static upsert = async function (req, res, setup) {
        let client = await setup();


        if (!Validator.upsertIsValid(req.body)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }

        console.log(req.body);


        let result = {};
        try {
            if (req.body["ACTION_TYPE"] === "INSERT") {

                const queryString = `
                    INSERT INTO "system".healthcareplan (PATIENT_ID, TITLE, DIAGNOSIS, HEALTHCAREPLAN, STAGE, ASSESSMENT, PLANNING, IMPLEMENTATION, EVALUATION, CREATED_AT)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    `;
                const values = [
                    req.body["PATIENT_ID"],
                    req.body["TITLE"],
                    req.body["DIAGNOSIS"],
                    req.body["HEALTHCAREPLAN"],
                    req.body["STAGE"],
                    req.body["ASSESSMENT"],
                    req.body["PLANNING"],
                    req.body["IMPLEMENTATION"],
                    req.body["EVALUATION"],
                    req.body["CREATED_AT"],
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".healthcareplan SET PATIENT_ID = $1, TITLE = $2, DIAGNOSIS = $3, HEALTHCAREPLAN = $4, STAGE = $5, ASSESSMENT = $6, PLANNING = $7, IMPLEMENTATION = $8, EVALUATION = $9, CREATED_AT = $10 WHERE ID = $11;
                `;
                const values = [
                    req.body["PATIENT_ID"],
                    req.body["TITLE"],
                    req.body["DIAGNOSIS"],
                    req.body["HEALTHCAREPLAN"],
                    req.body["STAGE"],
                    req.body["ASSESSMENT"],
                    req.body["PLANNING"],
                    req.body["IMPLEMENTATION"],
                    req.body["EVALUATION"],
                    req.body["CREATED_AT"],
                    //where
                    req.body["ID"]
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

    static delete = async function (req, res, setup) {
        let client = await setup();


        if (!Validator.deleteIsValid(req.body)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }

        console.log(req.body);


        let result = {};
        try {

            const queryString = `
                    DELETE FROM "system".healthcareplan WHERE ID = $1;
                    `;
            const values = [req.body[this.ID_COLUMN_NAME]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

export default HealthcareplanAPI;

class Validator {

    static fields = {
        ACTION_TYPE: String,
        PATIENT_ID: Number,
        FIRST_NAME: String,
        LAST_NAME: String,
        PHONE_NUMBER: String,
        DESCRIBED_SYMPTOMS: String,
        EMAIL: String,
        NHS_NUMBER: String,
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("PATIENT_ID")) {
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
        if (search.hasOwnProperty("PATIENT_ID")) {
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
        if (search.hasOwnProperty("PATIENT_ID")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["PATIENT_ID"];

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

}

class PatientAPI {

    static hasCorrectPermissions = async function () {
        return true;
    }

    static getValueForKey = function (query, key) {
        return Object.values(query)[Object.keys(query).indexOf(key)];
    }

    static query = async function (req, res, setup) {
        let client = await setup();

        if (!this.hasCorrectPermissions()) {
            console.log('incorrect permissions');
            res.status(400).json({ failure: "INCORRECT_PERMISSIONS" });
            return;
        }

        if (!Validator.searchIsValid(req.query)) {
            console.log('incorrect query');
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }


        let result = {};

        try {
            console.log("starting query");

            let paramLength = Object.keys(req.query).length;

            let query;

            console.log(req.query);
            console.log(typeof req.query["PATIENT_ID"]);

            if (Object.keys(req.query).includes("PATIENT_ID")) {
                console.log("selecting one by ID");

                console.log(Number(req.query["PATIENT_ID"]));
                console.log(typeof Number(req.query["PATIENT_ID"]));

                query = await client.query('SELECT * FROM "system".patients WHERE PATIENT_ID = ' + Number(req.query["PATIENT_ID"]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".patients;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes("PATIENT_ID")) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".patients WHERE ";
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

        if (!this.hasCorrectPermissions()) {
            res.status(400).json({ failure: "INCORRECT_PERMISSIONS" });
            return;
        }

        if (!Validator.upsertIsValid(req.body)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }

        console.log(req.body);


        let result = {};
        try {
            if (req.body["ACTION_TYPE"] === "INSERT") {

                const queryString = `
                    INSERT INTO "system".patients (FIRST_NAME, LAST_NAME, PHONE_NUMBER, DESCRIBED_SYMPTOMS, EMAIL, NHS_NUMBER)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `;
                const values = [
                    req.body["FIRST_NAME"], 
                    req.body["LAST_NAME"], 
                    req.body["PHONE_NUMBER"], 
                    req.body["DESCRIBED_SYMPTOMS"], 
                    req.body["EMAIL"],
                    req.body["NHS_NUMBER"]
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".patients SET FIRST_NAME = $1, LAST_NAME = $2, PHONE_NUMBER = $3, DESCRIBED_SYMPTOMS = $4, EMAIL = $5, NHS_NUMBER = $6 WHERE PATIENT_ID = $7;
                `;
                const values = [
                    req.body["FIRST_NAME"],
                    req.body["LAST_NAME"],
                    req.body["PHONE_NUMBER"],
                    req.body["DESCRIBED_SYMPTOMS"],
                    req.body["EMAIL"],
                    //where
                    req.body["PATIENT_ID"]
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

        if (!this.hasCorrectPermissions()) {
            res.status(400).json({ failure: "INCORRECT_PERMISSIONS" });
            return;
        }

        if (!Validator.deleteIsValid(req.body)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }

        console.log(req.body);


        let result = {};
        try {

            const queryString = `
                    DELETE FROM "system".patients WHERE PATIENT_ID = $1;
                    `;
            const values = [req.body["PATIENT_ID"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = PatientAPI;
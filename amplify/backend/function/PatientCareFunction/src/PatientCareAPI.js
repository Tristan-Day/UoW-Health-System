class Validator {

    static fields = {
        ID: String,
        PATIENT_ID: String,
        DATE_OF_ADMISSION: String,
        MEDICATION: String,
        ACTION_TYPE: String
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("PATIENT_CARE")) {
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

        //ID
        if (search.hasOwnProperty("PATIENT_CARE")) {
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
        if (search.hasOwnProperty("PATIENT_CARE")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["PATIENT_CARE"];

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

class WardAPI {

    static hasCorrectPermissions = async function () {
        return true;
    }

    static getValueForKey = function (query, key) {
        return Object.values(query)[Object.keys(query).indexOf(key)];
    }

    static query = async function (req, res, setup) {
        let client = await setup();

        if (!this.hasCorrectPermissions()) {
            res.status(400).json({ failure: "INCORRECT_PERMISSIONS" });
            return;
        }

        if (!Validator.searchIsValid(req.query)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }


        let result;

        try {
            console.log("starting query");

            let paramLength = Object.keys(req.query).length;

            let query;

            if (Object.keys(req.query).includes("PATIENT_CARE")) {
                console.log("selecting one by ID");
                query = await client.query('SELECT * FROM "system".patient_care WHERE PATIENT_CARE = \'' + req.query["PATIENT_CARE"] + '\';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".patient_care;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".patient_care WHERE ";
                let columnsArray = Object.keys(req.query);
                let values = Object.values(req.query);

                values.forEach((value, index) => {
                    queryString += columnsArray[index] + " LIKE '" + value + "%' ";
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
                    INSERT INTO "system".patient_care (PATIENT_ID, DATE_OF_ADMISSION, MEDICATIONS)
                    VALUES ($1, $2, $3)
                    `;
                const values = [req.body["PATIENT_ID"], req.body["DATE_OF_ADMISSION"], req.body["MEDICATIOMS"]]

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".patient_care SET PATIENT_ID = $1, DATE_OF_ADMISSION = $2, MEDICATIONS = $3 WHERE  ID = $4;
                `;
                const values = [
                    req.body["PATIENT_ID"],
                    req.body["DATE_OF_ADMISSION"],
                    req.body["MEDICATIONS"],
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

        if (!this.hasCorrectPermissions()) {
            res.status(400).json({ failure: "INCORRECT_PERMISSIONS" });
            return;
        }

        if (!Validator.deleteIsValid(req.query)) {
            res.status(400).json({ failure: "INCORRECT_QUERY" });
            return;
        }

        console.log(req.query);


        let result = {};
        try {

            const queryString = `
                    DELETE FROM "system".patient_care WHERE PATIENT_CARE = $1;
                    `;
            const values = [req.query["PATIENT_CARE"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = PATIENTCAREAPI;
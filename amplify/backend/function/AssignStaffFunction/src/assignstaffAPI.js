
class Validator {

    static fields = {
        ACTION_TYPE: String,
        ID: Number,
        STAFF_ID: String,
        PATIENT_ID: Number,
        SHIFT_DATE: String,
    };

    static ID_COLUMN_NAME = "ID";

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

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

}

class AssignStaffAPI {
    static ID_COLUMN_NUMBER = "ID";

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



                query = await client.query('SELECT * FROM "system".staff_patient_assignment WHERE ID = ' + Number(req.query[this.ID_COLUMN_NAME]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".staff_patient_assignment;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes(this.ID_COLUMN_NAME)) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".staff_patient_assignment WHERE ";
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
                    INSERT INTO "system".staff_patient_assignment (STAFF_ID, PATIENT_ID, SHIFT_DATE)
                    VALUES ($1, $2, $3)
                    `;
                const values = [
                    req.body["STAFF_ID"],
                    req.body["PATIENT_ID"],
                    req.body["SHIFT_DATE"],
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".staff_patient_assignment SET STAFF_ID = $1, PATIENT_ID = $2, SHIFT_DATE = $3 WHERE ID = $4;
                `;
                const values = [
                    req.body["STAFF_ID"],
                    req.body["PATIENT_ID"],
                    req.body["SHIFT_DATE"],
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
                    DELETE FROM "system".staff_patient_assignment WHERE ID = $1;
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

module.exports = AssignStaffAPI;

class Validator {

    static fields = {
        ACTION_TYPE: String,
        APPOINTMENT_ID: Number,
        START_TIMESTAMP: String,
        ESTIMATED_DURATION_MINUTES: String,
        PATIENT_ID: Number,
        TREATMENT_ID: Number,
        SCHEDULE_ITEM_ID: Number,
        STAFF_ID: Number,
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("APPOINTMENT_ID")) {
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
        if (search.hasOwnProperty("APPOINTMENT_ID")) {
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
        if (search.hasOwnProperty("APPOINTMENT_ID")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["APPOINTMENT_ID"];

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

class AppointmentAPI {

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


        let result = {};

        try {
            console.log("starting query");

            let paramLength = Object.keys(req.query).length;

            let query;

            console.log(req.query);
            console.log(typeof req.query["APPOINTMENT_ID"]);

            if (Object.keys(req.query).includes("APPOINTMENT_ID")) {
                console.log("selecting one by ID");

                console.log(Number(req.query["APPOINTMENT_ID"]));
                console.log(typeof Number(req.query["APPOINTMENT_ID"]));

                query = await client.query('SELECT * FROM "system".appointments WHERE APPOINTMENT_ID = ' + Number(req.query["APPOINTMENT_ID"]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".appointments;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes("APPOINTMENT_ID")) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".appointments WHERE ";
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
                    INSERT INTO "system".appointments (START_TIMESTAMP, ESTIMATED_DURATION_MINUTES, PATIENT_ID, SCHEDULE_ITEM_ID, STAFF_ID)
                    VALUES ($1, $2, $3, $4, $5)
                    `;
                const values = [
                    req.body["START_TIMESTAMP"], 
                    req.body["ESTIMATED_DURATION_MINUTES"], 
                    req.body["PATIENT_ID"], 
                    req.body["SCHEDULE_ITEM_ID"], 
                    req.body["STAFF_ID"],
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".APPOINTMENTS SET START_TIMESTAMP = $1, ESTIMATED_DURATION_MINUTES = $2, PATIENT_ID = $3, SCHEDULE_ITEM_ID = $4, STAFF_ID = $5 WHERE APPOINTMENT_ID = $6;
                `;
                const values = [
                    req.body["START_TIMESTAMP"],
                    req.body["ESTIMATED_DURATION_MINUTES"],
                    req.body["PATIENT_ID"],
                    req.body["SCHEDULE_ITEM_ID"],
                    req.body["STAFF_ID"],
                    //where
                    req.body["APPOINTMENT_ID"]
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
                    DELETE FROM "system".appointments WHERE APPOINTMENT_ID = $1;
                    `;
            const values = [req.body["APPOINTMENT_ID"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = AppointmentAPI;
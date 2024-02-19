
class Validator {

    static fields = {
        ACTION_TYPE: String,
        SHIFT_ID: Number,
        WARD_ID: String,
        STAFF_ID: Number,
        START_TIMESTAMP: String,
        END_TIMESTAMP: String,
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("SHIFT_ID")) {
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
        if (search.hasOwnProperty("SHIFT_ID")) {
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
        if (search.hasOwnProperty("SHIFT_ID")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["SHIFT_ID"];

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

class ShiftAPI {

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
            console.log(typeof req.query["SHIFT_ID"]);

            if (Object.keys(req.query).includes("SHIFT_ID")) {
                console.log("selecting one by ID");

                console.log(Number(req.query["SHIFT_ID"]));
                console.log(typeof Number(req.query["SHIFT_ID"]));

                query = await client.query('SELECT * FROM "system".shifts WHERE SHIFT_ID = ' + Number(req.query["SHIFT_ID"]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".shifts;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes("SHIFT_ID")) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".shifts WHERE ";
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
                    INSERT INTO "system".shifts (WARD_ID, STAFF_ID, START_TIMESTAMP, END_TIMESTAMP)
                    VALUES ($1, $2, $3, $4)
                    `;
                const values = [req.body["WARD_ID"], req.body["STAFF_ID"], req.body["START_TIMESTAMP"], req.body["END_TIMESTAMP"]];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".shifts SET WARD_ID = $1, STAFF_ID = $2, START_TIMESTAMP = $3, END_TIMESTAMP = $4, WHERE SHIFT_ID = $5;
                `;
                const values = [
                    req.body["WARD_ID"],
                    req.body["STAFF_ID"],
                    req.body["START_TIMESTAMP"],
                    req.body["END_TIMESTAMP"],
                    //where
                    req.body["SHIFT_ID"]
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
                    DELETE FROM "system".shifts WHERE SHIFT_ID = $1;
                    `;
            const values = [req.body["SHIFT_ID"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = ShiftAPI;
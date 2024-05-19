
class Validator {

    static fields = {
        ACTION_TYPE: String,
        ID: Number,
        NAME: String,
        Date: Date,
        TIME: String, //evaluated from time
        DEPARTMENT: String,
        STAFF_ID: Number, //Staff ID
        SURGERY_TYPE: String,
        DESCRIPTION: String,
        BOOKING_TYPE: String, //e.g. "planned" or "emergency"
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

class BookingSurgeryAPI {
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



                query = await client.query('SELECT * FROM "system".booking_surgery WHERE ID = ' + Number(req.query[this.ID_COLUMN_NAME]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".booking_surgery;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes(this.ID_COLUMN_NAME)) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".booking_surgery WHERE ";
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
                    INSERT INTO "system".booking_surgery (NAME, DATE, TIME, DEPARTMENT, STAFF_ID, SURGERY_TYPE, DESCRIPTION, BOOKING_TYPE)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    `;
                const values = [
                    req.body["NAME"],
                    req.body["DATE"],
                    req.body["TIME"],
                    req.body["DEPARTMENT"],
                    req.body["STAFF_ID"],
                    req.body["SURGERY_TYPE"],
                    req.body["DESCRIPTION"],
                    req.body["BOOKING_TYPE"],
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".booking_surgery SET NAME = $1, DATE = $2, TIME = $3, DEPARTMENT = $4, STAFF_ID = $5, SURGERY_TYPE = $6, DESCRIPTION = $7, BOOKING_TYPE = $8 WHERE ID = $9;
                `;
                const values = [
                    req.body["NAME"],
                    req.body["DATE"],
                    req.body["TIME"],
                    req.body["DEPARTMENT"],
                    req.body["STAFF_ID"],
                    req.body["SURGERY_TYPE"],
                    req.body["DESCRIPTION"],
                    req.body["BOOKING_TYPE"],
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
                    DELETE FROM "system".booking_surgery WHERE ID = $1;
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

module.exports = BookingSurgeryAPI;
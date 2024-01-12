
class Validator {

    static fields = {
        ACTION_TYPE: String,
        WARD_ORDER_ID: String,
        WARD_ID: String,
        PRIORITY: String,
        ORDER_DESCRIPTION: String,
        DATE_POSTED: String,
        HOURS_VALID_FOR: Number
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("WARD_ORDER_ID")) {
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
        if (search.hasOwnProperty("WARD_ORDER_ID")) {
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
        if (search.hasOwnProperty("WARD_ORDER_ID")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["WARD_ORDER_ID"];

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

class WardOrderAPI {

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
            console.log(typeof req.query["WARD_ORDER_ID"]);

            if (Object.keys(req.query).includes("WARD_ORDER_ID")) {
                console.log("selecting one by ID");

                console.log(Number(req.query["WARD_ORDER_ID"]));
                console.log(typeof Number(req.query["WARD_ORDER_ID"]));

                query = await client.query('SELECT * FROM "system".ward_orders WHERE WARD_ORDER_ID = ' + Number(req.query["WARD_ORDER_ID"]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".ward_orders;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes("WARD_ORDER_ID")) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".ward_orders WHERE ";
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

                try {

                    const queryString = `
                    INSERT INTO "system".ward_orders (WARD_ID, PRIORITY, ORDER_DESCRIPTION, DATE_POSTED, HOURS_VALID_FOR)
                    VALUES ($1, $2, $3, $4, $5)
                    `;
                    const values = [req.body["WARD_ID"], req.body["PRIORITY"], req.body["ORDER_DESCRIPTION"], req.body["DATE_POSTED"], req.body["HOURS_VALID_FOR"]];

                    let query = await client.query(queryString, values);
                    console.log(query);
                    result = { success: query };
                    res.json(result);

                } catch (error) {
                    console.log(error);
                    result = { failure: error };
                    res.json(result);
                }

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".ward_orders SET WARD_ID = $1, PRIORITY = $2, ORDER_DESCRIPTION = $3, DATE_POSTED = $4, HOURS_VALID_FOR = $5 WHERE WARD_ORDER_ID = $6;
                `;
                const values = [
                    req.body["WARD_ID"],
                    req.body["PRIORITY"],
                    req.body["ORDER_DESCRIPTION"],
                    req.body["DATE_POSTED"],
                    req.body["HOURS_VALID_FOR"],
                    //where
                    req.body["WARD_ORDER_ID"]
                ];

                let query = await client.query(queryString, values);
                result = { success: query };
                res.json(result);

            }

        } catch (error) {
            console.log(error);
            result = { failure: error };
            res.json(result);
        }

        // res.json(result);

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
                    DELETE FROM "system".ward_orders WHERE WARD_ORDER_ID = $1;
                    `;
            const values = [req.body["WARD_ORDER_ID"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = WardOrderAPI;
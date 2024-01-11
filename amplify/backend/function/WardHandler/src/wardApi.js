
class Validator {

    static fields = {
        WARD_ID: String,
        WARD_NAME: String,
        SPECIALISATION: String,
        DESCRIPTION: String,
        ICON_DATA: Number,
        ACTION_TYPE: String
    };

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty("WARD_ID")) {
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
        if (search.hasOwnProperty("WARD_ID")) {
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
        if (search.hasOwnProperty("WARD_ID")) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = ["WARD_ID"];

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

            if (Object.keys(req.query).includes("WARD_ID")) {
                console.log("selecting one by ID");
                query = await client.query('SELECT * FROM "system".ward WHERE WARD_ID = \'' + req.query["WARD_ID"] + '\';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".ward;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".ward WHERE ";
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
                    INSERT INTO "system".ward (WARD_ID, WARD_NAME, SPECIALISATION, DESCRIPTION, ICON_DATA)
                    VALUES ($1, $2, $3, $4, $5)
                    `;
                const values = [req.body["WARD_ID"], req.body["WARD_NAME"], req.body["SPECIALISATION"], req.body["DESCRIPTION"], req.body["ICON_DATA"]];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".ward SET WARD_NAME = $1, SPECIALISATION = $2, DESCRIPTION = $3, ICON_DATA = $4 WHERE WARD_ID = $5;
                `;
                const values = [
                    req.body["WARD_NAME"],
                    req.body["SPECIALISATION"],
                    req.body["DESCRIPTION"],
                    req.body["ICON_DATA"],
                    //where
                    req.body["WARD_ID"]
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
                    DELETE FROM "system".ward WHERE WARD_ID = $1;
                    `;
            const values = [req.body["WARD_ID"]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = WardAPI;
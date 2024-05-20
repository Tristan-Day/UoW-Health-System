
class Validator {

    static fields = {
        ACTION_TYPE: String,
        ID: Number,
        DRUGNAME: String,
        STRENTGH: String,
        DOSAGE: String,
        AMOUNTDAILY: String,
        BRAND: String, // Brand A, Brand B, brand C,
        PRESCRIPTION_DATE: String,
        COURSE_DURATION: String,
        PATIENT_ID: Number,
    };

    static ID_COLUMN_NUMBER = "ID";

    static searchIsValid = function (searchObj) {

        let search = Object.keys(searchObj);

        //ID
        if (search.hasOwnProperty(this.ID_COLUMN_NUMBER)) {
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
        if (search.hasOwnProperty(this.ID_COLUMN_NUMBER)) {
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
        if (search.hasOwnProperty(this.ID_COLUMN_NUMBER)) {
            return true;
        }

        if (search.length === 0) {
            return false;
        }

        const deleteFields = [this.ID_COLUMN_NUMBER];

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

class DrugsAPI {
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


            if (Object.keys(req.query).includes(this.ID_COLUMN_NUMBER)) {
                console.log("selecting one by ID");



                query = await client.query('SELECT * FROM "system".drugs WHERE ID = ' + Number(req.query[this.ID_COLUMN_NUMBER]) + ';');

                result = { success: query };

            }

            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".drugs;');

                result = { success: query };

            }

            //compound query
            if (paramLength > 0 && !Object.keys(req.query).includes(this.ID_COLUMN_NUMBER)) {
                console.log("running multiple iterations");

                let queryString = "SELECT * FROM \"system\".drugs WHERE ";
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
                    INSERT INTO "system".drugs (DRUGNAME, STRENGTH, DOSAGE, AMOUNTDAILY, BRAND, PRESCRIPTION_DATE, COURSE_DURATION, PATIENT_ID)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    `;
                const values = [
                    req.body["DRUGNAME"],
                    req.body["STRENGTH"],
                    req.body["DOSAGE"],
                    req.body["AMOUNTDAILY"],
                    req.body["BRAND"],
                    req.body["PRESCRIPTION_DATE"],
                    req.body["COURSE_DURATION"],
                    req.body["PATIENT_ID"],
                ];

                let query = await client.query(queryString, values);
                result = { success: query };

            }

            if (req.body["ACTION_TYPE"] === "UPDATE") {

                const queryString = `
                UPDATE "system".drugs SET DRUGNAME = $1,STRENGTH = $2, DOSAGE = $3, AMOUNTDAILY = $4, BRAND = $5, PRESCRIPTION_DATE = $6, COURSE_DURATION = $7, PATIENT_ID = $8 WHERE ID = $9;
                `;
                const values = [
                    req.body["DRUGNAME"],
                    req.body["STRENGTH"],
                    req.body["DOSAGE"],
                    req.body["AMOUNTDAILY"],
                    req.body["BRAND"],
                    req.body["PRESCRIPTION_DATE"],
                    req.body["COURSE_DURATION"],
                    req.body["PATIENT_ID"],
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
                    DELETE FROM "system".drugs WHERE ID = $1;
                    `;
            const values = [req.body[this.ID_COLUMN_NUMBER]];

            let query = await client.query(queryString, values);
            result = { success: query };

        } catch (error) {
            console.log(error);
            result = { failure: error };
        }

        res.json(result);

    }

}

module.exports = DrugsAPI;
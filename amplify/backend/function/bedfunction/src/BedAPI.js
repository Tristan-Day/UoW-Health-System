class Validator {
 
    static fields = {
        BED_ID: String,
        AVAILABILITY: String,
        PATIENT_ID: String,
        TRANSFER: String,
        ACTION_TYPE: String,
    
    };
 
    static searchIsValid = function (searchObj) {
 
        let search = Object.keys(searchObj);
 
        //ID
        if (search.hasOwnProperty("BED_ID")) {
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
        if (search.hasOwnProperty("BED_ID")) {
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
        if (search.hasOwnProperty("BED_ID")) {
            return true;
        }
 
        if (search.length === 0) {
            return false;
        }
 
        const deleteFields = ["BED_ID"];
 
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
 
class BedAPI {
 
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
 
            if (Object.keys(req.query).includes("BED_ID")) {
                console.log("selecting one by ID");
                query = await client.query('SELECT * FROM "system".hosptial_beds WHERE BED_ID = \'' + req.query["BED_ID"] + '\';');
 
                result = { success: query };
 
            }
 
            if (paramLength == 0) {
                console.log("selecting all");
                query = await client.query('SELECT * FROM "system".hosptial_beds;');
 
                result = { success: query };
 
            }
 
            //compound query
            if (paramLength > 0) {
                console.log("running multiple iterations");
 
                let queryString = "SELECT * FROM \"system\".hosptial_beds WHERE ";
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
                    INSERT INTO "system".hosptial_beds (AVAILABILITY, PATIENT_ID, TRANSFER)
                    VALUES ($1, $2, $3)
                    `;
                const values = [req.body["AVAILABILITY"], req.body["PATIENT_ID"], req.body["TRANSFER"]];
 
                let query = await client.query(queryString, values);
                result = { success: query };
 
            }
 
            if (req.body["ACTION_TYPE"] === "UPDATE") {
 
                const queryString = `
                UPDATE "system".hosptial_beds AVAILABILITY = $1, PATIENT_ID = $2, TRANSFER = $3, WHERE BED_ID = $4;
                `;
                const values = [
                    req.body["AVAILABILITY"],
                    req.body["PATIENT_ID"],
                    req.body["TRANSFER"],
                    //where
                    req.body["BED_ID"]
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
                    DELETE FROM "system".hosptial_beds WHERE BED_ID = $1;
                    `;
            const values = [req.query["BED_ID"]];
 
            let query = await client.query(queryString, values);
            result = { success: query };
 
        } catch (error) {
            console.log(error);
            result = { failure: error };
        }
 
        res.json(result);
 
    }
 
}
 
module.exports = BedAPI;
class Validator {
  static fields = {
    ACTION_TYPE: String,
    SCHEDULE_ITEM_ID: Number,
    START_TIMESTAMP: String,
    ESTIMATED_DURATION_MINUTES: Number,
    PATIENT_ID: Number,
    TASK: String,
    DESCRIPTION: String,
    ITEM_TYPE: String
  }

  static searchIsValid = function (searchObj) {
    let search = Object.keys(searchObj)

    //ID
    if (search.hasOwnProperty('SCHEDULE_ITEM_ID')) {
      return true
    }

    if (search.length === 0) {
      return true
    }

    //check that all fields in the query statement are correct
    let falseElementCount = 0
    search.forEach(element => {
      if (!Object.keys(this.fields).includes(element)) {
        falseElementCount++
      }
    })

    if (falseElementCount == 0) {
      return true
    }

    return false
  }

  static upsertIsValid = function (searchBody) {
    let search = Object.keys(searchBody)

    console.log(search)

    //ID
    if (search.hasOwnProperty('SCHEDULE_ITEM_ID')) {
      return true
    }

    if (search.length === 0) {
      return false
    }

    //check that all fields in the query statement are correct
    let falseElementCount = 0
    search.forEach(element => {
      if (!Object.keys(this.fields).includes(element)) {
        falseElementCount++
      }
    })

    if (falseElementCount == 0) {
      return true
    }

    return false
  }

  static deleteIsValid = function (deleteBody) {
    let search = Object.keys(deleteBody)

    //ID
    if (search.hasOwnProperty('SCHEDULE_ITEM_ID')) {
      return true
    }

    if (search.length === 0) {
      return false
    }

    const deleteFields = ['SCHEDULE_ITEM_ID']

    //check that all fields in the query statement are correct
    let falseElementCount = 0
    search.forEach(element => {
      if (!deleteFields.includes(element)) {
        falseElementCount++
      }
    })

    if (falseElementCount == 0) {
      return true
    }

    return false
  }
}

class ScheduleItemAPI {
  static hasCorrectPermissions = function () {
    return true
  }

  static getValueForKey = function (query, key) {
    return Object.values(query)[Object.keys(query).indexOf(key)]
  }

  static query = async function (req, res, setup) {
    let client = await setup()

    if (!this.hasCorrectPermissions()) {
      res.status(400).json({ failure: 'INCORRECT_PERMISSIONS' })
      return
    }

    if (!Validator.searchIsValid(req.query)) {
      res.status(400).json({ failure: 'INCORRECT_QUERY' })
      return
    }

    let result = {}

    try {
      console.log('starting query')

      let paramLength = Object.keys(req.query).length

      let query

      console.log(req.query)
      console.log(typeof req.query['SCHEDULE_ITEM_ID'])

      if (Object.keys(req.query).includes('SCHEDULE_ITEM_ID')) {
        console.log('selecting one by ID')

        console.log(Number(req.query['SCHEDULE_ITEM_ID']))
        console.log(typeof Number(req.query['SCHEDULE_ITEM_ID']))

        query = await client.query(
          'SELECT * FROM "system".schedule_items WHERE SCHEDULE_ITEM_ID = ' +
            Number(req.query['SCHEDULE_ITEM_ID']) +
            ';'
        )

        result = { success: query }
      }

      if (paramLength == 0) {
        console.log('selecting all')
        query = await client.query('SELECT * FROM "system".schedule_items;')

        result = { success: query }
      }

      //compound query
      if (
        paramLength > 0 &&
        !Object.keys(req.query).includes('SCHEDULE_ITEM_ID')
      ) {
        console.log('running multiple iterations')

        let queryString = 'SELECT * FROM "system".schedule_items WHERE '
        let columnsArray = Object.keys(req.query)
        let values = Object.values(req.query)

        values.forEach((value, index) => {
          console.log(value)
          console.log(typeof value)

          if (typeof value == 'string') {
            queryString += columnsArray[index] + " LIKE '" + value + "%' "
          } else {
            queryString += columnsArray[index] + ' = ' + value + ' '
          }

          if (index < values.length - 1) {
            queryString += 'OR '
          }
        })

        queryString += ';'

        console.log(queryString)

        query = await client.query(queryString)

        result = { success: query }
      }
    } catch (error) {
      console.log(error)

      result = { failure: error }
    }

    res.json(result)
  }

  static upsert = async function (req, res, setup) {
    let client = await setup()

    if (!this.hasCorrectPermissions()) {
      res.status(400).json({ failure: 'INCORRECT_PERMISSIONS' })
      return
    }

    if (!Validator.upsertIsValid(req.body)) {
      res.status(400).json({ failure: 'INCORRECT_QUERY' })
      return
    }

    console.log(req.body)

    let result = {}
    try {
      if (req.body['ACTION_TYPE'] === 'INSERT') {
        const queryString = `
                    INSERT INTO "system".schedule_items (START_TIMESTAMP, ESTIMATED_DURATION_MINUTES, TASK, DESCRIPTION, ITEM_TYPE)
                    VALUES ($1, $2, $3, $4, $5)
                    `
        const values = [
          req.body['START_TIMESTAMP'],
          req.body['ESTIMATED_DURATION_MINUTES'],
          req.body['TASK'],
          req.body['DESCRIPTION'],
          req.body['ITEM_TYPE']
        ]

        let query = await client.query(queryString, values)
        result = { success: query }
        console.log('insert body')
        console.log(result)
        res.json(result)
        return
      }

      if (req.body['ACTION_TYPE'] === 'UPDATE') {
        const queryString = `
                UPDATE "system".schedule_items SET START_TIMESTAMP = $1, ESTIMATED_DURATION_MINUTES = $2, TASK = $3, DESCRIPTION = $4, ITEM_TYPE = $5 WHERE SCHEDULE_ITEM_ID = $6;
                `
        const values = [
          req.body['START_TIMESTAMP'],
          req.body['ESTIMATED_DURATION_MINUTES'],
          req.body['TASK'],
          req.body['DESCRIPTION'],
          req.body['ITEM_TYPE'],
          //where
          req.body['SCHEDULE_ITEM_ID']
        ]

        let query = await client.query(queryString, values)
        result = { success: query }
        res.json(result)
        return
      }
    } catch (error) {
      console.log('error triggered: ' + error)
      console.log(error)
      result = { failure: error }
    }

    console.log('final result')
    console.log(result)
    res.json(result)
  }

  static delete = async function (req, res, setup) {
    let client = await setup()

    if (!this.hasCorrectPermissions()) {
      res.status(400).json({ failure: 'INCORRECT_PERMISSIONS' })
      return
    }

    if (!Validator.deleteIsValid(req.body)) {
      res.status(400).json({ failure: 'INCORRECT_QUERY' })
      return
    }

    console.log(req.body)

    let result = {}
    try {
      const queryString = `
                    DELETE FROM "system".schedule_items WHERE SCHEDULE_ITEM_ID = $1;
                    `
      const values = [req.body['SCHEDULE_ITEM_ID']]

      let query = await client.query(queryString, values)
      result = { success: query }
    } catch (error) {
      console.log(error)
      result = { failure: error }
    }

    res.json(result)
  }
}

module.exports = ScheduleItemAPI

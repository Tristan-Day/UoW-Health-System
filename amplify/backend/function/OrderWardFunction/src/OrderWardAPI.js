class Validator {
  static fields = {
    ACTION_TYPE: String,
    ID: Number,
    WARD_ID: String,
    TITLE: String,
    DESCRIPTION: String,
    AUTHOR_NAME: String,
    TYPE: String
  }

  static searchIsValid = function (searchObj) {
    let search = Object.keys(searchObj)

    //ID
    if (search.hasOwnProperty('ID')) {
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
    if (search.hasOwnProperty('ID')) {
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
    if (search.hasOwnProperty('ID')) {
      return true
    }

    if (search.length === 0) {
      return false
    }

    const deleteFields = ['ID']

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

class OrderWardAPI {
  static hasCorrectPermissions = async function () {
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
      console.log(typeof req.query['ID'])

      if (Object.keys(req.query).includes('ID')) {
        console.log('selecting one by ID')

        console.log(Number(req.query['ID']))
        console.log(typeof Number(req.query['ID']))

        query = await client.query(
          'SELECT * FROM "system".ward_order_notes WHERE ID = ' +
            Number(req.query['ID']) +
            ';'
        )

        result = { success: query }
      }

      if (paramLength == 0) {
        console.log('selecting all')
        query = await client.query('SELECT * FROM "system".ward_order_notes;')

        result = { success: query }
      }

      //compound query
      if (paramLength > 0 && !Object.keys(req.query).includes('ID')) {
        console.log('running multiple iterations')

        let queryString = 'SELECT * FROM "system".ward_order_notes WHERE '
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
                    INSERT INTO "system".ward_order_notes (WARD_ID, TITLE, DESCRIPTION, AUTHOR_NAME, TYPE)
                    VALUES ($1, $2, $3, $4, $5)
                    `
        const values = [
          req.body['WARD_ID'],
          req.body['TITLE'],
          req.body['DESCRIPTION'],
          req.body['AUTHOR_NAME'],
          req.body['TYPE']
        ]

        let query = await client.query(queryString, values)
        result = { success: query }
      }

      if (req.body['ACTION_TYPE'] === 'UPDATE') {
        const queryString = `
                UPDATE "system".ward_order_notes SET WARD_ID = $1, TITLE = $2, DESCRIPTION = $3, AUTHOR_NAME = $4, TYPE = $5 WHERE ID = $6;
                `
        const values = [
          req.body['WARD_ID'],
          req.body['TITLE'],
          req.body['DESCRIPTION'],
          req.body['AUTHOR_NAME'],
          req.body['TYPE'],
          //where
          req.body['ID']
        ]

        let query = await client.query(queryString, values)
        result = { success: query }
      }
    } catch (error) {
      console.log(error)
      result = { failure: error }
    }

    res.json(result)
  }

  static delete = async function (req, res, setup) {
    let client = await setup()

    console.log('running delete')

    if (!this.hasCorrectPermissions()) {
      res.status(400).json({ failure: 'INCORRECT_PERMISSIONS' })
      return
    }

    if (!Validator.deleteIsValid(req.query)) {
      res.status(400).json({ failure: 'INCORRECT_QUERY' })
      return
    }

    console.log('passed tests')
    console.log(req.query)

    let result = {}
    try {
      const queryString = `
                    DELETE FROM "system".ward_order_notes WHERE ID = $1;
                    `
      const values = [req.query['ID']]

      let query = await client.query(queryString, values)
      result = { success: query }
    } catch (error) {
      console.log(error)
      result = { failure: error }
    }

    res.json(result)
  }
}

module.exports = OrderWardAPI

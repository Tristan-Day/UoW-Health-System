const ALL_STAFF = `
  SELECT
    *
  FROM
    system.staff staff
`

const SEARCH_STAFF =
  ALL_STAFF +
  ` WHERE 
      staff.first_name ILIKE '%' || $1 || '%' OR
      staff.last_name ILIKE '%' || $1 || '%'
  `

const staff = {
  // Retreival
  all: ALL_STAFF,
  search: SEARCH_STAFF
}

// Export the permissions object
module.exports = { staff }

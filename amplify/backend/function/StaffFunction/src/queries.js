const ALL_STAFF = `
  SELECT
    staff.staff_id, staff.first_name, staff.last_name, staff.email_address, staff.phone_number
  FROM
    system.staff staff
`

const SEARCH_STAFF =
  ALL_STAFF +
  ` WHERE 
      staff.first_name ILIKE '%' || $1 || '%' OR
      staff.last_name ILIKE '%' || $1 || '%'
  `

const CREATE_STAFF = `
  INSERT INTO 
    system.staff (staff_id, first_name, last_name, email_address, phone_number, image)
  VALUES
    ($1, $2, $3, $4, $5, $6)
`

const UPDATE_STAFF = `
  UPDATE
    system.staff
  SET
    first_name = $2, last_name = $3, email_address = $4, phone_number = $5, image = $6
  WHERE
    staff_id = $1
`

const staff = {
  // Retreival
  all: ALL_STAFF,
  search: SEARCH_STAFF,

  // Create and Update
  create: CREATE_STAFF,
  update: UPDATE_STAFF
}

// Export the permissions object
module.exports = { staff }

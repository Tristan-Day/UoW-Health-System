const ALL_ORDERS = `
  SELECT 
    building.name AS building, room.room_id, room.name AS room,
    ord.issued, ord.fulfilled, staff.first_name, staff.last_name
  FROM
    system.cleaning_orders ord
  LEFT JOIN
    system.rooms room ON room.room_id = ord.room_id
  LEFT JOIN
    system.buildings building ON room.building_id = building.building_id
  LEFT JOIN 
    system.staff staff ON ord.staff_id = staff.staff_id 
`

const SEARCH_ORDERS =
  ALL_ORDERS +
  `
  WHERE
    room.room_id = $1 
`

const ORDER_FULFIL = `
  UPDATE 
    system.cleaning_orders
  SET
    fulfilled = $2, staff_id = $3
  WHERE
    room_id = $1 AND fulfilled ISNULL
`

const ORDER_CANCEL = `
  DELETE FROM 
    system.cleaning_orders
  WHERE
    room_id = $1 AND fulfilled IS NULL
`

const orders = {
  // Retreoval
  all: ALL_ORDERS,
  search: SEARCH_ORDERS,

  // Actions
  cancel: ORDER_CANCEL,
  fulfill: ORDER_FULFIL
}

module.exports = { orders }

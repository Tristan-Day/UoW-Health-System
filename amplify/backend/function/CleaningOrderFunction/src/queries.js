const ALL_ORDERS = `
  SELECT 
    ord.room_id, room.name, ord.issued, ord.fulfilled, ord.staff_id
  FROM
    system.cleaning_orders ord
  LEFT JOIN
    system.rooms room ON room.room_id = ord.room_id
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
  all: ALL_ORDERS,
  cancel: ORDER_CANCEL,
  fulfill: ORDER_FULFIL,
}

module.exports = { orders }

const ALL_ORDERS = `
  SELECT 
    order.room_id, room.name, order.issued, order.fulfilled, order.staff_id
  FROM
    system.cleaning_orders order
  LEFT JOIN
    system.rooms room ON room.room_id = order.room_id
  WHERE
    room.room_id = $1
`

const ORDER_FULFIL = `
  UPDATE INTO 
    system.cleaning_orders (date_fulfilled, staff_id) 
  VALUES 
    ($1, $2)
  WHERE
    room_id = $1 AND fulfilled ISNULL
`

const ORDER_CANCEL = `
  DELETE FROM 
    system.cleaning_orders
  WHERE
    room_id = $1 AND orders.fulfilled ISNULL
`

const orders = {
  all: ALL_ORDERS,
  cancel: ORDER_CANCEL,
  fulfill: ORDER_FULFIL,
}

module.exports = { orders }

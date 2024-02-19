const BUILDING_CREATE = `
  INSERT INTO 
    system.buildings (name) 
  VALUES
    ($1) 
  ON CONFLICT 
    (name) 
  DO NOTHING 
  RETURNING building_id
`

const ALL_ROOMS = `
  SELECT 
    room.room_id, building.name AS building, room.floor, room.name AS room, room.description 
  FROM 
    system.rooms room
  LEFT JOIN
    system.buildings building ON building.building_id = room.building_id
`

const SELECT_ROOM =
  ALL_ROOMS + " WHERE room.name = $1"

const SEARCH_ROOMS =
  ALL_ROOMS + " WHERE room.name ILIKE '%' || $1 || '%'"

const buildings = {
  insert: BUILDING_CREATE
}

const rooms = {
  all: ALL_ROOMS,
  select: SELECT_ROOM,
  search: SEARCH_ROOMS
}

module.exports = { buildings, rooms }

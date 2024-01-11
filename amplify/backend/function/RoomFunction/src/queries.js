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

const ROOM_GET = `
  SELECT 
    room.room_id, building.name, room.floor, room.name, room.description 
  FROM 
    system.rooms room
  LEFT JOIN
    system.buildings building ON building.building_id = room.building_id
  WHERE
    room.name = $1
`


const buildings = {
  insert: BUILDING_CREATE
}

const rooms = {
  select: ROOM_GET
}

module.exports = { buildings, rooms }

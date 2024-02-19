const BUILDING_CONTENTS = `
  SELECT
    room.room_id, room.name, room.floor
  FROM 
    system.rooms room
  LEFT JOIN
    system.buildings building ON room.building_id = building.building_id
  WHERE
    building.name = $1
`

const buildings = {
  contents: BUILDING_CONTENTS
}

module.exports = { buildings }

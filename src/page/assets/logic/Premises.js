import { get, del, post, put } from 'aws-amplify/api'

export const getPremises = async (query) => {
  // Retreive all rooms
  if (query) {
    const operation = post({
      apiName: 'RoomHandler',
      path: `/v1/resources/rooms/search/`,
      options: {
        body: { query: query }
      }
    })

    return ((await operation.response));
  }
  else {
    const operation = post({
      apiName: 'RoomHandler',
      path: `/v1/resources/rooms/search`
    })

    const response = ((await operation.response));
    return (await response.body.json()).result
  }
}

export const getBuildings = async () => {
  const operation = get({
    apiName: 'BuildingHandler',
    path: `/v1/resources/buildings/`
  })

  const response = ((await operation.response));
  return (await response.body.json()).result
}

export const getRooms = async (building) => {
  const operation = get({
    apiName: 'BuildingHandler',
    path: `/v1/resources/buildings/${building}/`
  })

  const response = ((await operation.response));
  return (await response.body.json()).result
}

export const deletePremises = async (identifier) => {
  const operation = del({
    apiName: 'RoomHandler',
    path: `/v1/resources/rooms/${identifier}`
  })

  const response = ((await operation.response));
  return (await response.body.json()).result
}

export const createPremises = async (name, fields) => {
  const operation = put({
    apiName: 'RoomHandler',
    path: `/v1/resources/rooms/${name}/create`,
    options: {
      body: fields
    }
  })

  const response = ((await operation.response));
  return (await response.body.json()).result
}
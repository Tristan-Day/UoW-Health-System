import { getCurrentUser } from 'aws-amplify/auth'
import { get, del, post, put } from 'aws-amplify/api'

export const getOrders = async (query, includeFulfiled) => {
  // Lookup matching rooms
  var operation = post({
    apiName: 'RoomHandler',
    path: `/v1/resources/rooms/search/`,
    options: {
      body: { query: query }
    }
  })

  var response = await operation.response
  const records = (await response.body.json()).result

  var orders = []

  // Lookup all orders for the matching rooms
  for (let record of records) {
    operation = get({
      apiName: 'CleaningOrderHandler',
      path: `/v1/orders/cleaning/room/${record.room_id}`,
      options: {
        queryParams: { "fulfilled": Boolean(includeFulfiled) }
      }
    })

    try {
      response = await operation.response
      orders = orders.concat((await response.body.json()).result)
    }
    catch (error) {
      continue
    }
  }

  if (orders.length > 0) {
    return orders
  }
  else {
    throw new Error("No records found.")
  }
}

export const cancelOrder = async (room) => {
  console.log(room)


  const operation = del({
    apiName: 'CleaningOrderHandler',
    path: `/v1/orders/cleaning/room/${room}`,
  })


  const response = await operation.response
  return (await response.body.json()).result
}

export const fulfilOrder = async (room) => {
  const user = await getCurrentUser()

  const operation = put({
    apiName: 'CleaningOrderHandler',
    path: `/v1/orders/cleaning/room/${room}/fulfil`,
    options: {
      body: { "cleaner": user.username }
    }
  })

  const response = await operation.response
  return (await response.body.json()).result
}

export const issueOrder = async (room) => {
  const operation = put({
    apiName: 'CleaningOrderHandler',
    path: `/v1/orders/cleaning/room/${room}/issue`,
  })

  const response = await operation.response
  return (await response.body.json()).result
}
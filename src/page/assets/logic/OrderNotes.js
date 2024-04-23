import { get, del, post, put } from 'aws-amplify/api'

class OrderNotesAPI {
  static getOrderNotes = async function (wardId) {
    const operation = await get({
      apiName: 'OrderNoteHandler',
      path: `/v1/resources/order-note`,
      options: {
        queryParams: {
          WARD_ID: wardId
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }

  static upsertOrderNotes = async function (
    actionType,
    wardId,
    description,
    title,
    authorName,
    type,
    id
  ) {
    if (wardId != null && actionType == 'INSERT') {
      const operation = await post({
        apiName: 'OrderNoteHandler',
        path: `/v1/resources/order-note`,
        options: {
          body: {
            ACTION_TYPE: actionType,
            WARD_ID: wardId,
            TITLE: title,
            DESCRIPTION: description,
            AUTHOR_NAME: authorName,
            TYPE: type
          }
        }
      })

      const response = await operation.response
      let body = await response.body.json()
      console.log(body)
      return body
    }

    const operation = await post({
      apiName: 'OrderNoteHandler',
      path: `/v1/resources/order-note`,
      options: {
        body: {
          ACTION_TYPE: actionType,
          ID: id,
          WARD_ID: wardId,
          TITLE: title,
          DESCRIPTION: description,
          AUTHOR_NAME: authorName,
          TYPE: type
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }

  static deleteOrderNotes = async function (id) {
    console.log('id to delete')
    console.log(id)

    const operation = await del({
      apiName: 'OrderNoteHandler',
      path: `/v1/resources/order-note`,
      options: {
        queryParams: {
          ID: parseInt(id)
        }
      }
    })

    const response = await operation.response
    let body = await response.body.json()
    console.log(body)
    return body
  }
}

export default OrderNotesAPI

import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class EventService{
  state = {
    event: false
  }

  createPrivateEventInstance = (eventId,location, startDate, startTime) => {
    const postUrl = config.eventConfig.eventUrl + ".json"

    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        [eventId]:{
          location: location,
          startDate: startDate,
          startTime: startTime,
        }
      })
    })
    .catch(err => console.log(err))
  }
}

let eventService = new EventService()
Object.freeze(eventService)
export default eventService

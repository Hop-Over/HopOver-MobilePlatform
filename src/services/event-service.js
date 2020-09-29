import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class EventService{
  state = {
    event: false
  }

  createEventInstance = (eventId, location, date, time) => {
    const postUrl = config.eventConfig.eventUrl + eventId
    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        going: null,
        maybe: null,
        noGo: null,
        location: location,
        date: date,
        time: time
      })
    })
    .catch(err => console.log(err))
  }
}

let eventService = new EventService()
Object.freeze(eventService)
export default eventService

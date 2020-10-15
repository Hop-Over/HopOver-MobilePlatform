import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class EventService{
  state = {
    event: false
  }

  getParticipantsData = async (eventId) => {
    const fetchUrl = config.eventConfig.eventUrl + eventId +  "/participants.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  updateParticipantData = (eventId, participantData) => {
    const postUrl = config.eventConfig.eventUrl + eventId +  ".json"

    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        participants: participantData
      })
    })
    .catch(err => console.log(err))
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

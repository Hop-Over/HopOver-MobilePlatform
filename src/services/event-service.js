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

  getEventInfo = async (eventId) => {
    const fetchUrl = config.eventConfig.eventUrl + eventId +  ".json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  getEventThreads = async (eventId) => {
    const fetchUrl = config.eventConfig.eventUrl + eventId + "/threads.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  addEventThread = async (eventId, messageId, threadText, senderId, sentDateTime) => {
    const postUrl = config.eventConfig.eventUrl + eventId + "/threads/" + messageId + ".json"
    const exists = await fetch(postUrl)
    if (exists != null){
      const data = { body: threadText, sender_id: senderId, date_sent: sentDateTime}
      fetch(postUrl, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      .catch(err => console.log(err))
    } else {
      postUrl = config.eventConfig.eventUrl + eventId + "/threads.json"
      const data = {}
      data[messageId] = { body: threadText, sender_id: senderId, date_sent: sentDateTime }
      fetch(postUrl, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
      .catch(err => console.log(err))
    }
    
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

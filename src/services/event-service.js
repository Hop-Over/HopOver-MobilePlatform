import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class EventService{
  state = {
    event: false
  }
}

let eventService = new EventService()
Object.freeze(eventService)
export default eventService

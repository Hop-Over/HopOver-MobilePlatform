import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class FirebaseService{
  state = {
    isSharing: false
  }

  getLocations = async (chatId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + chatId + "/locations.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  isSharing = async (userId, chatId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + chatId + "/locations/" + userId +".json"
    const response = await fetch(fetchUrl)
    const data = await response.json()

    if (data === null){
      return false
    } else {
      return true
    }
  }

  shareLocation = (userId, dialogId,location) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + ".json"
    const d = new Date()
    const date = {year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate()}
    const time = {hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds()}

    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        [userId]:{
        latitude: location.latitude,
        longitude: location.longitude,
        date: d
        }
      })
    })
    .catch(err => console.log(err))
  }

  stopLocation = (userId, dialogId) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + userId + ".json"
    fetch(postUrl,{
      method: 'DELETE'
    })
    .catch(err => console.log(err))
  }
}

let firebaseService = new FirebaseService()
Object.freeze(firebaseService)
export default firebaseService

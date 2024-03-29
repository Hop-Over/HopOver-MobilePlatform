import config from '../../config.json'
import ChatService from './chat-service'
import store from '../store'
import { fetchDialogs } from '../actions/dialogs'


class FirebaseService{
  state = {
    isSharing: false
  }

  getLocations = async (dialogId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + dialogId + "/locations.json"
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

  setChatColor = (dialogId, color) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + ".json"

    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        chatColor: color
      })
    })
    .catch(err => console.log(err))
  }

  getChatColor = async (dialogId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + dialogId + "/chatColor.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()

    if (data == null){
      this.setChatColor(dialogId, '#1897F8')
      return '#1897F8'
    }

    return data
  }
  setGradientColor = (dialogId, colors) => {
    // colors is an array
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + ".json"

    fetch(postUrl, {
      method: 'PATCH',
      body: JSON.stringify({
        gradientColor: colors
      })
    })
      .catch(err => console.log(err))
  }

  getGradientColor = async (dialogId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + dialogId + "/gradientColor.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()

    if (data == null) {
      this.setGradientColor(dialogId, ['#FF4363','#F6B5A1'])
      return ['#FF4363', '#F6B5A1']
    }

    return data
  }
}

let firebaseService = new FirebaseService()
Object.freeze(firebaseService)
export default firebaseService

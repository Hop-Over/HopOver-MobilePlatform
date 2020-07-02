import config from '../../config.json'

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

  isSharing = async (chatId, userId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + chatId + "/locations/" + userId +".json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  shareLocation = (userId, dialogId,location) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + ".json"
    const d = new Date()
    const date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()
    const time = d.getHours() + ':' + d.getMinutes() + ':'+ d.getSeconds()

    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        [userId]:{
        latitude: location.latitude,
        longitude: location.longitude,
        date: date,
        time: time
        }
      })
    })
    .then(res => console.log("Sharing"))
    .catch(err => console.log(err))
  }

  stopLocation = (userId, dialogId) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + userId + ".json"
    fetch(postUrl,{
      method: 'DELETE'
    })
    .then(res => console.log("Stopped Sharing"))
    .catch(err => console.log(err))
  }
}

let firebaseService = new FirebaseService()
Object.freeze(firebaseService)
export default firebaseService

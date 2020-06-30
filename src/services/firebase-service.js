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
    console.log(fetchUrl)
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }

  shareLocation = (userId, dialogId,location) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + ".json"
    fetch(postUrl,{
      method: 'PATCH',
      body: JSON.stringify({
        [userId]:{
        latitude: location.latitude,
        longitude: location.longitude
        }
      })
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  stopLocation = (userId, dialogId) => {
    const postUrl = config.firebaseConfig.firebaseUrl + dialogId + '/locations/' + userId + ".json"
    console.log(postUrl)
    fetch(postUrl,{
      method: 'DELETE'
    })
    .then(res => res.json())
    .catch(err => console.log(err))
  }
}

let firebaseService = new FirebaseService()
Object.freeze(firebaseService)
export default firebaseService

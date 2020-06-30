import config from '../../config.json'

class FirebaseService{

  getLocations = async (chatId) => {
    const fetchUrl = config.firebaseConfig.firebaseUrl + chatId + "/locations.json"
    const response = await fetch(fetchUrl)
    const data = await response.json()
    return data
  }
}

let firebaseService = new FirebaseService()
Object.freeze(firebaseService)
export default firebaseService

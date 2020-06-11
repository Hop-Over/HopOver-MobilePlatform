import ConnectyCube from 'react-native-connectycube'
import { AppState } from 'react-native'
import UserModel from '../models/user'

class ContactService {
  setUpListeners() {
    ConnectyCube.chat.onContactListListener= this.onContactListListener.bind(this)
    ConnectyCube.chat.onRejectSubscribeListener = this.onRejectSubscribeListener.bind(this)
    ConnectyCube.chat.onConfirmSubscribeListener = this.onConfirmSubscribeListener.bind(this)
    ConnectyCube.chat.onSubscribeListener = this.onSubscribeListener.bind(this)
  }

  async fetchRequests(){
    const response = await ConnectyCube.chat.contactList.get();
    return response
  }

  fetchFriends() {
    ConnectyCube.chat.contactList
      .get()
      .then(contactlist => {console.log("IDS: " + Object.keys(contactlist))})
      .catch(error => {});
  }

  sendRequest(userId) {
    ConnectyCube.chat.contactList.add(userId);
  }

  acceptRequest(requestId) {
    ConnectyCube.chat.contactList.confirm(requestId);
    console.log("ACCEPTED:")
  }

  rejectRequest(requestId) {
    ConnectyCube.chat.contactList.reject(requestId);
  }
}

const contactService = new ContactService()
Object.freeze(contactService)
export default contactService

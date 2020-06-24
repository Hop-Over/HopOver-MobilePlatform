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

  async fetchContactList(){
    const response = await ConnectyCube.chat.contactList.get();
    return response
  }

  sendRequest(userId) {
    ConnectyCube.chat.contactList.add(userId);
  }

  acceptRequest(requestId) {
    ConnectyCube.chat.contactList.confirm(requestId);
  }

  rejectRequest(requestId) {
    ConnectyCube.chat.contactList.reject(requestId);
  }

  deleteContact(userId){
    ConnectyCube.chat.contactList.remove(userId);
  }

  onConfirmSubscribeListener(userId){
    console.log(userId + " ACCEPTED REQUEST")
  }
  onRejectSubscribeListener(userId){
    console.log(userId + " REJECTED REQUEST")
  }
  onContactListListener(userId, type){
    console.log("CONTACT LIST UPDATED")
  }
  onSubscribeListener(userId){
    console.log(userId + " SENT YOU A REQUEST")
  }
}

const contactService = new ContactService()
export default contactService

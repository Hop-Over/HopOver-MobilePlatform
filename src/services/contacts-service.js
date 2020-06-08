import ConnectyCube from 'react-native-connectycube'
import { AppState } from 'react-native'

class ContactService {
  setUpListeners() {
    ConnectyCube.chat.onContactListListener= this.onContactListListener.bind(this)
    ConnectyCube.chat.onRejectSubscribeListener = this.onRejectSubscribeListener.bind(this)
    ConnectyCube.chat.onConfirmSubscribeListener = this.onConfirmSubscribeListener.bind(this)
    ConnectyCube.chat.onSubscribeListener = this.onSubscribeListener.bind(this)
  }

  fetchRequests() {
    ConnectyCube.chat.contactList
      .get()
      .then(contactlist => {console.log(Object.keys(contactlist))})
      .catch(error => {});
  }
}

const contactService = new ContactService()
Object.freeze(contactService)
export default contactService

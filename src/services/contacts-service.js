import ConnectyCube from 'react-native-connectycube'
import { AppState } from 'react-native'
import UserModel from '../models/user'
// import ChatService from 'chat-service'
import { deleteDialog } from '../actions/dialogs'


class ContactService {
  setUpListeners() {
    console.log("Setting up listeners")
    ConnectyCube.chat.onContactListListener= this.onContactListListener.bind(this)
    ConnectyCube.chat.onRejectSubscribeListener = this.onRejectSubscribeListener.bind(this)
    ConnectyCube.chat.onConfirmSubscribeListener = this.onConfirmSubscribeListener.bind(this)
    ConnectyCube.chat.onSubscribeListener = this.onSubscribeListener.bind(this)
    console.log("Completed setting up listeners")
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
    this.deleteConversation(userId)
  }
  
  async deleteDialog(dialogId) {
    await ConnectyCube.chat.dialog.delete(dialogId)
    store.dispatch(deleteAllMessages(dialogId))
    store.dispatch(deleteDialog(dialogId))
  }

  deleteConversation(userId){
      ConnectyCube.chat.dialog.list()
      .then(dialogs => {
            console.log(dialogs)
            var dialogId = ""
            for (let i = 0; i < dialogs.items.length; i++) {
                if(dialogs.items[i].type === 3){
                    if(dialogs.items[i].occupants_ids.includes(userId)){
                        dialogId = dialogs.items[i]._id;
                        break;
                    }
                }
            }
            this.deleteDialog(dialogId)
        })
        .catch(error => {
            console.log(error)
        });
  }

  onConfirmSubscribeListener(userId){
    console.log(userId + " ACCEPTED REQUEST")
  }
  onRejectSubscribeListener(userId){
    console.log("Reject Listener Invoked")
    if (userId != undefined) {
        this.deleteContact(userId)
        this.deleteConversation(userId)
    }
  }

  onContactListListener(userId, type){
    console.log("CONTACT LIST UPDATED")
  }
  onSubscribeListener(userId){
    console.log(userId + " SENT YOU A REQUEST")
  }
}

let contactService = new ContactService()
//Object.freeze(contactService)
export default contactService

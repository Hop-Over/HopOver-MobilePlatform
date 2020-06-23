import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native'
import Avatar from '../../components/avatar'
import ChatService from '../../../services/chat-service'
import UsersService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import { popToTop } from '../../../routing/init'
import store from '../../../store'

export default class ContactDetails extends Component {
  state = {
    isLoader: false,
    chatDialog: this.props.navigation.getParam('chatDialog')
  }

  isGroupCreator = () => {
    const dialog = this.state.chatDialog
    return ChatService.isGroupCreator(dialog.user_id)
  }

  isUserGroupCreator = (userId) => {
    const dialog = this.state.chatDialog
    return dialog.user_id === userId ? true : false

  }

  currentUser = () => {
    return store.getState().currentUser.user.id
  }

  isAdmin = (userId) => {
    const dialog = this.state.chatDialog
    const admins = dialog.admins_ids

    if (admins.includes(userId) || userId === dialog.user_id){
      return true
    } else {
      return false
    }
  }

  gotToChat = () => {
    const user = this.props.navigation.getParam('dialog', false)
    const { goBack } = this.props.navigation
    if (user.name) {
      goBack()
    } else {
      this.setState({ isLoader: true })
      ChatService.createPrivateDialog(user.id)
        .then((newDialog) => {
          this.setState({ isLoader: false })
          this.props.navigation.dispatch(popToTop)
          this.props.navigation.push('Chat', { dialog: newDialog })
        })
    }
  }

  removeAdmin = () => {
    const dialog = this.props.navigation.getParam('dialog', false)
    const chatDialog = this.state.chatDialog
    ChatService.removeAdmin(chatDialog.id, dialog.id)
    const index = chatDialog.admins_ids.indexOf(dialog.id)
    chatDialog.admins_ids.splice(index, 1)
    this.setState({chatDialog : chatDialog})
  }

  addAdmin = () => {
    const dialog = this.props.navigation.getParam('dialog', false)
    const chatDialog = this.state.chatDialog
    ChatService.addAdmin(chatDialog.id, dialog.id)
    chatDialog.admins_ids.push(dialog.id)
    this.setState({chatDialog : chatDialog})
  }

  render() {
    const dialog = this.props.navigation.getParam('dialog', false)
    let dialogPhoto

    if (dialog?.type) {
      // if group chat
      dialogPhoto = UsersService.getUsersAvatar(dialog.occupants_ids)
    } else {
      // if private chat
      dialogPhoto = dialog.avatar
    }

    const { isLoader, chatDialog } = this.state
    const currentId = this.currentUser()

    return (
      <View style={styles.container}>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}
        <Avatar
          photo={dialogPhoto}
          name={dialog.name || dialog.full_name}
          iconSize="extra-large"
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{dialog.name || dialog.full_name}</Text>
        </View>
        <TouchableOpacity onPress={this.gotToChat}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonLabel}>Start a dialog</Text>
          </View>
        </TouchableOpacity>
        {chatDialog.type === 2 && this.isGroupCreator() ?
            <TouchableOpacity onPress={() => {this.isAdmin(dialog.id) ?
              this.removeAdmin()
              : this.addAdmin()}}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonLabel}> {this.isAdmin(dialog.id) ? "Remove Admin" : "Add Admin"} </Text>
              </View>
            </TouchableOpacity>
            :
          false
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameContainer: {
    marginVertical: 70,
    borderBottomWidth: 1,
    borderColor: 'grey',
    width: '40%'
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
    padding: 5
  },
  buttonContainer: {
    height: 50,
    width: 200,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00e3cf',
    backgroundColor: '#00e3cf',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700'
  },
})

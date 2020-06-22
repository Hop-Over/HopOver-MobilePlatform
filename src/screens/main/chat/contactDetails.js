import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native'
import Avatar from '../../components/avatar'
import ChatService from '../../../services/chat-service'
import UsersService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import { popToTop } from '../../../routing/init'

export default class ContactDetails extends Component {
  state = {
    isLoader: false,
  }

  isGroupCreator = (userId) => {
    const dialog = this.props.navigation.getParam('dialog')
    return ChatService.isGroupCreator(userId)
  }

  isAdmin = (userId) => {
    const dialog = this.props.navigation.getParam('chatDialog')
    const admins = dialog.admins_ids
    console.log(admins)
    if (admins.includes(userId) || this.isGroupCreator(userId)){
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

  render() {
    const dialog = this.props.navigation.getParam('dialog', false)
    const chatDialog = this.props.navigation.getParam('chatDialog', false)
    let dialogPhoto

    if (dialog?.type) {
      // if group chat
      dialogPhoto = UsersService.getUsersAvatar(dialog.occupants_ids)
    } else {
      // if private chat
      dialogPhoto = dialog.avatar
    }

    const { isLoader } = this.state
    console.log(chatDialog.user_id , this.isAdmin(chatDialog.user_id))
    console.log(dialog.id, this.isAdmin(dialog.id))
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
        {this.isAdmin(chatDialog.user_id) ?
            <TouchableOpacity onPress={() => {this.isAdmin(dialog.id) ? ChatService.removeAdmin(chatDialog.id, dialog.id) : ChatService.addAdmin(chatDialog.id, dialog.id)}}>
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

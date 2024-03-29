import React, { PureComponent } from 'react'
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconGroup from 'react-native-vector-icons/FontAwesome'
import UsersService from '../../../services/users-service'
import UserService from '../../../services/users-service'
import ContactService from '../../../services/contacts-service'
// import Friends from '../../../screens/main/contact/index'
import Indicator from '../../components/indicator'
import User from './renderUser'
import Avatar from '../../components/avatar'
import { showAlert } from '../../../helpers/alert'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import ChatService from '../../../services/chat-service'
import { popToTop } from '../../../routing/init'
import { SIZE_SCREEN } from '../../../helpers/constants'
// import { fetchUsers } from '../actions/users'


class Contacts extends PureComponent {

  constructor(props) {
    super(props)
    this.isGroupDetails = this.props.navigation.getParam('isGroupDetails', false)

    this.state = {
      keyword: '',
      isLoader: false,
      dialogType: true,
      isUpdate: false,
      friendId: [],
      pendingId: [],
      updateContacts: true,    }
  }

  listUsers = null

  selectedUsers = []

  userNotFound = false


  updateSearch = keyword => this.setState({ keyword })

  keyExtractor = (item, index) => index.toString()

  toggleUserSelect = (user) => {
    let newArr = []
    this.selectedUsers.forEach(elem => {
      if (elem.id !== user.id) {
        newArr.push(elem)
      }
    })
    this.selectedUsers = newArr
    this.setState({ isUpdate: !this.state.isUpdate })
  }

  _renderUser = ({ item }) => {
    const isSelected = this.selectedUsers.find(elem => elem.id === item.id)
    return (
      <User
        user={item}
        selectUsers={this.selectUsers}
        dialogType={this.state.dialogType}
        selectedUsers={isSelected ? true : false}
      />
    )
  }

  changeTypeDialog = () => {
    this.selectedUsers = []
    this.setState({ dialogType: !this.state.dialogType })
  }

  _renderSelectedUser = ({ item }) => {
    return (
      <TouchableOpacity style={styles.selectedUser} onPress={() => this.toggleUserSelect(item)}>
        <View style={{ paddingLeft: 10 }}>
          <Avatar
            photo={item.avatar}
            name={item.full_name}
            iconSize="medium"
          />
          <View style={{ position: 'absolute', bottom: 7, right: 7, backgroundColor: 'white', width: 20, height: 20, borderRadius: 10 }}>
            <Icon name="cancel" size={20} color='#EB2F30' />
          </View>
        </View>
        <Text numberOfLines={2} style={{ textAlign: 'center' }}>{item.full_name.split(" ")[0]}</Text>
      </TouchableOpacity >
    )
  }

  goToPrivateChat = (user) => {
    const dialog = this.props.navigation.getParam('dialog', false)
    const str = dialog ? dialog.occupants_ids.length : 1
    return ChatService.createPrivateDialog(user.id)
      .then((newDialog) => {
        this.props.navigation.dispatch(popToTop)
        this.props.navigation.push('Chat', { dialog: newDialog })
      })
  }

  selectUsers = (user) => {
    const dialog = this.props.navigation.getParam('dialog', false)
    const str = dialog ? dialog.occupants_ids.length : 1

    // True - Publick dialog
    const userSelect = this.selectedUsers.find(elem => elem.id === user.id)
    if (userSelect) {
      let newArr = []
      this.selectedUsers.forEach(elem => {
        if (elem.id !== user.id) {
          newArr.push(elem)
        }
      })
      this.selectedUsers = newArr
    } else {
      if (this.selectedUsers.length + str === 9) {
        showAlert('Maximum 9 participants')
        return
      }
      this.selectedUsers.push(user)
    }
    this.setState({ isUpdate: !this.state.isUpdate })
  }


  searchUsers = () => {
    const { keyword } = this.state
    this.setState({updateContacts: true})
    let str = keyword.trim()
    if (str.length > 2) {
        this.getFriends(str)
    } else {
        showAlert('Enter more than 3 characters')
    }
  }

  getFriends = async (str) => {
      if (this.state.updateContacts){
        await ContactService.fetchContactList()
        .then((response) => {
          let friends = []
          let pending = []
          keys = Object.keys(response)
          keys.forEach(elem => {
            // Make sure that they are friends and not just a request
            let contact = response[elem]
            if(contact["subscription"] === "both" || contact["subscription"] === "from" || contact["subscription"] === "to"){
              friends.push(elem)
            } else if (contact["subscription"] === "none" && contact["ask"] === "subscribe" || contact["subscription"] === "none" && contact["ask"] === null) {
              pending.push(elem)
            }
          })
        var friendIds=friends.map(Number)
        this.searchFunc(str, friends)
        this.setState({friendId: friends})
        this.setState({pendingId: pending})
      })
    //   this.setState({updateContacts: false})
      this.setState({isLoader: false})
    }
  }

  searchFunc = (str, friends) => {
    const dialog = this.props.navigation.getParam('dialog', false)
    this.setState({ isLoader: true })
    UsersService.listContactUsersByFullName(str, friends, dialog?.occupants_ids)
      .then(users => {
        this.listUsers = users
        if(users.length === 0){
            this.userNotFound = true

        }else{
           this.userNotFound = false
        }
        this.setState({ isLoader: false })
        this.updateSearch()
      })
      .catch(() => {
        this.userNotFound = true
        this.setState({ isLoader: false })
      })
  }

  goToCreateDialogScreen = () => {
    const { navigation } = this.props
    if (this.isGroupDetails) {
      const addParticipant = this.props.navigation.getParam('addParticipant', false)
      navigation.goBack()
      addParticipant(this.selectedUsers)
      return
    }
    else if (this.selectedUsers.length === 1){
      this.goToPrivateChat(this.selectedUsers[0])
      return
    }
    navigation.push('CreateDialog', { users: this.selectedUsers })
  }



  render() {
    const { isLoader, dialogType } = this.state
    return (
      <View style={styles.container}>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}
        <View style={styles.searchUser}>
          <TextInput style={styles.searchInput}
            autoCapitalize="none"
            placeholder="Search users..."
            placeholderTextColor="grey"
            returnKeyType="search"
            onChangeText={this.updateSearch}
            onSubmitEditing={this.searchUsers}
            value={this.state.search}
          />
        </View>
        <View style={this.selectedUsers.length > 0 && styles.containerCeletedUsers}>
          <FlatList
            data={this.selectedUsers}
            keyExtractor={this.keyExtractor}
            renderItem={(item) => this._renderSelectedUser(item)}
            horizontal={true}
          />
        </View>
        {this.userNotFound ?
          (<Text style={styles.userNotFound}>Couldn't find user</Text>) :
          (
            <View style={{ flex: 1 }}>
              <FlatList
                data={this.listUsers}
                keyExtractor={this.keyExtractor}
                renderItem={(item) => this._renderUser(item)}
              />
            </View>
          )}
          {this.selectedUsers.length === 0  && this.listUsers === null?
          (<Text style={styles.noneSelected}> No one selected </Text>):
          (<CreateBtn goToScreen={this.goToCreateDialogScreen} type={BTN_TYPE.CONTACTS} />)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchUser: {
    margin: 10
  },
  searchInput: {
    fontSize: 18,
    fontWeight: '300',
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'grey',
    color: 'black',
    padding: 10,
  },
  dialogType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dialogTypeText: {
    marginHorizontal: 5,
    fontSize: 16
  },
  containerCeletedUsers: {
    marginBottom: 10
  },
  selectedUser: {
    width: 70,
    paddingBottom: 5,
    alignItems: 'center',
  },
  userNotFound: {
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center'
  },
  noneSelected: {
    fontSize: 17,
    marginBottom: SIZE_SCREEN.height/2,
    textAlign: 'center'
  }
})

const mapStateToProps = ({ dialogs }) => ({
  dialogs
})

export default connect(mapStateToProps)(Contacts)

import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, View, FlatList, Text, TextInput, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Requests from './requests'
import Dialog from '../dialogs/elements/dialog'
import Nav from './elements/nav'
import User from '../contacts/renderUser'
import ChatService from '../../../services/chat-service'
import ContactService from '../../../services/contacts-service'
import UserService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import BottomNavBar from '../../components/bottomNavBar'
import PushNotificationService from '../../../services/push-notification'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { showAlert } from '../../../helpers/alert'
import { SIZE_SCREEN } from '../../../helpers/constants'

class Search extends Component {
  static currentUserInfo = ''
  dialogs = []


  constructor(props) {
    super(props)
    navigation = this.props.navigation
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
      keyword: navigation.getParam("keyword"),
      isUpdate: false,
      friendId: navigation.getParam("friendId"),
      pendingId: navigation.getParam("pendingId"),
      initalUpdate: false,
    }
  }

  listUsers = null

  selectedUsers = []

  userNotFound = false

  updateSearch = keyword => this.setState({keyword})

  static navigationOptions = ({ navigation }) => {
    Search.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerTitle: (
        <Text style={[
          { fontSize: 22, color: 'black' },
          Platform.OS === 'android' ?
            { paddingLeft: 13 } :
            { paddingLeft: 0 }]}>
          {Search.currentUserInfo.full_name}
        </Text>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={Search.currentUserInfo.avatar}
            name={Search.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
      ),
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== Search.currentUserInfo.full_name) {
      Search.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: Search.currentUserInfo })
  }

  searchUsers = () => {
    const { keyword } = this.state
    let str = keyword.trim()
    if (str.length > 2) {
      this.setState({ isLoader: true })
      UserService.listUsersByFullName(str, [Search.currentUserInfo.id])
        .then(users => {
          this.listUsers = users
          this.userNotFound = false
          this.setState({ isLoader: false })
        })
        .catch(() => {
          this.userNotFound = true
          this.setState({ isLoader: false })
        })
    } else {
      showAlert('Enter more than 3 characters')
    }
  }

  initStates = () => {
    if (!this.state.initalUpdate){
      this.searchUsers()
      this.setState({initalUpdate: true})
    }
  }

  _renderUser = ({ item }) => {
    return (
      this.state.isLoader ?
      <Indicator color={'blue'} size={40} /> :
      // Why is this happening
      item !== undefined ?
      <View style={styles.totalContainer}>
        <View style={styles.renderAvatar}>
          <Avatar
            photo={item.avatar}
            name={item.full_name}
            iconSize="medium"
          />
          <Text style={this.state.pendingId.includes(item.id.toString()) ? styles.pendingTitle : styles.nameTitle}>{item.full_name}</Text>
          
          <View>
            {this.state.friendId.includes(item.id.toString()) || !this.state.pendingId.includes(item.id.toString()) ?
            (<TouchableOpacity style={styles.iconButtons}
              onPress={() => {
                if (this.state.friendId.includes(item.id.toString())){
                  ContactService.rejectRequest(item.id)
                  ContactService.deleteContact(item.id)
                  let index = this.state.friendId.indexOf(item.id.toString())
                  this.state.friendId.splice(index, 1)
                  this.searchUsers()

                } else if (!this.state.pendingId.includes(item.id.toString())) {
                  ContactService.sendRequest(item.id)
                  this.state.pendingId.push(item.id.toString())
                  this.searchUsers()
                }
              }}>
              <Icon name={this.state.friendId.includes(item.id.toString()) ? "close" : "add"} size={30} color="white"/>
            </TouchableOpacity>) :
            (<View style={styles.pendingButton}>
              <Text style={styles.pendingText}> Pending </Text>
            </View>)}
        </View>
      </View> 
      </View>:
      <View>
      </View>
    )
  }


  keyExtractor = (item, index) => index.toString()

  render() {
    this.initStates()
    const { isLoader, friendId, pendingId, initalUpdate } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <View style={styles.searchUser}>
          <TextInput style={styles.searchInput}
            autoCapitalize="none"
            placeholder="Search users..."
            placeholderTextColor="grey"
            returnKeyType="search"
            onChangeText={this.updateSearch}
            onSubmitEditing={this.searchUsers}
            value={this.state.keyword}
          />
        </View>
        {this.userNotFound ?
          (<Text style={styles.userNotFound}>Couldn't find user</Text>) :
          (
            <SafeAreaView style={styles.listUsers}>
              <FlatList
                data={this.listUsers}
                keyExtractor={this.keyExtractor}
                renderItem={(item) => this._renderUser(item)}
              />
            </SafeAreaView>
          )
        }
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  totalContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  space: {
    paddingRight: 50,
  },
  topMenu: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
  },
  topMenuElement:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#D1D1D1',
  },
  topMenuText:{
    color: 'black',
    fontSize: 14,
  },
  searchUser: {
    marginTop: 30,
    margin: 10
  },
  searchInput: {
    fontSize: 18,
    fontWeight: '300',
    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: 'black',
    color: 'black',
    padding: 10,
  },
  containerCeletedUsers: {
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    margin: 10
  },
  userNotFound: {
    color: "black",
    fontSize: 19,
    marginTop: SIZE_SCREEN.height/4,
    textAlign: 'center'
  },
  pendingText: {
    color: "white",
    fontSize: 15,
  },
  pendingButton: {
    width: 70,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#B5B5B5',
    marginRight: 10
  },
  listUsers: {
    flex: 1,
    alignItems: 'center'
  },
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    paddingVertical: 5,
  },
  renderContainer: {
    width: SIZE_SCREEN.width - 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderWidth:2,
    borderColor: '#00000014',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 5
  },
  nameTitle: {
    width: SIZE_SCREEN.width/1.5,
    fontSize: 17
  },
  pendingTitle: {
    width: SIZE_SCREEN.width/1.7,
    fontSize: 17
  },
  iconButtons: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#B5B5B5',
    marginRight: 10
  },
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Search)

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

  _renderUser = ({ item }) => {
    return (
      this.state.isLoader ?
      <Indicator color={'blue'} size={40} /> :
      // Why is this happening
      item !== undefined ?
      <View style={styles.renderContainer}>
        <View style={styles.renderAvatar}>
          <Avatar
            photo={item.avatar}
            name={item.full_name}
            iconSize="medium"
          />
          <Text style={styles.nameTitle}>{item.full_name}</Text>
          <View style={styles.buttonContainer}>
            {!this.state.friendId.includes(item.id.toString()) && !this.state.pendingId.includes(item.id.toString()) ?
            (<TouchableOpacity style={styles.iconButtons}
              onPress={() => {
                ContactService.sendRequest(item.id)
              }}>
              <Icon name="add" size={30} color="black"/>
            </TouchableOpacity>) :
            (<TouchableOpacity style={styles.iconButtons}
              onPress={() => {
                ContactService.deleteContact(item.id)
              }}>
              <Icon name="close" size={30} color="black"/>
            </TouchableOpacity>)}
          </View>
        </View>
      </View> :
      <View>
      </View>
    )
  }


  keyExtractor = (item, index) => index.toString()

  render() {
    const { isLoader, friendId, pendingId, initalUpdate } = this.state
    if (!initalUpdate){
      this.searchUsers()
      this.setState({initalUpdate: true})
    }
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
        <BottomNavBar navigation={this.props.navigation}/>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: "grey",
    fontSize: 35,
    marginTop: SIZE_SCREEN.height/4,
    textAlign: 'center'
  },

  listUsers: {
    marginLeft: 20,
    flex: 1
  },
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderContainer: {
    width: SIZE_SCREEN.width - 30,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  nameTitle: {
    width: SIZE_SCREEN.width/1.5,
    fontSize: 17
  },
  iconButtons: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#EAEAEA',
    alignSelf: 'flex-end'
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Search)

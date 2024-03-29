import React, { Component } from 'react'
import { SafeAreaView, StyleSheet, Image, View, FlatList, Text, TextInput, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
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

class People extends Component {
  static currentUserInfo = ''
  dialogs = []

  constructor(props) {
    super(props)
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
      keyword: '',
      isUpdate: false,
      friendId: [],
      pendingId: [],
      updateContacts: false,
    }
  }

  listUsers = null

  selectedUsers = []

  userNotFound = false

  updateSearch = keyword => this.setState({keyword })

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

  static navigationOptions = ({ navigation }) => {
    People.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerStyle: {borderBottomWidth: 0},
      headerLeft: (
        <View style={styles.userIdContainer}>
          <Text style={[
            { fontSize: 35, color: 'black', fontWeight: "600" },
            Platform.OS === 'android' ?
              { paddingLeft: 13 } :
              { paddingLeft: 0 }]}>
            People
          </Text>
        </View>
      ),
      headerTitle: (
        <View style={styles.logo}>
          <Image style={{width: 80, height: 15 }} source={require('../../../../assets/image/text_logo.png')} />
        </View>
      ),
      headerRight: (
        <View style={styles.navBarContainer}>
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={People.currentUserInfo.avatar}
            name={People.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
        </View>
      ),
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== People.currentUserInfo.full_name) {
      People.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  componentDidMount(){
    this.getContacts()
  }

  shouldComponentUpdate(nextProps, nextState){
    if (nextState.updateContacts !== this.state.updateContacts){
      this.getContacts()
      this.setState({updateContacts: false})
      return true
    }
    return true
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: People.currentUserInfo })
  }

  deleteConversation = (userId) => {
    ConnectyCube.chat.dialog.list()
        .then(dialogs => {
            console.log(dialogs)
        })
        .catch(error => {
            console.log(error)
        });
  }

  getContacts = async () => {
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
      var friendIds = friends.map(Number)
        this.setState({friendId: friends})
        this.setState({pendingId: pending})
    })
    await UserService.getOccupants(this.state.friendId)
    //friendInfo = await ChatService.getUserFromServerById(this.state.friendId[0])
    //console.log(friendInfo.items)
    this.setState({isLoader: false})
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

  searchUsers = () => {
    const { keyword } = this.state
    let str = keyword.trim()
    if (str.length > 2) {
      this.setState({ isLoader: true })
      UserService.listUsersByFullName(str, [People.currentUserInfo.id])
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


  selectUsers = (user) => {
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
      this.selectedUsers.push(user)
    }
    this.setState({ isUpdate: !this.state.isUpdate })
  }

  deleteFriend = (id, name) => {
	const { navigation } = this.props
	const dialog = navigation.getParam('dialog', false)
	Alert.alert(
	  'Are you sure you want to delete ' + name + ' as a friend?',
	  '',
	  [
		{
		  text: 'Yes',
		  onPress: () => {
			this.setState({ isLoader: true })
            ContactService.deleteContact(id)
		  }
		},
		{
		  text: 'Cancel'
		}
	  ],
	  { cancelable: false }
	)
  }

  _renderFriend = ({ item }) => {
    return (
      this.state.isLoader ?
      <Indicator color={'blue'} size={40} /> :
      item !== undefined ?
      <View style={styles.totalContainer}>
        <View style={styles.renderAvatar}>
          <Avatar
            photo={item.avatar}
            name={item.full_name}
            iconSize="medium"
          />
          <Text style={styles.nameTitle}>{item.full_name}</Text>
            <TouchableOpacity style={styles.iconButtons}
              onPress={() => {
                this.deleteFriend(item.id, item.full_name.split(' ')[0])
              }}>
              <Icon name="close" size={25} color="white"/>
            </TouchableOpacity>
        </View>
      </View> :
      null
    )
  }


  keyExtractor = (item, index) => index.toString()

  render() {
    const navigation = this.props.navigation
    const { isLoader, friendId, pendingId, keyword } = this.state
    data = UserService.getUsersInfoFromRedux(friendId)

    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <Nav navigation={this.props.navigation}/>

        <View style={styles.searchUser}>
          <TextInput style={styles.searchInput}
            autoCapitalize="none"
            placeholder="Search"
            placeholderTextColor="grey"
            returnKeyType="search"
            onChangeText={this.updateSearch}
            onSubmitEditing={() => {
              if (keyword.length > 3){
              navigation.navigate('Search',{navigation: navigation, pendingId: pendingId, friendId: friendId, keyword: keyword})
            } else {
              showAlert('Enter more than 3 characters')
            }
            }}
            value={this.state.search}
          />
        </View>
        {friendId.length > 0 ?
          (<SafeAreaView style={styles.listUsers}>
            <FlatList
              data={data}
              renderItem={this._renderFriend}
              keyExtractor={this.keyExtractor}
            />
          </SafeAreaView>) :
          (<Text style={styles.userNotFound}> No friends yet </Text>)
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
  totalContainer:{
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
  userIdContainer: {
    justifyContent: "center",
    height: 100,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
    fontSize: 100,
    paddingLeft: 20,
  },
  navBarContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 25,
    marginRight: 5,
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
    marginTop: 90,
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
    backgroundColor: '#B5B5B5',
    marginRight: 10
  },
  logo: {
    marginTop: -30,
  }
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(People)

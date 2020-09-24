import ConnectyCube from 'react-native-connectycube'
import React, { Component } from 'react'
import { SectionList,SafeAreaView, StyleSheet, View, FlatList, Text, TextInput, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Dialog from '../dialogs/elements/dialog'
import User from './elements/renderUser'
import Nav from './elements/nav'
import UserService from '../../../services/users-service'
import ContactService from '../../../services/contacts-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import BottomNavBar from '../../components/bottomNavBar'
import PushNotificationService from '../../../services/push-notification'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { StackActions, NavigationActions } from 'react-navigation';
import { SIZE_SCREEN } from '../../../helpers/constants'

class Requests extends Component {
  static currentUserInfo = ''
  dialogs = []

  constructor(props) {
    super(props)
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
      keyword: '',
      requestId: [],
      friendId: [],
      pendingId: [],
      updateContacts: false,
      isLoader: true
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
    Requests.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerStyle: {borderBottomWidth: 0},
      headerLeft: (
        <View style={styles.userIdContainer}>
          <Text style={[
            { fontSize: 35, color: 'black', fontWeight: "bold" },
            Platform.OS === 'android' ?
              { paddingLeft: 13 } :
              { paddingLeft: 0 }]}>
            People
          </Text>
        </View>
      ),
      headerRight: (
        <View style={styles.navBarContainer}>
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={Requests.currentUserInfo.avatar}
            name={Requests.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
        </View>
      ),
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== Requests.currentUserInfo.full_name) {
      Requests.currentUserInfo = { ...props.currentUser.user }
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
    props.push('Settings', { user: Requests.currentUserInfo })
  }

  keyExtractor = (item, index) => index.toString()

  getContacts = async () => {
    await ContactService.fetchContactList()
      .then((response) => {
        let requests = []
        let pending = []
        let friends = []
        keys = Object.keys(response)
        keys.forEach(elem => {
          // Make sure that they are requesting and not friends
          let contact = response[elem]
          if (contact["subscription"] === "none" && contact["ask"] === null && elem !== "NaN"){
            requests.push(elem)
          } else if(contact["subscription"] === "both" || contact["subscription"] === "from" || contact["subscription"] === "to"){
            friends.push(elem)
          } else if (contact["subscription"] === "none" && contact["ask"] === "subscribe" || contact["subscription"] === "none" && contact["ask"] === null) {
            pending.push(elem)
          }
        })
        this.setState({requestId: requests})
        this.setState({pendingId: pending})
        this.setState({friendId: friends})
    })
    await UserService.getOccupants(this.state.requestId)
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

  _renderRequest= ({ item }) => {
    return (
      this.state.isLoader ?
      <Indicator color={'blue'} size={40} /> :
      // Why is this happening
      item !== undefined ?
      <View style={styles.card}>
        <View style={styles.renderContainer}>
          <View style={styles.renderAvatar}>
            <Avatar
              photo={item.avatar}
              name={item.full_name}
              iconSize="medium"
            />
            <Text style={styles.nameTitle}>{item.full_name}</Text>
            <View style={styles.buttonContainer}>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.deleteIcon}
                onPress={() => {
                  ContactService.rejectRequest(item.id)
                  ContactService.deleteContact(item.id)
                  this.setState({updateContacts: true})
                }}>
                <Icon name="close" size={25} color="white"/>
              </TouchableOpacity>
            </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.acceptIcon}
                  onPress={() => {
                    ContactService.acceptRequest(item.id)
                    this.setState({updateContacts: true})
                  }}>
                  <Icon name="check" size={30} color="white"/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View> :
      <View>
      </View>
    )
  }

  render() {
    const { isLoader, friendId, requestId, pendingId, keyword, updateContacts } = this.state
    request = UserService.getUsersInfoFromRedux(requestId)
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
        {requestId.length > 0 ?
        (<SafeAreaView style={styles.listRequest}>
          <FlatList
            data={request}
            renderItem={this._renderRequest}
            keyExtractor={this.keyExtractor}
          />
        </SafeAreaView>):
        (<Text style={styles.userNotFound}> No requests </Text>)}
        <BottomNavBar navigation={this.props.navigation}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBarContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 10,
    marginRight: 5,
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
    borderBottomWidth: 5,
  },
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  nameTitle: {
    width: SIZE_SCREEN.width/1.8,
    fontSize: 17
  },
  pendingLabel: {
    backgroundColor: '#D1D1D1',
    padding: 10,
  },
  renderContainer: {
    width: SIZE_SCREEN.width - 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listRequest: {
    flex: 1,
    alignItems: 'center'
  },
  listPending: {
    marginLeft: 20,
    flex: 1
  },
  iconContainer: {
    paddingLeft: 6,
    paddingRight: 6,
  },
  deleteIcon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#B5B5B5',
    alignSelf: 'flex-end'
  },
  acceptIcon: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#92E989',
    alignSelf: 'flex-end'
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  userNotFound: {
    color: "black",
    fontSize: 19,
    marginTop: SIZE_SCREEN.height/3,
    textAlign: 'center'
  },
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Requests)

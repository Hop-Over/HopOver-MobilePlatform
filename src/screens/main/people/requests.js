import ConnectyCube from 'react-native-connectycube'
import React, { Component } from 'react'
import { SectionList,SafeAreaView, StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
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
      requestId: [],
      updateContacts: true,
      isLoader: true
    }
  }

  static navigationOptions = ({ navigation }) => {
    Requests.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerTitle: (
        <Text style={[
          { fontSize: 22, color: 'black' },
          Platform.OS === 'android' ?
            { paddingLeft: 13 } :
            { paddingLeft: 0 }]}>
          {Requests.currentUserInfo.full_name}
        </Text>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={Requests.currentUserInfo.avatar}
            name={Requests.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
      ),
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== Requests.currentUserInfo.full_name) {
      Requests.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: Requests.currentUserInfo })
  }

  keyExtractor = (item, index) => index.toString()

  getContacts = async () => {
    if (this.state.updateContacts){
      await ContactService.fetchContactList()
        .then((response) => {
          let requests = []
          keys = Object.keys(response)
          keys.forEach(elem => {
            // Make sure that they are requesting and not friends
            let contact = response[elem]

            if (contact["subscription"] === "none" && contact["ask"] === null && elem !== "NaN"){
              requests.push(elem)
            }
          })
          this.setState({requestId: requests})
      })
      this.setState({updateContacts: false})
      await UserService.getOccupants(this.state.requestId)
      this.setState({isLoader: false})
    }
  }

  _renderRequest= ({ item }) => {
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
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButtons}
                onPress={() => {
                  ContactService.acceptRequest(item.id)
                  this.setState({updateContacts: true})
                }}>
                <Icon name="check" size={30} color="black"/>
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButtons}
                onPress={() => {
                  ContactService.rejectRequest(item.id)
                  ContactService.deleteContact(item.id)
                  this.setState({updateContacts: true})
                }}>
                <Icon name="close" size={30} color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> :
      <View>
      </View>
    )
  }

  render() {
    const { isLoader, requestId, pendingId, updateContacts } = this.state
    this.getContacts()
    request = UserService.getUsersInfoFromRedux(this.state.requestId)
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <Nav navigation={this.props.navigation}/>
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
    width: SIZE_SCREEN.width - 30,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  listRequest: {
    marginTop: 80,
    marginLeft: 20,
    flex: 1,
    flexGrow: 1,
  },
  listPending: {
    marginLeft: 20,
    flex: 1
  },
  iconContainer: {
    paddingLeft: 6,
    paddingRight: 6,
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

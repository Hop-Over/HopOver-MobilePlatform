import React, { Component } from 'react'
import { StyleSheet, View, Image, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Dialog from './elements/dialog'
import ChatService from '../../../services/chat-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import BottomNavBar from '../../components/bottomNavBar'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import FirebaseService from '../../../services/firebase-service'
import EventService from '../../../services/event-service'
import PushNotificationService from '../../../services/push-notification'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SIZE_SCREEN } from '../../../helpers/constants'


class Events extends Component {
  static currentUserInfo = ''
  dialogs = []

  constructor(props) {
    super(props)
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
    }
  }

  static navigationOptions = ({ navigation }) => {
    Events.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerStyle: {borderBottomWidth: 0},
      headerLeft: (
        <View style={styles.userIdContainer}>
          <Text style={[
            { fontSize: 35, color: 'black', fontWeight: "600" },
            Platform.OS === 'android' ?
              { paddingLeft: 13 } :
              { paddingLeft: 0 }]}>
            Events
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
            photo={Events.currentUserInfo.avatar}
            name={Events.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
        </View>
      ),
    }
  }

  async componentDidMount() {
    ChatService.fetchDialogsFromServer()
      .then(() => {
        PushNotificationService.init(this.props.navigation)
      })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== Events.currentUserInfo.full_name) {
      Events.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: Events.currentUserInfo })
  }

  goToCreateEventScreen = (props) => {
    const { navigation } = this.props
    navigation.push('EventContacts')
  }

  async componentDidUpdate(prevProps) {
    const { dialogs } = this.props
    if (this.props.dialogs !== prevProps.dialogs) {
      this.dialogs = await this.fetchAdditionalInfo(dialogs)
      this.setState({ isLoader: false })
    }
  }

  getCustomData = async (eventId) => {
    const gradientColor = await FirebaseService.getGradientColor(eventId)
    const eventInfo =  await EventService.getEventInfo(eventId)
    const participantData = eventInfo.participants
    
    if (participantData == null || participantData.going == null){
      var going = 0
    }
    else {
      var going = participantData.going.length
    }
    return {
      going: going,
      startTime: eventInfo.startTime,
      startDate: eventInfo.startDate,
      location: eventInfo.location,
      event_description: eventInfo.event_description,
      gradientColor: gradientColor
    }
  }

  fetchAdditionalInfo = async (dialogs) => {
    cleanedEvents = []
    if (dialogs.length  > 0){
      for (index in dialogs){
        if (dialogs[index].description === 'private_event'){
          
          var currentEvent = dialogs[index]
          let eventInfo = await this.getCustomData(dialogs[index].id)
          currentEvent.location = eventInfo.location
          currentEvent.going = eventInfo.going
          currentEvent.startTime = eventInfo.startTime
          currentEvent.startDate = eventInfo.startDate
          currentEvent.event_description = eventInfo.event_description
          currentEvent.gradientColor = eventInfo.gradientColor
          cleanedEvents.push(currentEvent)
        }
      }
    }
    return cleanedEvents
  }

  lastElement = () => {
    return (
      <View style={styles.lastElement}>
      </View>
    )
  }

  keyExtractor = (item, index) => index.toString()

  _renderDialog = ({ item }) => {
    return (
      <Dialog dialog={item} navigation={this.props.navigation} />
    )
  }

  render() {
    const { isLoader } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor='white'/>
        {isLoader ?
          (
            <Indicator color={'red'} size={40} />
          ) : this.dialogs.length === 0 ?
            (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: SIZE_SCREEN.height/6}}>
              <Text style={{ fontSize: 19 }}>No events yet</Text>
            </View>
            ) :
            (
              <View>
                <FlatList
                  data={this.dialogs}
                  keyExtractor={this.keyExtractor}
                  renderItem={(item) => this._renderDialog(item)}
                  ListFooterComponent={this.lastElement}
                />
              </View>
            )
        }
        <CreateBtn goToScreen={this.goToCreateEventScreen} type={BTN_TYPE.DIALOG} isFirst={false} />
         <BottomNavBar navigation={this.props.navigation}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    height: SIZE_SCREEN.height
  },
  noChatButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  spacing: {
    backgroundColor: 'blue'
  },
  navBarContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 25,
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
  lastElement: {
    paddingBottom: SIZE_SCREEN.height/5
  },
  logo: {
    marginTop: -30,
  }
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Events)

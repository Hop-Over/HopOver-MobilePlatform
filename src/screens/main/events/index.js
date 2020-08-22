import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Dialog from './elements/dialog'
import ChatService from '../../../services/chat-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import BottomNavBar from '../../components/bottomNavBar'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import PushNotificationService from '../../../services/push-notification'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

      headerTitle: (
        <View style={styles.userIdContainer}>
          <Text style={[
            { fontSize: 22, color: 'black', fontWeight: "bold" },
            Platform.OS === 'android' ?
              { paddingLeft: 13 } :
              { paddingLeft: 0 }]}>
            {Events.currentUserInfo.full_name}
          </Text>
          <Text> #{Events.currentUserInfo.id}</Text>
        </View>
      ),
      headerRight: (
        <View style={styles.navBarContainer}>
          <TouchableOpacity
            onPress={() => this.goToEventContactsScreen(navigation)}>
            <Icon name="add" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profilePicture} onPress={() => this.goToSettingsScreen(navigation)}>
            <Icon name="settings" size={30} color="black" />
          </TouchableOpacity>

        </View>
      ),
    }
  }

  componentDidMount() {
    ChatService.fetchEventsFromServer()
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

  static goToEventContactsScreen = (props) => {
    props.push('EventContacts')
  }

  componentDidUpdate(prevProps) {
    const { dialogs } = this.props
    if (this.props.dialogs !== prevProps.dialogs) {
      this.dialogs = dialogs
      this.setState({ isLoader: false })
    }
  }

  keyExtractor = (item, index) => index.toString()

  _renderDialog = ({ item }) => {
    return (
      <Dialog dialog={item} navigation={this.props.navigation} />
    )
  }

  render() {
    const { isLoader } = this.state
    console.log(this.dialogs)
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor='white'/>
        {isLoader ?
          (
            <Indicator color={'red'} size={40} />
          ) : this.dialogs.length === 0 ?
            (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 19 }}>No Events yet</Text>
            </View>
            ) :
            (
              <View>
                <FlatList
                  data={this.dialogs}
                  keyExtractor={this.keyExtractor}
                  renderItem={(item) => this._renderDialog(item)}
                />
              </View>
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
  navBarContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 5
  },
  userIdContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  }
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Events)

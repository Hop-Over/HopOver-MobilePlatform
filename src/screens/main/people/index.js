import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Dialog from '../dialogs/elements/dialog'
import ChatService from '../../../services/chat-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import PushNotificationService from '../../../services/push-notification'
import { StackActions, NavigationActions } from 'react-navigation';

class People extends Component {
  static currentUserInfo = ''
  dialogs = []

  constructor(props) {
    super(props)
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
    }
  }

  static navigationOptions = ({ navigation }) => {
    People.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerTitle: (
        <Text style={[
          { fontSize: 22, color: 'black' },
          Platform.OS === 'android' ?
            { paddingLeft: 13 } :
            { paddingLeft: 0 }]}>
          {People.currentUserInfo.full_name}
        </Text>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={People.currentUserInfo.avatar}
            name={People.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
      ),
    }
  }

  componentDidMount() {
    ChatService.fetchDialogsFromServer()
      .then(() => {
        PushNotificationService.init(this.props.navigation)
      })
  }

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== People.currentUserInfo.full_name) {
      People.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: People.currentUserInfo })
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

  goToContactsScreen = () => {
    const { navigation } = this.props
    navigation.push('Contacts')
  }

  goToChatScreen = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Dialogs' })],
    });
    navigation.dispatch(resetAction);
  }

  goToPeopleScreen = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'People' })],
    });
    navigation.dispatch(resetAction);
  }

  render() {
    const { isLoader } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <View style={styles.topMenu}>
          <TouchableOpacity onPress={() => console.log('Friends')}>
            <View style={styles.topMenuElement}>
              <Text style={styles.topMenuText}> Friends </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.space}>
          </View>
          <TouchableOpacity onPress={() => console.log('Requests')}>
            <View style={styles.topMenuElement}>
              <Text style={styles.topMenuText}> Requests </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.goToChatScreen()}>
            <View style={styles.footerElement}>
              <Text style={styles.footerText}> Chats </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.goToPeopleScreen()}>
            <View style={styles.footerElement}>
              <Text style={styles.footerText}> People </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Pressed')}>
            <View style={styles.footerElement}>
              <Text style={styles.footerText}> Events </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    borderRadius: 20,
    backgroundColor: '#D1D1D1',
  },
  topMenuText:{
    color: 'black',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1',
  },
  footerElement:{
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 25,
  },
  footerText:{
    color: 'black',
    fontSize: 19,
  }
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(People)

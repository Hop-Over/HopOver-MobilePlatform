import ConnectyCube from 'react-native-connectycube'
import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Requests from './requests'
import Dialog from '../dialogs/elements/dialog'
import Nav from './elements/nav'
import ChatService from '../../../services/chat-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import BottomNavBar from '../../components/bottomNavBar'
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

  static getDerivedStateFromProps(props, state) {
    if (props.currentUser.user.full_name !== People.currentUserInfo.full_name) {
      People.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: People.currentUserInfo })
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

  render() {
    const { isLoader } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />

        <Nav navigation={this.props.navigation}/>

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
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(People)

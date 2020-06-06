import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import store from '../../../store'
import Dialog from './elements/dialog'
import ChatService from '../../../services/chat-service'
import Indicator from '../../components/indicator'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Avatar from '../../components/avatar'
import PushNotificationService from '../../../services/push-notification'

class Dialogs extends Component {
  static currentUserInfo = ''
  dialogs = []

  constructor(props) {
    super(props)
    this.state = {
      isLoader: props.dialogs.length === 0 && true,
    }
  }

  static navigationOptions = ({ navigation }) => {
    Dialogs.currentUserInfo = { ...store.getState().currentUser.user }
    return {
      headerTitle: (
        <Text style={[
          { fontSize: 22, color: 'black' },
          Platform.OS === 'android' ?
            { paddingLeft: 13 } :
            { paddingLeft: 0 }]}>
          {Dialogs.currentUserInfo.full_name}
        </Text>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={Dialogs.currentUserInfo.avatar}
            name={Dialogs.currentUserInfo.full_name}
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
    if (props.currentUser.user.full_name !== Dialogs.currentUserInfo.full_name) {
      Dialogs.currentUserInfo = { ...props.currentUser.user }
      return true
    } return null
  }

  static goToSettingsScreen = (props) => {
    props.push('Settings', { user: Dialogs.currentUserInfo })
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

  render() {
    const { isLoader } = this.state
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        {isLoader ?
          (
            <Indicator color={'red'} size={40} />
          ) : this.dialogs.length === 0 ?
            (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 19 }}>No chats yet</Text>
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
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => console.log('Pressed')}>
            <View style={styles.footerElement}>
              <Text style={styles.footerText}> Chats </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Pressed')}>
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
        <CreateBtn goToScreen={this.goToContactsScreen} type={BTN_TYPE.DIALOG} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default connect(mapStateToProps)(Dialogs)

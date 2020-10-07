import React, { Component } from 'react'
import { StyleSheet,View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
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
import FirebaseService from '../../../services/firebase-service'
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SIZE_SCREEN } from '../../../helpers/constants'



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
      headerStyle: {borderBottomWidth: 0},
      headerLeft: (
        <View style={styles.userIdContainer}>
          <Text style={[
            { fontSize: 35, color: 'black', fontWeight: "bold" },
            Platform.OS === 'android' ?
              { paddingLeft: 13 } :
              { paddingLeft: 0 }]}>
            Chat
          </Text>
        </View>
      ),
      headerRight: (
        <View style={styles.navBarContainer}>
        <TouchableOpacity onPress={() => this.goToSettingsScreen(navigation)}>
          <Avatar
            photo={Dialogs.currentUserInfo.avatar}
            name={Dialogs.currentUserInfo.full_name}
            iconSize="small"
          />
        </TouchableOpacity>
        </View>
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
      this.dialogs = this.removeEventsFromDialogs(dialogs)
      this.appendChatColors()
      this.setState({ isLoader: false })
    }
  }

  removeEventsFromDialogs = (dialogs) => {
    cleanedDialogs = []
    dialogs.forEach((dialog) => {
      console.log(dialog.description)
      if (dialog.description === null || dialog.description === ''){
        cleanedDialogs.push(dialog)
      }
    })
    return cleanedDialogs
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

  getChatColor = async (dialog) => {
    var response = await FirebaseService.getChatColor(dialog)
    return response
  }

  appendChatColors = () => {
    console.log("Updating Colors")
    if (this.dialogs.length  > 0){
      this.dialogs.forEach(async (chat, i) => {
        let color = await this.getChatColor(chat.id)
        this.dialogs[i].color = color
      })
    }
  }

  lastElement = () => {
    return (
      <View style={styles.lastElement}>
      </View>
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
              <Text style={{ fontSize: 19 }}>No chats yet</Text>
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
          <CreateBtn goToScreen={this.goToContactsScreen} type={BTN_TYPE.DIALOG} isFirst={false} />
          <BottomNavBar navigation={this.props.navigation}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    height: SIZE_SCREEN.height
  },
  bottomContainer:{
    flex: 1
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
  lastElement: {
    paddingBottom: SIZE_SCREEN.height/5
  },
})


const mapStateToProps = ({ dialogs, currentUser }) => ({
  dialogs,
  currentUser
})

export default connect(mapStateToProps)(Dialogs)

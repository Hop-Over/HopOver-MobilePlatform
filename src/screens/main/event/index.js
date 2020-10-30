import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AttachmentIcon from 'react-native-vector-icons/Entypo'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import ChatService from '../../../services/chat-service'
import UsersService from '../../../services/users-service'
import Post from './message'
import Avatar from '../../components/avatar'
import ImagePicker from 'react-native-image-crop-picker'
import ParticipantsBar from './elements/participantsBar'
import { DIALOG_TYPE, SIZE_SCREEN } from '../../../helpers/constants'
import LinearGradient from 'react-native-linear-gradient';


export class Event extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      activeIndicator: true,
      messageText: '',
      uniqueValue: 1,
    }
  }

  needToGetMoreMessage = null


  forceRemount = () => {
    this.setState(({ uniqueValue }) => ({
      uniqueValue: uniqueValue + 1
    }));
  }

  static navigationOptions = ({ navigation }) => {
    let dialog = navigation.state.params.dialog
    let dialogPhoto = ''
    if (dialog.type === DIALOG_TYPE.PRIVATE) {
      dialogPhoto = UsersService.getUsersAvatar(dialog.occupants_ids)
    } else {
      dialogPhoto = dialog.photo
    }
    return {
      headerStyle: {borderBottomWidth: 0, height: SIZE_SCREEN.height/15},
      headerTitle: (
        <View style={styles.headerContainer}>
          <View style={styles.navBarContainer}>
            <Text numberOfLines={3} style={{ fontSize: 22, color: '#323232', fontWeight: "600", marginTop: -5}}>
              {navigation.state.params.dialog.name}
            </Text>
            <Text numberOfLines={3} style={{ fontSize: 14, color: '#323232', fontWeight: "300", marginTop: 5}}>
              {navigation.state.params.dialog.startDate} @ {navigation.state.params.dialog.startTime}
            </Text>
          </View>
      </View>
      ),
      headerRight: (
        <TouchableOpacity style={styles.settings} onPress={() => this.goToDetailsScreen(navigation)}>
          <Icon name="settings" size={20} color={dialog.gradientColor[0]} />
        </TouchableOpacity>
      )
    }
  }

  static goToDetailsScreen = (props) => {
    const isNeedFetchUsers = props.getParam('isNeedFetchUsers', false)
    props.push('EventDetails', {dialog: props.state.params.dialog, isNeedFetchUsers })
  }

  async componentDidMount() {
    const { dialog } = this.props.navigation.state.params
    ChatService.getMessages(dialog)
      .catch(e => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then(amountMessages => {
        amountMessages === 100 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
        // amountMessages === 5 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
        this.setState({ activeIndicator: false })
      })
  }

  componentWillUnmount() {
    ChatService.resetSelectedDialogs()
  }

  getMoreMessages = () => {
    const { dialog } = this.props.navigation.state.params
    if (this.needToGetMoreMessage) {
      this.setState({ activeIndicator: true })
      ChatService.getMoreMessages(dialog)
        .then(amountMessages => {
          amountMessages === 5 ? this.needToGetMoreMessage = true : this.needToGetMoreMessage = false
          this.setState({ activeIndicator: false })
        })
    }
  }

  onTypeMessage = messageText => this.setState({ messageText })

  sendMessage = async () => {
        const { dialog } = this.props.navigation.state.params
        const { messageText } = this.state
        if (messageText.length <= 0) return
        await ChatService.sendMessage(dialog, messageText)
        this.setState({ messageText: '' })
  }

  sendAttachment = async () => {
    const { dialog } = this.props.navigation.state.params
    const img = await this.onPickImage()
    ChatService.sendMessage(dialog, '', img)
    this.componentDidMount
  }

  onPickImage = () => {
    return ImagePicker.openPicker({
      width: 300,
      height: 400,
      mediaType: 'any',
    //   cropping: true
    }).then(image => {
      return image
    })
  }

  _keyExtractor = (item, index) => index.toString()

  _renderMessageItem(message) {
    const { user } = this.props.currentUser
    const { dialog } = this.props.navigation.state.params
    const isOtherSender = message.sender_id !== user.id ? true : false
    return (
      <Post otherSender={isOtherSender} message={message} key={message.id} gradientColor={dialog.gradientColor} color={dialog.color} />
    )
  }

  render() {
    const { history } = this.props
    const { messageText, activeIndicator } = this.state
    const { dialog } = this.props.navigation.state.params
    //console.log(this.props.navigation.state.params.dialog.color)
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white', marginTop: 30 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
      >
        <StatusBar barStyle="dark-content" translucent={false} backgroundColor='white'/>
        {activeIndicator &&
          (
            <View style={styles.indicator}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )
        }
        <ParticipantsBar dialog={this.props.navigation.state.params.dialog}>
        </ParticipantsBar>
          <FlatList
            style={styles.historyContainer}
            data={history}
            keyExtractor={this._keyExtractor}
            renderItem={({ item }) => this._renderMessageItem(item)}
            onEndReachedThreshold={5}
            onEndReached={this.getMoreMessages}
            ListFooterComponent={this.lastElement}
          />
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <View>
              <TouchableOpacity onPress={this.sendAttachment} style={styles.attachment}>
                <Icon name="add" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <AutoGrowingTextInput
              style={styles.textInput}
              placeholder="Post"
              placeholderTextColor="#d1d1d1"
              value={messageText}
              onChangeText={this.onTypeMessage}
              maxHeight={170}
              minHeight={50}
              enableScrollToCaret
            />
          </View>
          <TouchableOpacity>
            <LinearGradient colors={[dialog.gradientColor[0], dialog.gradientColor[1]]} useAngle={true} style={[styles.button]}>
            <Icon name="arrow-upward" type="MaterialIcons" size={32} color="white" onPress={this.sendMessage} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    paddingVertical: 12,
    paddingHorizontal: 35,
    backgroundColor: "#e3e3e3",
  },
  historyContainer: {
    marginTop: 20
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#8c8c8c',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 35,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 50,
    height: 50,
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    marginLeft: -35,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#1897F8",
    borderRadius: 25
  },
  lastElement: {
    paddingBottom: SIZE_SCREEN.height / 5
  },
  attachment: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
    flexDirection: 'row',
    marginLeft: 20,
  },
  settings: {
    marginRight: 15,
  },
  navBarContainer: {
    flex: 1,
    flexDirection: "column",
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  headerContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state, props) => ({
  history: state.messages[props.navigation.state.params.dialog.id],
  currentUser: state.currentUser
})

export default connect(mapStateToProps)(Event)

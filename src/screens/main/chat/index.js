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
import Message from './message'
import Avatar from '../../components/avatar'
import ImagePicker from 'react-native-image-crop-picker'
import { DIALOG_TYPE } from '../../../helpers/constants'
import LinearGradient from 'react-native-linear-gradient';


export class Chat extends PureComponent {
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
      headerStyle: {borderBottomWidth: 0},
      headerTitle: (
        <View style={styles.headerContainer}>
          <View style={styles.navBarContainer}>
            <Avatar
              photo={dialogPhoto}
              name={navigation.state.params.dialog.name}
              iconSize="medium"
            />
            <Text numberOfLines={3} style={{ fontSize: 14, color: '#323232', fontWeight: "bold", marginTop: -5}}>
              {navigation.state.params.dialog.name}
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
    if (props.state.params.dialog.type === DIALOG_TYPE.PRIVATE) {
      props.push('PrivateDetails', {dialog: props.state.params.dialog })
    } else {
      props.push('GroupDetails', {dialog: props.state.params.dialog, isNeedFetchUsers })
    }
  }

  componentDidMount() {
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

  _renderMessageItem = (message, index) => {
    const { user } = this.props.currentUser
    const { dialog } = this.props.navigation.state.params
    const { history } = this.props
    const isOtherSender = message.sender_id !== user.id ? true : false

    let showDate = false
    let historyLength = history.length - 1

    if(index === historyLength){
      showDate = true
    }
    if(index < historyLength){
      let dateDiff = message.date_sent - history[index+1].date_sent
      //console.log("Index:" + index + " Date diff:" + dateDiff)
      showDate = dateDiff > 120 ? true:false
    }
  
    return (
      <Message otherSender={isOtherSender} message={message} key={message.id} gradientColor={dialog.gradientColor} color={dialog.color} showDate={showDate} />
    )
  }

  render() {
    const { history } = this.props
    const { messageText, activeIndicator } = this.state
    const { dialog } = this.props.navigation.state.params
    //console.log(this.props.navigation.state.params.dialog.color)
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white', paddingTop: 20 }}
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
        <FlatList
          inverted
          data={history}
          keyExtractor={this._keyExtractor}
          renderItem={({ item, index }) => this._renderMessageItem(item, index)}
          onEndReachedThreshold={5}
          onEndReached={this.getMoreMessages}
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
              placeholder="Message"
              placeholderTextColor="#d1d1d1"
              value={messageText}
              onChangeText={this.onTypeMessage}
              maxHeight={170}
              minHeight={50}
              enableScrollToCaret
            />
          </View>
          <LinearGradient colors={[dialog.gradientColor[0], dialog.gradientColor[1]]} useAngle={true} style={styles.button}>
          <TouchableOpacity>
            <Icon name="arrow-upward" type="MaterialIcons" size={32} color="white" onPress={this.sendMessage} />
          </TouchableOpacity>
        </LinearGradient>
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
    borderRadius: 25,
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
    marginLeft: -50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#1897F8",
    borderRadius: 25
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
  settings:{
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
  }
});

const mapStateToProps = (state, props) => ({
  history: state.messages[props.navigation.state.params.dialog.id],
  currentUser: state.currentUser
})

export default connect(mapStateToProps)(Chat)
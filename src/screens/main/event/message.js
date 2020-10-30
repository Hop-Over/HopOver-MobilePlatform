import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal, Platform, Image, Linking } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import store from '../../../store'
import Avatar from '../../components/avatar'
import { getTime } from '../../../helpers/getTime'
import MessageSendState from '../../components/messageSendState'
import ChatImage from '../../components/chatImage'
import Icon from 'react-native-vector-icons/AntDesign'
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import LinearGradient from 'react-native-linear-gradient';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class Post extends Component {
  isAtachment = null

  constructor(props) {
    super(props)
    this.state = {
      isModal: false,
      send_state: props.message.send_state,
      color: props.color,
      gradientColor: props.gradientColor,
      isMessagePress: false,
      threads: {} 
    }
    this.isAtachment = props.message.attachment
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log("NEXT PROPS:" + nextProps.color)
    //console.log("NEXT STATE: " + nextState.color)
    if (nextProps.message.send_state != nextState.send_state ||
      nextState.isModal !== this.state.isModal ||
      nextState.isMessagePress !== this.state.isMessagePress
    ) {
      return true
    } else if (nextProps.color != this.state.color) {
      this.setState({ color: nextProps.color })
      return true
    } else if (nextProps.gradientColor != this.state.gradientColor) {
      this.setState({ gradientColor: nextProps.gradientColor })
      return true
    }
    else {
      return false
    }
  }


  renderAttachment = (location) => {
    const { message } = this.props
    var locationStyle = styles.media
    if (location === "left") {
      locationStyle = styles.mediaLeft
    } else {
      locationStyle = styles.mediaRight
    }
    return (
      <TouchableOpacity style={locationStyle} onPress={this.handleModalState}>
        <ChatImage photo={message.attachment[0].url} width={200} height={150} />
        {message.attachment[0].type.includes("video") ?
          (
            <Icon name="caretright" size={60} style={styles.playIcon} />
          )
          :
          (null)
        }
      </TouchableOpacity>
    )
  }

  isLink = (msg) => {
    if (msg.toLowerCase().includes('.')) {
      return true
    }
    return false
  }

  validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  hyperlink = (msg) => {
    const msgArray = msg.split(' ')
    var formattedMessage = [];

    msgArray.forEach(text => {
      var containsLink = this.validURL(text)
      if (containsLink && (text.includes('http://') || text.includes('https://'))) {
        formattedMessage.push(
          <Text style={styles.hyperlink}
            onPress={() => Linking.openURL(text)}>
            {text}
          </Text>)
      }
      else if (containsLink) {
        formattedMessage.push(
          <Text style={styles.hyperlink}
            onPress={() => Linking.openURL('http://' + text)}>
            {text + " "}
          </Text>
        )
      }

      else {
        formattedMessage.push(
          <Text>{text} </Text>
        )
      }
    })

    return formattedMessage
  }

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  renderHeader = () => {
    return <View style={[{ margin: Platform.OS === 'ios' ? 35 : 15 }, { position: 'absolute', zIndex: 10 }]}>
      <Icon name="close" size={30} color='white' onPress={this.handleModalState} />
    </View>
  }

  onTypeThread = (messageId, threadText) => this.state.threads[messageId] = threadText

  render() {
    const { message, otherSender } = this.props
    const { threads } = this.state
    //console.log(this.state.color)
    if (this.isAtachment) { console.log(message.attachment[0]) }
    const { isModal } = this.state
    const user = otherSender ? store.getState().users[message.sender_id] : '.'
    return (
      <View>
        {this.isAtachment &&
          <Modal visible={isModal} transparent={false} style={{ backgroundColor: 'black' }}>
            <View style={{
              width: fullWidth,
              height: fullHeight,
            }}>
              {this.isAtachment && message.attachment[0].type !== "video/mp4" ?
                <ImageViewer
                  imageUrls={[{ url: message.attachment[0].url }]}
                  onCancel={() => this.handleModalState()}
                  enableSwipeDown
                  renderIndicator={() => null}
                  renderHeader={this.renderHeader}
                  renderImage={props => (
                    <ChatImage
                      photo={props.source.uri}
                      width={+message.attachment[0].width}
                      height={+message.attachment[0].height}
                    />

                  )}
                />
                :
                (
                  <View style={styles.background}>
                    <VideoPlayer source={{ uri: message.attachment[0].url }}   // Can be a URL or a local file.
                      // Store reference
                      // Callback when remote video is buffering
                      onError={this.videoError}               // Callback when video cannot be loaded
                      // controls={true}
                      onBack={this.handleModalState}
                      style={styles.backgroundVideo}
                    />
                  </View>
                )}

            </View>
          </Modal>
        }
        {otherSender ?
          (
            <View style={[styles.container, styles.positionToCenter]}>
              {this.isAtachment ? (
                <View style={[styles.message, styles.media, styles.mediaLeft]}>
                  {this.isAtachment &&
                    this.renderAttachment('left')
                  }
                </View>
              ) : (
                  <View>
                    <View style={styles.shadow}>
                      <LinearGradient colors={[this.state.gradientColor[0], this.state.gradientColor[1]]} useAngle={true} style={[styles.message, styles.messageContainer]}>
                        {this.isLink(message.body) ?
                          (<View style={[{ flexDirection: 'row' }, styles.messageText]}>
                            <Text style={styles.messageText}>
                              {this.hyperlink(message.body)}
                            </Text>
                          </View>) :
                          (<Text style={styles.messageText}>
                            {message.body || ' '}
                          </Text>)
                        }
                      </LinearGradient>
                      <View style={styles.timeStampRightContainer}>
                        <Text style={styles.dateSent}>
                          {getTime(message.date_sent)}
                        </Text>
                      </View>
                      <AutoGrowingTextInput
                        style={styles.textInput}
                        placeholder="Reply"
                        placeholderTextColor="#d1d1d1"
                        value={message.id in threads ? threads.message.id : null}
                        onChangeText={this.onTypeThread}
                        maxHeight={170}
                        minHeight={40}
                        maxWidth={fullWidth - 40}
                        enableScrollToCaret
                      />
                    </View>
                  </View>
                )}
            </View>
          ) :
          (
            <View style={[styles.container, styles.positionToCenter]}>
              {this.isAtachment ? (
                <View style={[styles.message, styles.media, styles.mediaRight]}>
                  {this.isAtachment &&
                    this.renderAttachment('right')
                  }
                </View>
              ) : (
                  <View>
                    <View style={styles.shadow}>
                      <LinearGradient colors={[this.state.gradientColor[0], this.state.gradientColor[1]]} useAngle={true} style={[styles.message, styles.messageContainer]}>
                        {this.isLink(message.body) ?
                          (<View style={[{ flexDirection: 'row' }, styles.messageText]}>
                            <Text style={styles.messageText}>
                              {this.hyperlink(message.body)}
                            </Text>
                          </View>) :
                          (<Text style={styles.messageText}>
                            {message.body || ' '}
                          </Text>)
                        }
                      </LinearGradient>
                      <View style={styles.timeStampRightContainer}>
                        <Text style={styles.dateSent}>
                          {getTime(message.date_sent)}
                        </Text>
                      </View>
                      <AutoGrowingTextInput
                        style={styles.textInput}
                        placeholder="Reply"
                        placeholderTextColor="#d1d1d1"
                        value={message.id in threads ? threads.message.id : null}
                        onChangeText={this.onTypeThread}
                        maxHeight={170}
                        minHeight={40}
                        maxWidth={fullWidth-40}
                        enableScrollToCaret
                      />
                    </View>
                  </View>
                  
                )}
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mediaLeft: {
    borderRadius: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 2,
  }, mediaRight: {
    borderRadius: 10,
    overflow: 'hidden',
    borderBottomRightRadius: 2,
  },
  textInput: {
    borderColor: '#00000029', 
    borderRightWidth: 1, 
    borderLeftWidth: 1, 
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    color: '#8c8c8c',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    paddingRight: 35,
  },
  playIcon: {
    position: 'absolute',
    top: 50,
    left: 65
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionToCenter: {
    justifyContent: 'center'
  },
  message: {
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  messageContainer: {
    width: fullWidth - 40,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: "#267DC9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
    justifyContent: 'center',
    paddingBottom: 20
  },
  dateSent: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: -20
  },
  timeStampRightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  hyperlink: {
    textDecorationLine: 'underline'
  }
})

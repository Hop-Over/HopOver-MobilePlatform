import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal, Platform, Image,Linking } from 'react-native'
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

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class Message extends Component {
  isAtachment = null

  constructor(props) {
    super(props)
    this.state = {
      isModal: false,
      send_state: props.message.send_state,
      color: props.color,
      gradientColor: props.gradientColor,
      showDate: props.showDate,
      isMessagePress: false,
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
    } else if (nextProps.color != this.state.color){
      this.setState({color: nextProps.color})
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
    if(location === "left"){
        locationStyle = styles.mediaLeft
    }else{
        locationStyle = styles.mediaRight
    }
    return (
      <TouchableOpacity style={locationStyle} onPress={this.handleModalState}>
        <ChatImage photo={message.attachment[0].url} width={200} height={150} />
        {message.attachment[0].type.includes("video") ?
        (
            <Icon name="caretright" size={60} style={styles.playIcon}/>
        )
        :
        (null)
        }
      </TouchableOpacity>
    )
  }

  isLink = (msg) => {
    if (msg !== null && msg.toLowerCase().includes('.')){
      return true
    }
    return false
  }

  validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

  hyperlink = (msg) => {
    const msgArray = msg.split(' ')
    var formattedMessage = [];

    msgArray.forEach(text => {
      var containsLink = this.validURL(text)
      if (containsLink && (text.includes('http://') || text.includes('https://'))){
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
        )}

      else {
        formattedMessage.push(
          <Text>{text} </Text>
      )}
    })

    return formattedMessage
  }

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  handleMessagePress = () =>{
    this.setState({ isMessagePress: ! this.state.isMessagePress})
  }

  renderHeader = () => {
    return <View style={[{ margin: Platform.OS === 'ios' ? 35 : 15 }, { position: 'absolute', zIndex: 10 }]}>
      <Icon name="close" size={30} color='white' onPress={this.handleModalState} />
    </View>
  }

  render() {
    const { message, otherSender} = this.props
    //console.log(this.state.color)
    if(this.isAtachment){ console.log(message.attachment[0]) }
    const { isModal } = this.state
    const user = otherSender ? store.getState().users[message.sender_id] : '.'
    console.log('Colour : ' + this.state.gradientColor[0] + ', ' + this.state.gradientColor[1])
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
                    <VideoPlayer source={{uri: message.attachment[0].url}}   // Can be a URL or a local file.
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
            <View style={[styles.container, styles.positionToLeft]}>
              <Avatar
                //photo={user.avatar}
                name={"user.full_name"}
                iconSize="small"
              />
              {this.isAtachment ? (
                <View style={[styles.message, styles.media, styles.mediaLeft]}>
                {this.isAtachment &&
                  this.renderAttachment('left')
                }
              </View>
              ):(
              <TouchableOpacity onPress={this.handleMessagePress}>
              <View>
                <View style={[styles.message, styles.messageToLeft]}>
                {this.isLink(message.body)?
                (<View style={[{flexDirection: 'row'}, styles.messageTextRight]}>
                  <Text style={[styles.messageTextLeft, (otherSender ? styles.selfToLeft : styles.selfToRight)]}>
                  {this.hyperlink(message.body)}
                  </Text>
                </View>) :
                (<Text style={[styles.messageTextLeft, styles.selfToLeft]}>
                  {message.body || ' '}
                </Text>)
              }
                </View>
                <View style={styles.timeStampLeftContainer}>
                  <Text style={styles.dateSentLeft}>
                    {(this.state.showDate || this.state.isMessagePress) ? getTime(message.date_sent):null}
                  </Text>
                  </View>
              </View>
              </TouchableOpacity>
              )}
            </View>
          ) :
          (
            <View style={[styles.container, styles.positionToRight]}>
              {this.isAtachment ? (
                  <View style={[styles.message, styles.media, styles.mediaRight]}>
                  {this.isAtachment &&
                    this.renderAttachment('right')
                  }
                </View>
              ):(
                <TouchableOpacity onPress={this.handleMessagePress}>
                <View>
                  <LinearGradient colors={[this.state.gradientColor[0], this.state.gradientColor[1]]} useAngle={true} style={[styles.message, styles.messageToRight]}>
                    {this.isLink(message.body)?
                    (<View style={[{flexDirection: 'row'}, styles.messageTextRight]}>
                      <Text style={[styles.messageTextRight, (otherSender ? styles.selfToLeft : styles.selfToRight)]}>
                      {this.hyperlink(message.body)}
                      </Text>
                    </View>) :
                    (<Text style={[styles.messageTextRight, styles.selfToRight]}>
                      {message.body || ' '}
                    </Text>)
                  }
                  </LinearGradient>
                  <View style={styles.timeStampRightContainer}>
                    <Text style={styles.dateSentRight}>
                      {(this.state.showDate || this.state.isMessagePress) ? getTime(message.date_sent):null}
                    </Text>
                    <MessageSendState send_state={message.send_state} />
                  </View>
                </View>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mediaLeft:{
    borderRadius: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 2,
  },mediaRight:{
    borderRadius: 10,
    overflow: 'hidden',
    borderBottomRightRadius: 2,
  },
  playIcon:{
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
    alignItems: 'flex-end',
  },
  positionToLeft: {
    justifyContent: 'flex-start'
  },
  positionToRight: {
    justifyContent: 'flex-end',
  },
  message: {
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageToLeft: {
    maxWidth: fullWidth - 90,
    backgroundColor: '#FFFFFF',
    shadowColor: "#267DC9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
    shadowColor: "#267DC9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageToRight: {
    maxWidth: fullWidth - 55,
    shadowColor: "#267DC9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
  },
  messageTextLeft: {
    fontSize: 16,
    color: '#323232'
  },
  messageTextRight: {
    fontSize: 16,
    color: '#FFFFFF'
  },
  selfToLeft: {
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  selfToRight: {
    alignSelf: 'flex-end'
  },
  dateSentLeft: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: '#50555C'
  },
  dateSentRight: {
    alignSelf: 'flex-start',
    fontSize: 10,
    color: '#50555C',
  },
  timeStampRightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  timeStampLeftContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 3,
    marginLeft: 10
  },
  hyperlink: {
    textDecorationLine: 'underline'
  }
})

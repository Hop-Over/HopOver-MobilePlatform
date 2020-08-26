import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Modal, Platform, Image } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import store from '../../../store'
import Avatar from '../../components/avatar'
import { getTime } from '../../../helpers/getTime'
import MessageSendState from '../../components/messageSendState'
import ChatImage from '../../components/chatImage'
import Icon from 'react-native-vector-icons/AntDesign'
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class Message extends Component {
  isAtachment = null

  constructor(props) {
    super(props)
    this.state = {
      isModal: false,
      send_state: props.message.send_state
    }
    this.isAtachment = props.message.attachment
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.message.send_state != nextState.send_state ||
      nextState.isModal !== this.state.isModal
    ) {
      return true
    } else {
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

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  renderHeader = () => {
    return <View style={[{ margin: Platform.OS === 'ios' ? 35 : 15 }, { position: 'absolute', zIndex: 10 }]}>
      <Icon name="close" size={30} color='white' onPress={this.handleModalState} />
    </View>
  }

  render() {
    const { message, otherSender } = this.props
    if(this.isAtachment){ console.log(message.attachment[0]) }
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
                    <VideoPlayer source={{uri: message.attachment[0].url}}   // Can be a URL or a local file.
                    ref={(ref) => {
                    this.player = ref
                    }}                                      // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
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
              <View>
                <View style={[styles.message, styles.messageToLeft]}>
                  <Text style={[styles.messageTextLeft, (otherSender ? styles.selfToLeft : styles.selfToRight)]}>
                    {message.body || ' '}
                  </Text>
                </View>
                <View style={styles.timeStampLeftContainer}>
                  <Text style={styles.dateSentLeft}>
                    {getTime(message.date_sent)}
                  </Text>
                  </View>
              </View>
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
                <View>
                  <View style={[styles.message, styles.messageToRight]}>
                    <Text style={[styles.messageTextRight, styles.selfToRight]}>
                      {message.body || ' '}
                    </Text>
                  </View>
                  <View style={styles.timeStampRightContainer}>
                    <Text style={styles.dateSentRight}>
                      {getTime(message.date_sent)}
                    </Text>
                    <MessageSendState send_state={message.send_state} />
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
    paddingHorizontal: 15
  },
  messageToRight: {
    maxWidth: fullWidth - 55,
    backgroundColor: '#1897F8',
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
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#50555C'
  },
  dateSentRight: {
    alignSelf: 'flex-end',
    fontSize: 10,
    color: '#50555C',
  },
  timeStampRightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 20
  },
  timeStampLeftContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: 3,
  }
})

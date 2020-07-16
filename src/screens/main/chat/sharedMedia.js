import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity,Image,Modal,Dimensions } from 'react-native'
import {FlatGrid} from 'react-native-super-grid'
import Avatar from '../../components/avatar'
import ChatService from '../../../services/chat-service'
import UsersService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import ChatImage from '../../components/chatImage'
import ImageViewer from 'react-native-image-zoom-viewer'
import { popToTop } from '../../../routing/init'
import store from '../../../store'
import { showAlert } from '../../../helpers/alert'
import Icon from 'react-native-vector-icons/AntDesign'
import { SIZE_SCREEN } from '../../../helpers/constants'
import Video from 'react-native-video';


const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class SharedMedia extends Component {
  state = {
    isLoader: false,
    dialog: this.props.navigation.getParam('dialog'),
    fetchImages: true,
    images: [],
    isModal: false,
    displayImage: "",
    numberLoaded: 0,
    endReached: false
  }

  componentDidMount(){
    const {fetchImages} = this.state

    if (fetchImages){
      this.getAttachments()
      this.setState({fetchImages: false})
    }
  }

  componentDidUpdate(){
    const {fetchImages} = this.state
    if (fetchImages){
      this.getAttachments()
      this.setState({fetchImages: false})
    }
  }

  getAttachments = () => {
    const {fetchImages, numberLoaded, images} = this.state
    const dialogId = this.state.dialog.id
    const data =  ChatService.getMessagesByDialogId(dialogId)
    const loadNumber = numberLoaded + Math.floor((fullHeight/100) * (fullWidth/100))
    let displayImages = images
    let count = numberLoaded

    while (images.length !== loadNumber && count < data.length){
      if (data[count].attachment !== null){
        displayImages.push(data[count].attachment)
      }
      count++
    }
    if (count >= data.length -1){
      this.setState({endReached: true})
    }
      this.setState({images: displayImages})
      this.setState({numberLoaded: loadNumber})
  }

  _renderAttachment = (item) => {
    return (
      <TouchableOpacity style={{ flex: 1, justifyContent: 'flex-start', marginBottom: 3, width: '100%' }} onPress={() => {
        this.handleModalState()
        this.setState({displayImage: item.item[0]})
      }}>
        <ChatImage photo={item.item[0].url} width={100} height={100} />
        {item.item[0].type.includes("video") ?
        (
            <Icon name="caretright" size={40} style={styles.playIcon}/>
        )
        :
        (null)
        }
      </TouchableOpacity>
    )
  }

  renderHeader = () => {
    return <View style={[{ margin: Platform.OS === 'ios' ? 35 : 15 }, { position: 'absolute', zIndex: 10 }]}>
      <Icon name="close" size={30} color='white' onPress={this.handleModalState} />
    </View>
  }

  handleModalState = () => {
    this.setState({ isModal: !this.state.isModal })
  }

  render() {
    const {isLoader, dialog, images, isModal, displayImage, endReached} = this.state
    return (
      <View>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}

        {images.length < 1 ?
          <Text style={styles.noImages}> No Shared Media </Text> :
          <View>
          <FlatGrid
          itemDimension={100}
          data={images}
          renderItem={this._renderAttachment}
          spacing={1}
          extraData={this.state.fetchImages}
          />
          <View>
            {endReached ? null :
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.setState({fetchImages:true})}>
              <Text style={styles.moreButton}> Load More Images </Text>
            </TouchableOpacity>
          </View>}
          </View>

        </View>}
        <Modal visible={isModal} transparent={false} style={{ backgroundColor: 'black' }}>
          <View style={{
            width: fullWidth,
            height: fullHeight,
          }}>
            {displayImage.type !== 'video/mp4' ?
            (
            <ImageViewer
              imageUrls={[{ url: displayImage.url }]}
              onCancel={() => this.handleModalState()}
              enableSwipeDown
              renderIndicator={() => null}
              renderHeader={this.renderHeader}
              renderImage={props => (
                <ChatImage
                  photo={displayImage.url}
                  width={+displayImage.width}
                  height={+displayImage.height}
                />
              )}
            />
            ) : (
            <View style={styles.background}>
                <Icon style={styles.backgroundX} name="close" size={30} color='white' onPress={this.handleModalState} />
                <Video source={{uri: displayImage.url}}   // Can be a URL or a local file.
                ref={(ref) => {
                this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}               // Callback when video cannot be loaded
                controls={true}
                resizeMode={"cover"}
                style={styles.backgroundVideo} />
            </View>
            )
        }
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    playIcon:{
        position: 'absolute',
        top: 30,
        left: 30
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
        },
    backgroundX: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10,
        },
  moreButton:{
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  buttonContainer: {
    height: 50,
    width: 200,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  noImages: {
    color: "black",
    fontSize: 19,
    marginTop: SIZE_SCREEN.height/3,
    textAlign: 'center'
  },
})

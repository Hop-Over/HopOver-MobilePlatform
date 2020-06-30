import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity,Image,Modal,Dimensions } from 'react-native'
import {FlatGrid} from 'react-native-super-grid'
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import Avatar from '../../components/avatar'
import ChatService from '../../../services/chat-service'
import FirebaseService from '../../../services/firebase-service'
import UsersService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import ChatImage from '../../components/chatImage'
import ImageViewer from 'react-native-image-zoom-viewer'
import { popToTop } from '../../../routing/init'
import store from '../../../store'
import { showAlert } from '../../../helpers/alert'
import Icon from 'react-native-vector-icons/AntDesign'
import { SIZE_SCREEN } from '../../../helpers/constants'


const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class ChatMap extends Component {
  state = {
    isLoader: false,
    dialog: this.props.navigation.getParam('dialog'),
    userLocation: null,
    reload: true,
  }

  currentUser = () => {
    return store.getState().currentUser.user.id
  }

  getChatLocations = async (chatId) => {
    await FirebaseService.getLocations(chatId)
      .then(res => console.log(res))
      .catch(err => console.log(err))

  }

  getLocationHandler = () => {
    const {reload} = this.state
    if (reload){
      console.log("Updating Location")
      Geolocation.getCurrentPosition(position =>
        { this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0221,
          }
        })
      console.log(this.state.userLocation)});
      this.setState({reload: false})
    }
  }

  render() {
    this.getLocationHandler()
    const {dialog,isLoader, userLocation} = this.state
    const chatId = dialog.id
    const userId = this.currentUser
    return (
      <View style={styles.container}>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}
        <View style={styles.container}>
        {userLocation === null ?
        <View>
          {isLoader && (
            <Indicator color={'red'} size={40} />
          )}
        </View> :
          <View style={styles.container}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: userLocation.latitudeDelta,
                longitudeDelta: userLocation.longitudeDelta,
              }}
            />
            <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.getChatLocations(chatId)}}>
              <Text style={styles.buttonText}> Share Location </Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonText:{
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
  map: {
    ...StyleSheet.absoluteFillObject,
  }
})

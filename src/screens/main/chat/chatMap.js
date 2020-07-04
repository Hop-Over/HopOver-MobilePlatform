import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity,Image,Modal,Dimensions } from 'react-native'
import {FlatGrid} from 'react-native-super-grid'
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps';
import Avatar from '../../components/avatar'
import ChatService from '../../../services/chat-service'
import FirebaseService from '../../../services/firebase-service'
import AuthService from '../../../services/auth-service'
import UsersService from '../../../services/users-service'
import Indicator from '../../components/indicator'
import ChatImage from '../../components/chatImage'
import ImageViewer from 'react-native-image-zoom-viewer'
import { popToTop } from '../../../routing/init'
import store from '../../../store'
import { showAlert } from '../../../helpers/alert'
import Icon from 'react-native-vector-icons/AntDesign'
import { SIZE_SCREEN } from '../../../helpers/constants'

export default class ChatMap extends Component {
  state = {
    isLoader: false,
    region: null,
    locations: [],
    sharing: true,
    dialog: this.props.navigation.getParam('dialog'),
    currentUser: store.getState().currentUser.user.id,
  }

  async componentDidMount(){
    const {dialog, currentUser}  = this.state
    const currentlySharing = await FirebaseService.isSharing(currentUser, dialog.id)
    this.setState({sharing: currentlySharing})
    this.getRegion()
    this.getChatLocations(dialog.id)

    this.locationsInterval = setInterval(() => {
      this.getChatLocations(dialog.id)
    }, 1000);

    this.sharingInterval = setInterval(() => {
      if (this.state.sharing){
        this.shareLocation()
      }
    }, 1000);
  }

  componentDidUpdate(){
    // Stop updating location if you stop sharing
    if (!this.state.sharing){
      clearInterval(this.sharingInterval)
    }
  }

  componentWillUnmount() {
    const {sharing} = this.state
    if (!sharing){
      clearInterval(this.sharingInterval)
    }
    clearInterval(this.locationsInterval)
  }

  stopLocation = () => {
    const userId = this.state.currentUser
    const dialog = this.props.navigation.getParam('dialog')
    this.setState({sharing: false })
    FirebaseService.stopLocation(userId, dialog.id)
    this.getChatLocations(dialog.id)
  }

  shareLocation = () => {
    const userId = this.state.currentUser
    const dialog = this.props.navigation.getParam('dialog')
    const location = this.state.region
    this.setState({sharing: true })
    FirebaseService.shareLocation(userId, dialog.id, location)
  }

  getUserNameById = (userId) => {
    if (userId === this.state.currentUser.toString()){
      return "You"
    } else {
      return store.getState().users[userId].full_name}
  }

  getChatLocations = async (chatId) => {
    let locations = []
    await FirebaseService.getLocations(chatId)
      .then(res => {
        for (let key in res){
          locations.push({
            latitude: res[key].latitude,
            longitude: res[key].longitude,
            id: key
          })
        }
      })
      .catch(err => console.log(err))
      this.setState({locations: locations})
  }

  getRegion = () => {
    Geolocation.getCurrentPosition(position =>
      {this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0221,
        }
      })
    });
  }

  render() {
    let dialog = this.props.navigation.getParam('dialog')
    const {isLoader, region, locations, sharing} = this.state
    const chatId = dialog.id
    const userLocations = locations.map(userPlace => (
      <MapView.Marker coordinate={userPlace} key={userPlace.id} title={this.getUserNameById(userPlace.id)} />
    ))
    return (
      <View style={styles.container}>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}
        <View style={styles.container}>
        {region === null ?
        <View>
          {isLoader && (
            <Indicator color={'red'} size={40} />
          )}
        </View> :
          <View style={styles.container}>
            <MapView
              showsUserLocation={true}
              style={styles.map}
              initialRegion={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              }}
              >
              {userLocations}
            </MapView>
            <View>
            {sharing ?
              (<TouchableOpacity style={styles.buttonContainer} onPress={() => {this.stopLocation()}}>
                <Text style={styles.stopText}> Stop Sharing Location </Text>
              </TouchableOpacity>) :
              (<TouchableOpacity style={styles.buttonContainer} onPress={() => {this.shareLocation()}}>
                <Text style={styles.shareText}> Share Location </Text>
              </TouchableOpacity>)}
            </View>
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
  shareText:{
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  stopText: {
    color: 'white',
    fontSize: 15,
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

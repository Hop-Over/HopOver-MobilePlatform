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

export default class ChatMap extends Component {
  state = {
    isLoader: false,
    region: null,
    reload: true,
    locations: [],
    updateLocations: true,
    sharing: false,
    dialog: this.props.navigation.getParam('dialog')
  }

  componentDidMount(){
    const {reload, dialog}  = this.state
    if (reload) {
      this.getRegion()
      this.getChatLocations(dialog.id)
      this.setState({reload: false})
    }
  }

  async componentDidUpdate(){
    const {reload, dialog} = this.state
    if (reload){
      await this.getChatLocations(dialog.id)
      this.setState({reload: false})
    }
  }

  isSharing = async (chatId, userId) => {
    await FirebaseService.isSharing(chatId, userId)
    .then(res => {
      if  (res === null){
        this.setState({sharing: false})
      } else {
        this.setState({sharing: true})
      }
    })
  }

  stopLocation = () => {
    const userId = this.currentUser()
    const dialog = this.props.navigation.getParam('dialog')
    FirebaseService.stopLocation(userId, dialog.id)
    this.isSharing(dialog.id, userId)
    this.getChatLocations(dialog.id)
    this.setState({reload: true})
  }

  shareLocation = () => {
    const userId = this.currentUser()
    const dialog = this.props.navigation.getParam('dialog')
    const location = this.state.region
    FirebaseService.shareLocation(userId, dialog.id, location)
    this.isSharing(dialog.id, userId)
    this.setState({reload: true})
  }

  currentUser = () => {
    return store.getState().currentUser.user.id
  }

  getUserNameById = (userId) => {
    if (userId === this.currentUser().toString()){
      return "Me"
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
      this.isSharing(chatId, this.currentUser())
  }

  getRegion = () => {
    const {reload} = this.state
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
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0221,
                longitudeDelta: 0.0221,
              }}
              region={{
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta}}
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

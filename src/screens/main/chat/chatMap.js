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


const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class ChatMap extends Component {
  state = {
    isLoader: false,
    dialog: this.props.navigation.getParam('dialog'),
  }

  


  render() {
    const {isLoader} = this.state
    return (
      <View>
        {isLoader && (
          <Indicator color={'red'} size={40} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
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

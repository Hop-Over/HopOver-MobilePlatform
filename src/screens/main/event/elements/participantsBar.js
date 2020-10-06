import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import EventService from '../../../../services/event-service'
import ChatService from '../../../../services/chat-service'

export default class ParticipantsBar extends Component {
  constructor(props) {
  super(props)
  const dialog = props.dialog

  this.state = {
      going: 0,
      maybe: 0,
      cantGo: 0,
      userStatus: null,
      participantData: {
        going: [],
        maybe: [],
        cantGo: []
      }
    };
  }

  removePreviousStatus = () => {
    const currentUser = ChatService.currentUser.id
    if (this.state.userStatus === 'going'){
      this.setState({going: this.state.going - 1})
      var removeIndex = this.state.participantData.going.indexOf(currentUser)
      this.state.participantData.going.splice(removeIndex, 1)

    } else if (this.state.userStatus === 'maybe'){
      this.setState({maybe: this.state.maybe - 1})
      var removeIndex = this.state.participantData.maybe.indexOf(currentUser)
      this.state.participantData.maybe.splice(removeIndex, 1)

    } else if (this.state.userStatus === 'cantGo'){
      this.setState({cantGo: this.state.cantGo - 1})
      var removeIndex = this.state.participantData.cantGo.indexOf(currentUser)
      this.state.participantData.cantGo.splice(removeIndex, 1)
    }
  }

  onGoingClicked = () => {
    if (this.state.userStatus !== 'going'){
      const currentUser = ChatService.currentUser.id
      this.setState({going: this.state.going + 1})
      this.state.participantData.going.push(currentUser)
      if (this.state.userStatus !== null){
        this.removePreviousStatus()
      }
      this.setState({userStatus: 'going'})
      EventService.updateParticipantData(this.props.dialog.id, this.state.participantData)
    }
  }

  onMaybeClicked = () => {
    if (this.state.userStatus !== 'maybe'){
      const currentUser = ChatService.currentUser.id
      this.setState({maybe: this.state.maybe + 1})
      this.state.participantData.maybe.push(currentUser)
      if (this.state.userStatus !== null){
        this.removePreviousStatus()
      }
      this.setState({userStatus: 'maybe'})
      EventService.updateParticipantData(this.props.dialog.id, this.state.participantData)
    }
  }

  onCantGoClicked = () => {
    if (this.state.userStatus !== 'cantGo'){
      const currentUser = ChatService.currentUser.id
      this.setState({cantGo: this.state.cantGo + 1})
      this.state.participantData.cantGo.push(currentUser)
      if (this.state.userStatus !== null){
        this.removePreviousStatus()
      }
      this.setState({userStatus: 'cantGo'})
      EventService.updateParticipantData(this.props.dialog.id, this.state.participantData)
    }
  }

  async componentDidMount(){
    var participantData = await EventService.getParticipantsData(this.props.dialog.id)
    if (participantData != null){
      if (participantData.going != null){
        var databaseValues = Object.values(participantData.going)
        this.setState({going: databaseValues.length})
        this.state.participantData.going = databaseValues
      }
      if (participantData.maybe != null){
        var databaseValues = Object.values(participantData.maybe)
        this.setState({maybe: databaseValues.length})
        this.state.participantData.maybe = databaseValues
      }
      if (participantData.cantGo != null){
        var databaseValues = Object.values(participantData.cantGo)
        this.setState({cantGo: databaseValues.length})
        this.state.participantData.cantGo = databaseValues
      }
      this.setUserStatus(participantData)
    }
  }

  setUserStatus = (statusData) => {
    const currentUser = ChatService.currentUser.id
    if (this.state.participantData.going.includes(currentUser)){
      this.setState({userStatus: 'going'})
    } else if (this.state.participantData.maybe.includes(currentUser)){
      this.setState({userStatus: 'maybe'})
    } else if (this.state.participantData.cantGo.includes(currentUser)){
      this.setState({userStatus: 'cantGo'})
    }
  }

  render(){
    navigation = this.props.navigation
    return (
      <View style={styles.topMenu}>
        <TouchableOpacity style={styles.tab} onPress={this.onGoingClicked}>
          <Text style={styles.title}> Going </Text>
          <Text style={styles.subTitle}> {this.state.going} Going </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabCenter} onPress={this.onMaybeClicked}>
          <Text style={styles.title}> Maybe </Text>
          <Text style={styles.subTitle}> {this.state.maybe} Maybe </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={this.onCantGoClicked}>
          <Text style={styles.title}> Can't Go </Text>
          <Text style={styles.subTitle}> {this.state.cantGo} Can't Go </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    height: SIZE_SCREEN.height/20,
  },
  tab: {
    paddingHorizontal: 45,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabCenter: {
    paddingHorizontal: 45,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subTitle: {
    color: 'grey',
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600'
  }
})

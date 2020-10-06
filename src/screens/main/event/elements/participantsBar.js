import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, SafeAreaView, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import EventService from '../../../../services/event-service'
import ChatService from '../../../../services/chat-service'
import Modal from 'react-native-modal'
import Avatar from '../../../components/avatar'
import Icon from 'react-native-vector-icons/MaterialIcons'

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
      },
      isModalVisible: false,
      modalTitle: '',
      modalData: []
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


  openModal = async (touchableName, userArray) => {
    if (userArray.length > 0){
      var userInfo = await ChatService.getUsersList(userArray)
    } else {
      var userInfo = []
    }
    this.setState({isModalVisible: true})
    this.setState({modalData: userInfo})
    this.setState({modalTitle: touchableName})
  }

  closeModal = () => {
    this.setState({isModalVisible: false})
    this.setState({modalData: []})
    this.setState({modalTitle: ''})
  };

  _renderUser = ( {item} ) => {
    return (
      <View>
        <TouchableOpacity>
          <View style={styles.renderContainer}>
          <View style={styles.renderAvatar}>
            <Avatar
            photo={item.avatar}
            name={item.full_name}
            iconSize="medium"
            />
            <Text style={styles.nameTitle}>{item.full_name}</Text>
          </View>
        </View>
        </TouchableOpacity>
      </View>
    )
  }

  render(){
    navigation = this.props.navigation
    return (
      <View>
        <View style={styles.topMenu}>
          <TouchableOpacity style={styles.tab} onPress={this.onGoingClicked} onLongPress={() => {this.openModal('Going', this.state.participantData.going)}}>
            <Text style={styles.title}> Going </Text>
            <Text style={styles.subTitle}> {this.state.going} Going </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabCenter} onPress={this.onMaybeClicked} onLongPress={() => {this.openModal('Maybe', this.state.participantData.maybe)}}>
            <Text style={styles.title}> Maybe </Text>
            <Text style={styles.subTitle}> {this.state.maybe} Maybe </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={this.onCantGoClicked} onLongPress={() => {this.openModal("Can't Go", this.state.participantData.cantGo)}}>
            <Text style={styles.title}> Can't Go </Text>
            <Text style={styles.subTitle}> {this.state.cantGo} Can't Go </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modal}>
          <Modal isVisible={this.state.isModalVisible}>
            <View style={styles.content}>
              <Text style={styles.modalTitle}> {this.state.modalTitle} </Text>
              <View>
              {this.state.modalData.length > 0 ?
              <SafeAreaView style={styles.listUsers}>
                <FlatList
                  data={this.state.modalData}
                  renderItem={this._renderUser}
                />
              </SafeAreaView>:
              <View style={styles.noUserContainer}>
              <Text style={styles.noUsersTitle}> Empty</Text>
              </View>}
              </View>
              <TouchableOpacity onPress={this.closeModal}>
                <Text style={styles.contentTitle}> Done </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
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
    borderBottomWidth: 1,
    borderColor: '#EAEAEA'
  },
  tab: {
    paddingHorizontal: 45,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabCenter: {
    paddingHorizontal: 45,
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
  },
  modalTitle: {
    paddingVertical: 20,
    fontSize: 26,
    fontWeight: '600',
    alignSelf: 'center'
  },
  modal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center'
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: SIZE_SCREEN.height/2
  },
  contentTitle: {
    fontSize: 20,
    bottom: 0,
    alignSelf: 'center'
  },
  noUsersTitle: {
    fontSize: 40,
    paddingVertical: 100,
    color: "grey"
  },
  renderContainer: {
		width: SIZE_SCREEN.width - 60,
		borderColor: 'grey',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 7,
    marginLeft: 30,
  },
  renderAvatar: {
		flexDirection: 'row',
		alignItems: 'center',
	},
  nameTitle: {
    fontSize: 17
  },
  listUsers: {
    height: SIZE_SCREEN.height/3,
  },
  noUserContainer: {
    alignSelf: 'center'
  }
})

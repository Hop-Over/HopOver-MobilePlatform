import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Alert
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import DialogInput from 'react-native-dialog-input';
import ImgPicker from '../../components/imgPicker'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import UsersService from '../../../services/users-service'
import ChatService from '../../../services/chat-service'
import Avatar from '../../components/avatar'
import { SIZE_SCREEN } from '../../../helpers/constants'
import Indicator from '../../components/indicator'
import { showAlert } from '../../../helpers/alert'
import { popToTop } from '../../../routing/init'
import store from '../../../store'
import Modal from 'react-native-modal';
import ColorSelect from './elements/colorSelect'

export default class EventDetails extends Component {

  constructor(props) {
	super(props)
	const dialog = this.props.navigation.getParam('dialog', false)
	const isNeedFetchUsers = this.props.navigation.getParam('isNeedFetchUsers', false)
	this.state = {
	  isPickImage: null,
	  dialogName: dialog.name,
	  dialogPhoto: dialog.photo,
	  isLoader: false,
	  occupantsInfo: isNeedFetchUsers ? [] : UsersService.getUsersInfoFromRedux(dialog.occupants_ids),
	  isDialogVisible: false,
	  searchKeyword: '',
    showUsers: false,
    dialog: this.props.navigation.getParam('dialog', false)
	}
  }

  componentDidMount() {
    this.props.navigation.addListener(
    'didFocus',
    payload => {
      const updateArrUsers = UsersService.getUsersInfoFromRedux(dialog.occupants_ids)
      this.setState({ isLoader: false, occupantsInfo: updateArrUsers })
    });

  	const dialog = this.state.dialog
  	const isNeedFetchUsers = this.props.navigation.getParam('isNeedFetchUsers', false)

  	if (isNeedFetchUsers) {
  	  this.fetchMoreUsers(dialog.occupants_ids)
  	}
    }

  fetchMoreUsers = async (occupants_ids) => {
	await UsersService.getOccupants(occupants_ids)
	const users = UsersService.getUsersInfoFromRedux(occupants_ids)
	this.setState({ occupantsInfo: users })
  }

  pickPhoto = (image) => {
	this.setState({ isPickImage: image })
  this.updateDialog()
  }

  updateSearch = (searchKeyword) => {
	  this.setState({searchKeyword})
	  {console.log('Search ' + this.state.searchKeyword )}
  }

  updateDialog = () => {
	const dialog = this.state.dialog
	const { dialogName, isPickImage } = this.state
	const updateInfo = {}
	if (dialogName !== dialog.name) {
	  updateInfo.name = dialogName
	}
	if (isPickImage) {
	  updateInfo.img = isPickImage
	}
	if (Object.keys(updateInfo).length === 0) {
	  return false
	}
	updateInfo.dialogId = dialog.id
	this.setState({ isLoader: true })
	ChatService.updateDialogInfo(updateInfo)
	  .then(() => {
		this.setState({ isLoader: false })
		showAlert('Dialog info is updated successfully')
	  })
	  .catch((error) => {
		this.setState({ isLoader: false })
		showAlert(error)
	  })
  }

  leaveGroup = () => {
	const { navigation } = this.props
	const dialog = navigation.getParam('dialog', false)
	Alert.alert(
	  'Are you sure you want to leave the event?',
	  '',
	  [
		{
		  text: 'Yes',
		  onPress: () => {
			this.setState({ isLoader: true })
			ChatService.deleteDialog(dialog.id)
			  .then(() => {
				this.setState({ isLoader: false })
				this.props.navigation.dispatch(popToTop)
			  })
			  .catch((error) => {
				this.setState({ isLoader: false })
				this.props.navigation.dispatch(popToTop)
			  })
		  }
		},
		{
		  text: 'Cancel'
		}
	  ],
	  { cancelable: false }
	)
  }

  isGroupCreator = () => {
	const dialog = this.state.dialog
	return ChatService.isGroupCreator(dialog.user_id)
  }


  isAdmin = () => {
    const dialog = this.state.dialog
    const admins = dialog.admins_ids
    const userId = this.currentUser()
    console.log(admins)
    if (admins.includes(userId)){
      return true
    } else {
      return false
    }
  }

  goToContactDeteailsScreen = (dialog) => {
    const { navigation } = this.props
    const chatDialog = this.props.navigation.getParam('dialog',false)
    navigation.push('ContactDetails', {dialog, chatDialog: chatDialog })

  }

  goToSharedMediaScreen = () => {
    const { navigation } = this.props
    const dialog = this.props.navigation.getParam('dialog',false)
    navigation.push('SharedMedia', {dialog})
  }

  goToChatMap = () => {
    const { navigation } = this.props
    const dialog = this.props.navigation.getParam('dialog',false)
    navigation.push('ChatMap', {dialog})
  }

  goToContactsScreen = () => {
	if (this.state.occupantsInfo.length === 8) {
	  showAlert('Maximum 9 participants')
	  return
	}
	const { navigation } = this.props
	const dialog = navigation.getParam('dialog', false)
	navigation.push('Contacts', { isGroupDetails: true, dialog, addParticipant: this.addParticipant })
  }

  addParticipant = (participants) => {
  	{ console.log('participants') }
  	{ console.log(participants) }
  	const dialog = this.state.dialog
  	this.setState({ isLoader: true })
  	ChatService.addOccupantsToDialog(dialog.id, participants)
  	  .then(dialog => {
  		const updateArrUsers = UsersService.getUsersInfoFromRedux(dialog.occupants_ids)
  		showAlert('Participants added')
  		this.setState({ isLoader: false, occupantsInfo: updateArrUsers })
  	  })
  	  .catch(error => {
  		console.warn('addParticipant', error)
  		this.setState({ isLoader: false })
  	  })
    }

  getUserName = async (id) => {
	await UsersService.getUserById(id)
	const users = UsersService.getUsersInfoFromRedux([id])
	return users
  }

  currentUser = () => {
    return store.getState().currentUser.user.id
  }

  goToSearchScreen = (searchResponse) => {
	const { navigation } = this.props
	const dialog = navigation.getParam('dialog', false)
	navigation.push('searchDialog', { dialog, searchResponse })
  }

  search = (phrase) => {
	if(phrase.length < 4){
		alert("Please enter a keyword with 4 letters or more")
	}else{
	this.handleCancel()
	const dialog = this.state.dialog
	var result = []
	ChatService.search(dialog.id, phrase)
		.then(response => {
            console.log('response')
            console.log(response.users)
			if(response.messages.length == 0){
				alert("No search results with \"" + phrase + "\" were found :(")
			}else{
				const searchResponse = response.messages
				searchResponse.sort(function(a, b){
					return b.date_sent - a.date_sent;
				});
				this.goToSearchScreen(searchResponse)
			}
		})
	}
  }

  handleCancel = () => {
	this.setState({ dialogVisible: false });
  };

  showDialog(isShow){
	this.setState({isDialogVisible: isShow});
  }
  sendInput(inputText){
	this.showDialog(false)
	console.log("sendInput: "+inputText);
	this.search(inputText)
  }

  updateName = (dialogName) => {
	  this.setState({ dialogName })
  }

  toggleShowUsers = () => {
    const {showUsers} = this.state
    {!showUsers ? this.setState({showUsers: true}) : this.setState({showUsers: false})}
  }

  keyExtractor = (item, index) => index.toString()

  _renderUser = ( {item} ) => {
    const showUsers = this.state.showUsers
    return (
  		<View>
      {showUsers ?
  			(<TouchableOpacity onPress={() => this.goToContactDeteailsScreen(item)}>
          <View style={styles.renderContainer}>
  				<View style={styles.renderAvatar}>
  					<Avatar
  					photo={item.avatar}
  					name={item.full_name}
  					iconSize="medium"
  					/>
  					<Text style={styles.nameTitle}>{item.full_name}</Text>
  				</View>
  					<Icon name="keyboard-arrow-right" size={30} color='black' />
  			</View>
        </TouchableOpacity>)
  	     : null
       }
      </View>
  	)
  }

  _renderFlatListHeader = () => {
	const {searchKeyword, showUsers} = this.state
	return this.isGroupCreator() || this.isAdmin() ?
	  (
		<View>
      <Text style={styles.labelTitle}> Event </Text>
			<TouchableOpacity style={styles.renderHeaderContainer} onPress={this.goToContactsScreen}>
          <View style={styles.renderAvatar}>
            <Icon name="person-add" size={35} color='black' style={{ marginRight: 15 }} />
          </View>
          <View>
            <Text style={styles.nameTitle}>Invite</Text>
          </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleShowUsers}>
          <View style={styles.renderAvatar}>
            <Icon name={!showUsers ? "keyboard-arrow-down" :"keyboard-arrow-up" } size={35} color='black' style={{ marginRight: 15 }} />
          </View>
          <View>
            <Text style={styles.nameTitle}>{!showUsers ? "View Invitees": "Hide Invitees"}</Text>
          </View>
      </TouchableOpacity>
		</View>
  ) :
  <View>
  <Text style={styles.labelTitle}> Group </Text>
    <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleShowUsers}>
        <View style={styles.renderAvatar}>
          <Icon name={!showUsers ? "keyboard-arrow-down" :"keyboard-arrow-up" } size={35} color='black' style={{ marginRight: 15 }} />
        </View>
        <View>
          <Text style={styles.nameTitle}>{!showUsers ? "View members": "Hide members"}</Text>
        </View>
    </TouchableOpacity>
    </View>
  }

  _renderFlatListFooter = () => {
	return(
  <View>
    <Text style={styles.labelTitle}> Media</Text>
    <View style={styles.searchContainer}>
    <TextInput style={styles.searchInput}
    autoCapitalize="none"
    placeholder="Search Event..."
    placeholderTextColor="grey"
    clearButtonMode = "while-editing"
    returnKeyType = "search"
    onChangeText={this.updateSearch}
    onSubmitEditing = {() => this.sendInput(this.state.searchKeyword)}
    value={this.state.search}
  />
  </View>
  <TouchableOpacity style={styles.renderHeaderContainer} onPress={() => this.goToSharedMediaScreen()}>
    <View style={styles.renderAvatar}>
    <Icon name="image" size={35} color='black' style={{ marginRight: 15 }} />
    </View>
    <View>
    <Text style={styles.nameTitle}>Shared Media</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={styles.renderHeaderContainer} onPress={() => this.goToChatMap()}>
    <View style={styles.renderAvatar}>
    <Icon name="room" size={35} color='black' style={{ marginRight: 15 }} />
    </View>
    <View>
    <Text style={styles.nameTitle}>Location Sharing</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.renderHeaderContainer, styles.leaveButton]} onPress={this.leaveGroup}>
	  <View style={styles.renderAvatar}>
		<Icon name="exit-to-app" size={20} color='white' style={{ marginRight: 15 }} />
	  </View>
	  <View>
		<Text style={styles.leaveTitle}>Leave Event</Text>
	  </View>
	</TouchableOpacity>
  </View>
  )}

  render() {
    const { dialogName, dialogPhoto, isLoader, occupantsInfo, dialog } = this.state
    //console.log(this.currentUser())
    //console.log(this.isAdmin())
    //console.log(this.state.showUsers)
    return (
      <KeyboardAvoidingView style={styles.container}>
        {isLoader &&
          <Indicator color={'blue'} size={40} />
        }
          <ColorSelect dialog={this.state.dialog} navigation={this.props.navigation} title={"Event Color"}>
          </ColorSelect>
          {this.isGroupCreator() || this.isAdmin() ?
          (<View>
            <TextInput
              style={styles.input}
              ref="input"
              autoCapitalize="none"
              placeholder="Change Event Name"
              placeholderTextColor="grey"
              onChangeText={this.updateName}
              value={dialogName}
              maxLength={100}
              onSubmitEditing = {() => this.updateDialog()}
            />
            <View style={styles.subtitleWrap}>
              <Text style={styles.subtitleInpu}>Change event name</Text>
            </View>
          </View>) :
          <Text style={styles.dialogName}>{dialogName}</Text>
        }
        <SafeAreaView style={styles.listUsers}>
          <FlatList
            data={occupantsInfo}
            ListHeaderComponent={this._renderFlatListHeader}
            ListFooterComponent={this._renderFlatListFooter}
            renderItem={this._renderUser}
            keyExtractor={this.keyExtractor}
            extraData={this.state}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}
// [{"avatar": null, "created_at": "2020-05-05T17:54:20Z", "custom_data": "asdfghjk", "full_name": "bilal", "id": 1338358, "last_request_at": null, "login": "dofypp", "phone": "", "updated_at": "2020-05-31T18:27:05Z"}]
const styles = StyleSheet.create({
	searchInput: {
		fontSize: 15,
		fontWeight: '300',
		borderWidth: 0.25,
		borderRadius: 50,
		borderColor: 'black',
		color: 'black',
		padding: 10,
	  },
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: 40
	},
	picker: {
		width: 102,
		height: 102,
		borderWidth: 1,
		borderColor: 'red'
	},
	imgPicker: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	icon: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		padding: 5,
		backgroundColor: 'white',
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 0,
		borderColor: 'black'
	},
	input: {
		borderBottomWidth: 1,
    textAlign: "center",
		borderColor: 'grey',
		color: 'black',
		width: 300,
		marginVertical: 15,
		padding: 7,
		paddingTop: 15,
		fontSize: 24,
    fontWeight: "bold",
	},
	subtitleInpu: {
		color: 'grey',
    textAlign: "center",
    fontSize: 14
	},
	subtitleWrap: {
		marginVertical: -7,
		bottom: 0,
    justifyContent: "center"
	},
	listUsers: {
		marginVertical: 10,
		flex: 1
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
	renderHeaderContainer: {
		width: SIZE_SCREEN.width - 30,
		flexDirection: 'row',
		borderColor: 'grey',
		alignItems: 'center',
		paddingVertical: 7,
	},
	renderAvatar: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	nameTitle: {
		fontSize: 17
	},

  labelTitle : {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 15,
    color: "grey"
  },

	removeTitle: {
		fontSize: 14,
		color: '#949494'
	},
	dialogName: {
    fontSize: 24,
    fontWeight: "bold",
		marginTop: 35
	},
  searchContainer : {
    paddingBottom: 10,
  },
  leaveButton:{
    backgroundColor: "red",
    justifyContent: 'center',
    width: SIZE_SCREEN.width/2,
    marginLeft: SIZE_SCREEN.width/2 - SIZE_SCREEN.width/4,
    borderRadius: 16,
    marginTop: 50,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  leaveTitle:{
    color: 'white',
    fontSize: 18
  }
})

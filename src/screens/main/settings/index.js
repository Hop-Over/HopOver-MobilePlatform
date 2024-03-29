import React, { Component } from 'react'
import DialogInput from 'react-native-dialog-input';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import AuthService from '../../../services/auth-service'
import FeedbackService from '../../../services/feedback-service'
import Indicator from '../../components/indicator'
import { showAlert } from '../../../helpers/alert'
import ImgPicker from '../../components/imgPicker'
import store from '../../../store'
import { StackActions, NavigationActions } from 'react-navigation';


export default class Settings extends Component {

  constructor(props) {
    super(props)
    const user = props.navigation.getParam('user')
    this.state = {
      isLoader: false,
      login: user.login,
      name: user.full_name,
      userId: store.getState().currentUser.user.id,
      isDialogVisible: false
    }
  }

  isPickImage = null

  pickPhoto = (image) => {
    this.isPickImage = image
  }


  onSaveProfile = () => {
    const { navigation } = this.props
    const user = this.props.navigation.getParam('user')
    const { login, name } = this.state
    this.refs.input.blur()
    const newData = {}
    if (user.full_name !== name) {
      newData.full_name = name
    }
    if (user.login !== login) {
      newData.login = login
    }
    if (this.isPickImage) {
      newData.image = this.isPickImage
    }
    if (Object.keys(newData).length === 0) {
      return
    }
    this.setState({ isLoader: true })
    AuthService.updateCurrentUser(newData)
      .then(() => {
        this.setState({ isLoader: false })
        showAlert('User profile is updated successfully')
        // navigation.navigate('Chat')
      })
      .catch((error) => {
        this.setState({ isLoader: false })
        showAlert(error)
      })
  }

  userLogout = () => {
    const { navigation } = this.props
    Alert.alert(
      'Are you sure you want to logout?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [NavigationActions.navigate({ routeName: 'Auth' })],
            });
            navigation.navigate('Auth')
            navigation.dispatch(resetAction);
            AuthService.logout()
          }
        },
        {
          text: 'Cancel'
        }
      ],
      { cancelable: false }
    )
  }

  updateLogin = login => this.setState({ login })

  updateName = name => this.setState({ name })

  feedbackReport = () => {
    this.showDialog(true)
  }

  showDialog = (value) =>{
    this.setState({isDialogVisible: value})
  }

  sendInput = (inputText) =>{
    console.log(inputText)
    this.sendFeedback(inputText)
    this.showDialog(false)
  }

  sendFeedback = (data) => {
    const userId = this.state.userId
    const bugId = "bug-" + Math.floor(Date.now() / 1000).toString()
    FeedbackService.sendFeedback(userId, bugId, data)
  }

  render() {
    const { isLoader, name, login, } = this.state
    const user = this.props.navigation.getParam('user')
    return (
      <KeyboardAvoidingView style={styles.container}>
        {isLoader &&
          <Indicator size={40} color={'blue'} />
        }
        <ImgPicker name={user.full_name} photo={user.avatar} pickPhoto={this.pickPhoto} />
        <View style={styles.inputWrap}>
          <View>
            <TextInput
              style={styles.input}
              ref="input"
              autoCapitalize="none"
              placeholder="Change name ..."
              placeholderTextColor="grey"
              onChangeText={this.updateName}
              value={name}
              maxLength={100}
            />
            <View style={styles.subtitleWrap}>
              <Text style={styles.subtitleInpu}>Change name</Text>
            </View>
          </View>
          <View>
            <TextInput
              style={styles.input}
              ref="input"
              autoCapitalize="none"
              placeholder="Change login ..."
              placeholderTextColor="grey"
              onChangeText={this.updateLogin}
              value={login}
              maxLength={100}
            />
            <View style={styles.subtitleWrap}>
              <Text style={styles.subtitleInpu}>Change login</Text>
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={this.onSaveProfile}>
            <View style={styles.buttonContainerSave}>
              <Text style={styles.buttonLabelSave}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.userLogout}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonLabel}>logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.feedbackReport}>
            <View style={styles.buttonFeedback}>
              <Text >Send Feedback/Report Bug</Text>
            </View>
          </TouchableOpacity>
        </View>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
            title={"Send feedback"}
            message={"Report a bug, send feedback, or just say hi!"}
            hintInput ={"FEEDBACK"}
            submitInput={ (inputText) => {this.sendInput(inputText)} }
            closeDialog={ () => {this.showDialog(false)}}>
        </DialogInput>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 40,
    height: 50,
    width: 200,
    borderRadius: 25,
    backgroundColor: '#00e3cf',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700'
  },
  buttonContainerSave: {
    height: 50,
    width: 200,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00e3cf',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabelSave: {
    color: '#00e3cf',
    fontSize: 20,
    fontWeight: '700'
  },
  inputWrap: {
    marginVertical: 20
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    color: 'black',
    width: 200,
    marginVertical: 15,
    padding: 7,
    paddingTop: 15,
    fontSize: 17
  },
  subtitleInpu: {
    color: 'grey'
  },
  subtitleWrap: {
    position: 'absolute',
    marginVertical: -7,
    bottom: 0,
  },
  buttonFeedback: {
    marginVertical: 5,
  }
})

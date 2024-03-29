import React, { PureComponent } from 'react'
import { StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native'
import Avatar from '../../components/avatar'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker'
import { SIZE_SCREEN } from '../../../helpers/constants'
import ChatService from '../../../services/chat-service'
import FirebaseService from '../../../services/firebase-service'
import EventService from '../../../services/event-service'
import CreateBtn from '../../components/createBtn'
import { BTN_TYPE } from '../../../helpers/constants'
import Indicator from '../../components/indicator'
import { showAlert } from '../../../helpers/alert'
import { popToTop } from '../../../routing/init'
import Modal from 'react-native-modal';
import ColorModal from './elements/colorSelect'
import AddressModal from './elements/addressSelect'
import DateModal from './elements/dateSelect'
import TimeModal from './elements/timeSelect'

export default class CreateEvent extends PureComponent {

  state = {
    keyword: '',
    isPickImage: null,
    isLoader: false,
    showUsers: false,
    color: "#1897F8",
    gradientColors: ['#FF4363', '#F6B5A1'],
    location: "TBD",
    startDate: "TBD",
    startTime: "TBD"
  }

  createEvent = () => {
    const users = this.props.navigation.getParam('users')
    let str = this.state.keyword.trim()
    if (str.length < 3) {
      return showAlert('Enter more than 4 characters')
    }
    this.setState({ isLoader: true })
    const occupants_ids = users.map(elem => {
      return elem.id
    })
    ChatService.createPrivateEvent(occupants_ids, str, this.state.isPickImage)
      .then((newEvent) => {
        EventService.createPrivateEventInstance(newEvent.id, this.state.location, this.state.startDate, this.state.startTime)
        FirebaseService.setGradientColor(newEvent.id, this.state.gradientColors)
        newEvent['gradientColor'] = this.state.gradientColors
        this.setState({ isLoader: false })
        this.props.navigation.push('Events')
      })
  }

  onPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      this.setState({ isPickImage: image })
    })
  }

  toggleShowUsers = () => {
    const {showUsers} = this.state
    {!showUsers ? this.setState({showUsers: true}) : this.setState({showUsers: false})}
  }

  _renderUser = ( {item} ) => {
    const showUsers = this.state.showUsers
    return (
      <View>
      {showUsers ?
        (<TouchableOpacity>
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
        </TouchableOpacity>)
         : null
       }
      </View>
    )
  }

  updateSearch = keyword => this.setState({ keyword })

  setColorState = async (color) => {
    await this.setState({color: color})
  }

  setGradientColorState = async (colors) => {
    await this.setState({ gradientColors: colors})
  }

  setLocationState = async (location) => {
    await this.setState({location: location})
  }

  setDateState = async (startDate) => {
    await this.setState({startDate: startDate})
  }

  setTimeState = async (startTime) => {
    await this.setState({startTime: startTime})
  }

  render() {
    const { isPickImage, isLoader } = this.state
    const users = this.props.navigation.getParam('users')
    return (
      <View style={styles.container}>
        {isLoader &&
          <Indicator color={'blue'} size={40} />
        }
        <ColorModal colorHandler={this.setGradientColorState.bind(this)}>
        </ColorModal>
        <View style={styles.header}>
          <View style={styles.description}>
            <TextInput
              style={styles.searchInput}
              autoCapitalize="none"
              placeholder=""
              returnKeyType="search"
              onChangeText={this.updateSearch}
              placeholderTextColor="grey"
              value={this.state.search}
              maxLength={255}
            />
            <Text style={styles.descriptionText}>Change Event Name</Text>
          </View>
        </View>
          <AddressModal locationHandler={this.setLocationState.bind(this)}>
          </AddressModal>
          <DateModal dateHandler={this.setDateState.bind(this)}>
          </DateModal>
          <TimeModal timeHandler={this.setTimeState.bind(this)}>
          </TimeModal>
        <CreateBtn goToScreen={this.createEvent} type={BTN_TYPE.CREATE_GROUP} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  listUsers: {
    marginVertical: 10,
    flex: 1
  },
  header: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
    borderWidth: 1.5,
    borderColor: 'black'
  },
  renderContainer: {
    width: SIZE_SCREEN.width - 60,
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    marginLeft: 40,
  },
  searchInput: {
    fontSize: 14,
    color: 'black',
    borderBottomWidth: 0.5,
    borderColor: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "700"
  },
  description: {
    width: SIZE_SCREEN.width - 110,
  },
  descriptionText: {
    paddingVertical: 5,
    color: '#323232',
    fontSize: 14,
    alignSelf: 'center'
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
})

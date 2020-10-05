import React, {Component} from 'react';
import {StyleSheet, Button, Text, TextInput, View, TouchableOpacity,FlatList} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'
import DateTimePickerModal from "react-native-modal-datetime-picker";


export default class TimeSelect extends Component {
  constructor(props) {
  super(props)

  this.state = {
      isModalVisible: false,
      time: null,
      displayLabel: 'Time'
    };
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  timeToString = (time) => {
    var timeStr = time.toString().split(' ')[4]
    var timeArray = timeStr.split(':')
    var suffix = 'AM'

    if (timeArray[0] > 12){
      timeArray[0] = timeArray[0] - 12
      suffix = 'PM'
    }

    return (timeArray[0] + ':' + timeArray[1] + ' ' + suffix)
  }

  onDonePress = (time) => {
    var timeStr = this.timeToString(time)
    this.setState({displayLabel: timeStr})
    this.props.timeHandler(time)
    this.toggleModal()
  }

  _renderSuggestion = ( {item} ) => {
    return (
      <View>
        <TouchableOpacity style={styles.suggestionContainer} onPress = {() => {
          this.selectSuggestion(item)
          }}>
          <Text style={styles.suggestion}>{item}</Text>
        </TouchableOpacity>
      </View>
    )
  }

    _keyExtractor = (item, index) => index.toString()

  render() {
    return (
      <View style={styles.modal}>
        <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
          <View style={styles.renderAvatar}>
            <Icon name="access-time" size={35} color={"black"} style={{ marginRight: 15 }} />
          </View>
          <View>
            <Text style={styles.nameTitle}>{this.state.displayLabel}</Text>
          </View>
        </TouchableOpacity>
        <View>
          <DateTimePickerModal
            isVisible={this.state.isModalVisible}
            mode="time"
            onConfirm={this.onDonePress}
            onCancel={this.toggleModal}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameTitle: {
    fontSize: 17
  },
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renderHeaderContainer: {
    width: SIZE_SCREEN.width - 30,
    flexDirection: 'row',
    borderColor: 'grey',
    alignItems: 'center',
  },
  modal: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: SIZE_SCREEN.height/3,
  },
  color:{
    alignSelf: 'center',
    width: 50,
    height: 50,
    paddingBottom: 50,
    borderRadius: 25,
  },
  contentTitle: {
  fontSize: 20,
  marginVertical: 20,
  },
  colorContainer:{
    padding: 10,
  },
  searchInput: {
    color: 'black',
    borderBottomWidth: 0.5,
    borderColor: 'black',
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 10
  },
  description: {
    width: SIZE_SCREEN.width - 110,
  },
  suggestion:{
    fontSize: 14
  },
  suggestionContainer:{
    paddingVertical: 10
  }
})

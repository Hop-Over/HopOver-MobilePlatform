import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'

export default class ModalTester extends Component {
  constructor(props) {
  super(props)
  const dialog = props.dialog

  this.state = {
      isModalVisible: false,
      color: this.props.dialog.color
    };
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  setChatColor = (color) => {
    FirebaseService.setChatColor(this.props.dialog.id, color)
    this.setState({color: color})
    this.props.dialog.color = color
  }

  onComplete = () => {
    this.props.navigation.navigate('Chat', {dialog: this.props.dialog})
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
          <View style={styles.renderAvatar}>
            <Icon name="lens" size={35} color={this.state.color} style={{ marginRight: 15 }} />
          </View>
          <View>
            <Text style={styles.nameTitle}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <View style={styles.colorContainer}>
              <TouchableOpacity onPress={() => {
                this.setChatColor("#1897F8")
                this.toggleModal()
                this.onComplete()
                }}>
              <View style={[styles.color,{backgroundColor: '#1897F8'}]}>
              </View>
              </TouchableOpacity>
            </View>

            <View style={styles.colorContainer}>
              <TouchableOpacity onPress={() => {
                this.setChatColor("#FF0000")
                this.toggleModal()
                this.onComplete()
              }}>
              <View style={[styles.color,{backgroundColor: '#FF0000'}]}>
              </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={this.toggleModal}>
              <Text style={styles.contentTitle}> Cancel </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    paddingVertical: 7
  },
  modal: {
    flex: 1,
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
  marginBottom: 12,
  },
  colorContainer:{
    padding: 10,
  }
})

import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient';
import FirebaseService from '../../../../services/firebase-service'

export default class ModalTester extends Component {
  constructor(props) {
  super(props)
  const dialog = props.dialog

  this.state = {
      isModalVisible: false,
    };
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  getChatColor = async () => {
    console.log(this.props.dialog)
    var response = await FirebaseService.getChatColor(this.props.dialog)
    console.log(response)
  }

  setChatColor = (color) => {
    FirebaseService.setChatColor(this.props.dialog, color)
  }

  render() {
    this.getChatColor()
    return (
      <View style={styles.modal}>
        <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
          <View style={styles.renderAvatar}>
            <Icon name="lens" size={35} color='#1897F8' style={{ marginRight: 15 }} />
          </View>
          <View>
            <Text style={styles.nameTitle}>Chat Color</Text>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <View style={styles.colorContainer}>
              <TouchableOpacity onPress={() => {
                this.setChatColor("blue")
                this.toggleModal()
                }}>
              <LinearGradient colors={['#7BC8FE', '#1986D4']} style={styles.color}>
              </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.colorContainer}>
              <TouchableOpacity onPress={() => {
                this.setChatColor("red")
                this.toggleModal()}}>
              <LinearGradient colors={['#F55167', '#D12422']} style={styles.color}>
              </LinearGradient>
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

import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'

export default class Participants extends Component {
  constructor(props) {
  super(props)

  this.state = {
      isModalVisible: true,
    };
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    return (
      <View style={styles.modal}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <TouchableOpacity onPress={this.toggleModal}>
              <Text style={styles.contentTitle}> Done </Text>
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

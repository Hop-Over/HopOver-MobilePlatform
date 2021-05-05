import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'
import LinearGradient from 'react-native-linear-gradient';

export default class ModalTester extends Component {
  constructor(props) {
  super(props)
  const dialog = props.dialog

  this.state = {
      isModalVisible: false,
      color: this.props.dialog.color,
      gradientColor: this.props.dialog.gradientColor
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

  setGradientColor = (colors) => {
    FirebaseService.setGradientColor(this.props.dialog.id, colors)
    this.setState({ gradientColor: colors})
    this.props.dialog.gradientColor = colors
  }

  onComplete = () => {
    this.props.navigation.navigate('Chat', {dialog: this.props.dialog})
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
          <View style={styles.renderAvatar}>
            <LinearGradient colors={[this.state.gradientColor[0], this.state.gradientColor[1]]} useAngle={true} style={styles.smallIconContainer}>
              </LinearGradient>
          </View>
          <View>
            <Text style={styles.nameTitle}>{this.props.title}</Text>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <Text style={styles.title}> Colors </Text>
              <View style={styles.row}>
                  <TouchableOpacity style={[{padding: 5}]} onPress={() => {
                    this.setGradientColor(['#FF4363', '#F6B5A1'])
                    this.toggleModal()
                    this.onComplete()
                  }}>
                  <LinearGradient colors={['#FF4363', '#F6B5A1']} useAngle={true} style={styles.largeIconContainer}>
                  </LinearGradient>
                  </TouchableOpacity>

              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                    this.setGradientColor(['#8DD0FF', '#71EC9A'])
                    this.toggleModal()
                    this.onComplete()
                  }}>
                    <LinearGradient colors={['#8DD0FF', '#71EC9A']} useAngle={true} style={styles.largeIconContainer}>
                    </LinearGradient>
                  </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setGradientColor(['#FFCE6B', '#F89D80'])
                this.toggleModal()
                this.onComplete()
              }}>
                <LinearGradient colors={['#FFCE6B', '#F89D80']} useAngle={true} style={styles.largeIconContainer}>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setGradientColor(['#F58DE7', '#69D1EC'])
                this.toggleModal()
                this.onComplete()
              }}>
                <LinearGradient colors={['#F58DE7', '#69D1EC']} useAngle={true} style={styles.largeIconContainer}>
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
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center'
  },
  color:{
    alignSelf: 'center',
    width: 50,
    height: 50,
    paddingBottom: 50,
    borderRadius: 25,
  },
  smallIconContainer: {
    marginRight: 15,
    alignSelf: 'center',
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  largeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
    paddingVertical: 10
  },
  row:{
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  title: {
    color: 'grey',
    fontSize: 24,
    paddingVertical: 10
  },
})

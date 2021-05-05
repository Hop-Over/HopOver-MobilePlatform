import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'
import LinearGradient from 'react-native-linear-gradient';

export default class ColorSelect extends Component {
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
    this.setState({ gradientColor: colors })
    this.props.dialog.gradientColor = colors
  }

  onComplete = () => {
    this.props.navigation.navigate('Events', {dialog: this.props.dialog})
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableOpacity onPress={this.toggleModal}>
          <View style={styles.header}>
            <LinearGradient colors={[this.state.gradientColor[0], this.state.gradientColor[1]]} useAngle={true} style={styles.iconPicker}>
            </LinearGradient>
            <View style={styles.icon}>
              <Icon name="create" size={27} color='black' />
            </View>
          </View>
        </TouchableOpacity>

        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <Text style={styles.title}> Colors </Text>
            <View style={styles.row}>
              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
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
  iconPicker: {
    width: 130,
    height: 130,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    bottom: -5,
    left: -5,
    padding: 6,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  renderHeaderContainer: {
    width: SIZE_SCREEN.width - 30,
    flexDirection: 'row',
    borderColor: 'grey',
    alignItems: 'center',
    paddingVertical: 7
  },
  modal: {
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
  },
  largeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  row: {
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

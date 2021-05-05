import React, {Component} from 'react';
import {StyleSheet, Button, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import LinearGradient from 'react-native-linear-gradient';

export default class ColorModal extends Component {
  constructor(props) {
  super(props)

  this.state = {
      isModalVisible: false,
      colors: ['#FF4363', '#F6B5A1']
    };
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
          <View style={styles.renderAvatar}>
            <LinearGradient colors={[this.state.colors[0], this.state.colors[1]]} useAngle={true} style={styles.smallIconContainer}>
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.nameTitle}>Chat Color</Text>
          </View>
        </TouchableOpacity>


        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.content}>
            <Text style={styles.title}> Colors </Text>
            <View style={styles.row}>
              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setState({ colors: ['#FF4363', '#F6B5A1'] })
                this.props.colorHandler(['#FF4363', '#F6B5A1'])
                this.toggleModal()
              }}>
                <LinearGradient colors={['#FF4363', '#F6B5A1']} useAngle={true} style={styles.largeIconContainer}>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setState({ colors: ['#8DD0FF', '#71EC9A'] })
                this.props.colorHandler(['#8DD0FF', '#71EC9A'])
                this.toggleModal()
              }}>
                <LinearGradient colors={['#8DD0FF', '#71EC9A']} useAngle={true} style={styles.largeIconContainer}>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setState({ colors: ['#FFCE6B', '#F89D80'] })
                this.props.colorHandler(['#FFCE6B', '#F89D80'])
                this.toggleModal()
              }}>
                <LinearGradient colors={['#FFCE6B', '#F89D80']} useAngle={true} style={styles.largeIconContainer}>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={[{ padding: 5 }]} onPress={() => {
                this.setState({ colors: ['#F58DE7', '#69D1EC'] })
                this.props.colorHandler(['#F58DE7', '#69D1EC'])
                this.toggleModal()
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
    fontSize: 17,
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
    paddingVertical: 10
  },
  colorContainer:{
    padding: 10,
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
})

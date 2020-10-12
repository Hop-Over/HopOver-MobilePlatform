import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Avatar from '../../../components/avatar'
import DialogTitles from './dialogTitles'
import DialogLastDate from './dialogLastDate'
import DialogUnreadCounter from './dialogUnreadCounter'
import UsersService from '../../../../services/users-service'
import EventService from '../../../../services/event-service'
import { DIALOG_TYPE } from '../../../../helpers/constants'
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Dialog extends Component {

  getOccupants = async () => {
    const { dialog } = this.props
    const { navigate } = this.props.navigation
    await UsersService.getOccupants(dialog.occupants_ids)
    navigate('Event', { dialog })
  }

  getUsersAvatar = (ids) => {
    return UsersService.getUsersAvatar(ids)
  }

  render() {
    const { dialog } = this.props
    let dialogPhoto = ''
    if (dialog.type === DIALOG_TYPE.PRIVATE) {
      dialogPhoto = this.getUsersAvatar(dialog.occupants_ids)
    } else {
      dialogPhoto = dialog.photo
    }

    return (
      <TouchableOpacity onPress={this.getOccupants}>
      <View style={styles.totalContainer}>
      <View style={[styles.container, {backgroundColor: dialog.color}]}>
          <View style={styles.border} >
            <DialogTitles
              name={dialog.name}
              description={dialog.event_description}
            />
            <View style={styles.infoContainer}>
              <View style={styles.infoElement}>
                <Icon name="access-time" size={30} color={"#FFFFFF"} />
                <Text style={styles.infoText}> {dialog.startDate} at {dialog.startTime}</Text>
              </View>
              <View style={styles.infoElement}>
                <Icon name="location-on" size={30} color={"#FFFFFF"} />
                <Text style={styles.infoText}> {dialog.location} </Text>
              </View>
              <View style={styles.infoElement}>
                <Icon name="people" size={30} color={"#FFFFFF"} />
                <Text style={styles.infoText}> {dialog.going} going | {dialog.occupants_ids.length} invited </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      </TouchableOpacity >
    )
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -30,
  },
  totalContainer:{
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderRadius: 20,
    width: SIZE_SCREEN.width - 30,
  },
  border: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  infoContainer: {
    height: 120,
  },
  infoElement:{
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: SIZE_SCREEN.width - 120
  },
  infoText:{
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700"
  }
})

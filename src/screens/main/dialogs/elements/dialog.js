import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Avatar from '../../../components/avatar'
import DialogTitles from './dialogTitles'
import DialogLastDate from './dialogLastDate'
import DialogUnreadCounter from './dialogUnreadCounter'
import UsersService from '../../../../services/users-service'
import { DIALOG_TYPE } from '../../../../helpers/constants'
import LinearGradient from 'react-native-linear-gradient';

export default class Dialog extends Component {
  getOccupants = async () => {
    const { dialog } = this.props
    console.log(dialog)
    const { navigate } = this.props.navigation
    await UsersService.getOccupants(dialog.occupants_ids)
    navigate('Chat', { dialog })
  }

  getUsersAvatar = (ids) => {
    return UsersService.getUsersAvatar(ids)
  }

  render() {
    const {dialog} = this.props
    let dialogPhoto = ''
    if (dialog.type === DIALOG_TYPE.PRIVATE) {
      dialogPhoto = this.getUsersAvatar(dialog.occupants_ids)
    } else {
      dialogPhoto = dialog.photo
    }

    return (
      <TouchableOpacity onPress={this.getOccupants}>
      <View style={styles.totalContainer}>
      {dialog.unread_messages_count > 0 ?
        < LinearGradient colors={[dialog.gradientColor[0], dialog.gradientColor[1]]} useAngle={true} style={styles.container}>
            <View style={styles.border} >
              <DialogTitles
                name={dialog.name}
                message={dialog.last_message}
                unreadMessagesCount={dialog.unread_messages_count}
              />
              <View style={styles.infoContainer}>
                <DialogLastDate
                  lastDate={dialog.last_message_date_sent}
                  updatedDate={dialog.updated_date}
                  isUnread={dialog.unread_messages_count > 0}
                />
              </View>
            </View>
          </LinearGradient>
          :
        <View style={[styles.container,{backgroundColor: "#FFFFFF"}]}>
            <View style={styles.border} >
              <DialogTitles
                name={dialog.name}
                message={dialog.last_message}
              />
              <View style={styles.infoContainer}>
                <DialogLastDate
                  lastDate={dialog.last_message_date_sent}
                  updatedDate={dialog.updated_date}
                />
                <DialogUnreadCounter
                  unreadMessagesCount={dialog.unread_messages_count}
                />
              </View>
            </View>
          </View>
      }
        <View style={styles.avatarContainer}>
          <View>
            <Avatar
              photo={dialogPhoto}
              name={dialog.name}
              iconSize="large"
            />
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
    paddingVertical: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderRadius: 20,
    maxWidth: 360
  },
  border: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    maxWidth: 75,
    height: 75,
    justifyContent: 'flex-start',
    paddingVertical: 20,
    marginRight: 35,
  }
})

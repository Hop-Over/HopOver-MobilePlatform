import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BTN_TYPE } from '../../helpers/constants'
import { SIZE_SCREEN } from '../../helpers/constants'
import LinearGradient from 'react-native-linear-gradient';


export default function CreateBtn({ goToScreen, type }) {
  let renderIcon
  switch (type) {
    case BTN_TYPE.DIALOG: {
      renderIcon = <Icon name="add" size={30} color='white' />
      break
    }
    case BTN_TYPE.CONTACTS: {
      renderIcon = <Icon name="add" size={40} color="white" />
      break
    }
    case BTN_TYPE.CREATE_GROUP: {
      renderIcon = <Icon name="check" size={40} color="white" />
      break
    }
  }

  return (
    <TouchableOpacity onPress={goToScreen}>
      <LinearGradient colors={['#84CDFF', '#1986D4']} style={styles.createDialog}>
      {renderIcon}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  createDialog: {
    position: 'absolute',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    bottom: 80,
    right: SIZE_SCREEN.width/2 - 55/2,
    backgroundColor: "#48A5E7"
  }
})

import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
//// TODO: finish this

export default function CreateBtn({ onPress, type }) {
  let renderIcon
  switch (type) {
    case "Friend": {
      renderIcon = <Icon name="chat" size={30} color='white' />
      break
    }
    case "Request": {
      renderIcon = <Icon name="check" size={40} color="white" />
      break
    }
    case "Pending": {
      renderIcon = <Icon name="check" size={40} color="white" />
      break
    }
  }

  return (
    <TouchableOpacity style={styles.createDialog} onPress={goToScreen}>
      {renderIcon}
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
    bottom: 100,
    right: 30,
    backgroundColor: '#303030'
  }
})

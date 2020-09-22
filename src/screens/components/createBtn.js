import React from 'react'
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BTN_TYPE } from '../../helpers/constants'
import { SIZE_SCREEN } from '../../helpers/constants'


export default function CreateBtn({ goToScreen, type, isFirst }) {
  let renderIcon
  switch (type) {
    case BTN_TYPE.DIALOG: {
      renderIcon = <Icon name="add" size={40} color='white' />
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
    <View style={styles.createDialog}>
      <TouchableOpacity onPress={goToScreen}>
        <View style={styles.gradient}>
        {renderIcon}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  createDialog: {
    position: 'absolute',
    marginLeft: SIZE_SCREEN.width/2 - 50/2,
    bottom: SIZE_SCREEN.height/7
  },
  gradient:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#75C6FF"
  }
})

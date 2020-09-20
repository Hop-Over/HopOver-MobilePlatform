import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BTN_TYPE } from '../../helpers/constants'
import { SIZE_SCREEN } from '../../helpers/constants'


export default function CreateBtn({ goToScreen, type }) {
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
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    bottom: -20
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

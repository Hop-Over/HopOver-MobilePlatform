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
    position: 'absolute',
    bottom: 120,
    marginLeft: SIZE_SCREEN.width/2 - 55/2,
    shadowColor: "#267DC929",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity:0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#2E86FB"
  }
})

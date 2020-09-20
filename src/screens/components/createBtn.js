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
        <View style={!isFirst ? styles.gradient: styles.firstDialog}>
        {!isFirst ? renderIcon : <Text style={{ fontSize: 14, color: 'white', fontWeight: '800' }}> Create a Dialog</Text>}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  firstDialog: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#75C6FF",
  },
  createDialog: {
    paddingTop: 20,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#75C6FF"
  }
})

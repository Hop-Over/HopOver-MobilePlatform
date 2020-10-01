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
      renderIcon = <Icon name="arrow-forward" size={24} color="white" />
      break
    }
    case BTN_TYPE.CREATE_GROUP: {
      renderIcon = <Icon name="exit-to-app" size={24} color="white" />
      break
    }
  }

  return (
    <View style={type === BTN_TYPE.CONTACTS ? styles.nextContainer : styles.createDialog}>
    {type === BTN_TYPE.CONTACTS ?
    (<TouchableOpacity onPress={goToScreen}>
      <View style={styles.nextButton}>
        {renderIcon}
        <Text style={styles.nextText}> Next </Text>
      </View>
    </TouchableOpacity>):
    <View>
    {type === BTN_TYPE.CREATE_GROUP?
    (<TouchableOpacity onPress={goToScreen}>
      <View style={styles.nextButton}>
        {renderIcon}
        <Text style={styles.nextText}> Create Group </Text>
      </View>
    </TouchableOpacity>):
    (<TouchableOpacity onPress={goToScreen}>
      <View style={styles.gradient}>
      {renderIcon}
      </View>
    </TouchableOpacity>)}
    </View>
  }
    </View>
  )
}

const styles = StyleSheet.create({
  createDialog: {
    position: 'absolute',
    marginLeft: SIZE_SCREEN.width/2 - 50/2,
    bottom: SIZE_SCREEN.height/7
  },
  nextContainer: {
    position: 'absolute',
    marginLeft: SIZE_SCREEN.width/2 - SIZE_SCREEN.width/3/2,
    bottom: SIZE_SCREEN.height/7
  },
  gradient:{
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#75C6FF"
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#1897F8",
    width: SIZE_SCREEN.width/2,
    height: 55,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextText: {
    fontSize: 18,
    color: 'white',
  }
})

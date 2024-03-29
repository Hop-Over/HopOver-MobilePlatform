import React from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { getCbToken } from '../../helpers/file'

export default function ProfileIcon({ photo, name, iconSize }) {
  let styles
  switch (iconSize) {
    case 'extra-large': {
      styles = extraLargeIcon
      break;
    }
    case 'large': {
      styles = largeIcon
      break;
    }
    case 'medium': {
      styles = mediumIcon
      break;
    }
    case 'small': {
      styles = smallIcon
      break;
    }
  }

  function randomizeColor() {
    const colors = [
      '#7BC8FE',
      '#1986D4',
      '#F55167',
      '#D12422',
      '#323232',
      ]

    return colors[name.length % colors.length]
  }

  function getIconLabel() {
    const words = name.split(' ')

    return (
      words.length > 1
        ? label = `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`
        : name.slice(0, 2)
    )
  }

  fastImageWrap = () => {
    let source = getCbToken(photo)
    source.priority = FastImage.priority.high
    return (
      <FastImage
        style={styles.photo}
        source={source}
        key={photo}
      />
    )
  }

  return (
    photo ?
      fastImageWrap()
      : (
        <View style={[styles.photo, { backgroundColor: randomizeColor() }]}>
          <Text style={styles.randomIcon}> {getIconLabel().toUpperCase().trim()}</Text >
        </View >
      )
  )
}

const extraLargeIcon = StyleSheet.create({
  photo: {
    borderRadius: 50,
    height: 100,
    width: 100,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomIcon: {
    fontSize: 48,
    fontWeight: '600',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

const largeIcon = StyleSheet.create({
  photo: {
    borderRadius: 30,
    height:58,
    width: 58,
    marginVertical: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#FFFFFF"
  },
  randomIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

const mediumIcon = StyleSheet.create({
  photo: {
    borderRadius: 20,
    height: 40,
    width: 40,
    marginVertical: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  }
})

const smallIcon = StyleSheet.create({
  photo: {
    borderRadius: 15,
    height: 30,
    width: 30,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  randomIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    paddingRight: Platform.OS === 'android' ? 5 : 1
  }
})

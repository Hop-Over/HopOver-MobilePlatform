import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DialogTitles({ name, message, isUnread }) {
  return (
    <View style={styles.container}>
      <Text style={isUnread ? [styles.name, {color: "#FFFFFF"}]: styles.name} numberOfLines={1}>{name}</Text>
      <Text style={isUnread ? [styles.message, {color: "#FFFFFF"}]: styles.message} numberOfLines={1}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 10,
    maxWidth: 250,
  },
  name: {
    height: 30,
    lineHeight: 30,
    fontSize: 20,
    fontWeight: '700'
  },
  message: {
    height: 15,
    lineHeight: 15,
    fontSize: 13,
    fontWeight: '300'
  }
})

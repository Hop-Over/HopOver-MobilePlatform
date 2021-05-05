import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DialogTitles({ name, message, isUnread, unreadMessagesCount }) {
  return (
    <View style={styles.container}>
      {unreadMessagesCount == 1 ?
      <Text style={styles.label}> {unreadMessagesCount} unread message</Text> : null}
      {unreadMessagesCount > 1 ?
      <Text style={styles.label}> {unreadMessagesCount} unread messages</Text> : null}
      <Text style={unreadMessagesCount > 0 ? [styles.name, {color: "#FFFFFF"}]: styles.name} numberOfLines={1}>{name}</Text>
      <Text style={unreadMessagesCount > 0 ? [styles.message, {color: "#FFFFFF"}]: styles.message} numberOfLines={1}>{message}</Text>
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
    paddingLeft: 5,
    height: 30,
    lineHeight: 30,
    fontSize: 20,
    fontWeight: '700'
  },
  message: {
    paddingLeft: 5,
    height: 15,
    lineHeight: 15,
    fontSize: 13,
    fontWeight: '400'
  },
  label: {
    paddingLeft: 5,
    color: "#FFFFFF",
    height: 15,
    lineHeight: 15,
    fontSize: 13,
    fontWeight: '300'
  }
})

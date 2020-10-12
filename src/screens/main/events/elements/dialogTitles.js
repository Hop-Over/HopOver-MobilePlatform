import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DialogTitles({ name, description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.description} numberOfLines={1}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 10
  },
  name: {
    marginTop: 10,
    marginLeft: 10,
    height: 30,
    lineHeight: 30,
    fontSize: 27,
    fontWeight: '600',
    color: "#FFFFFF"
  },
  description: {
    marginLeft: 10,
    height: 30,
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '300',
    color: "#FFFFFF"

  },
})

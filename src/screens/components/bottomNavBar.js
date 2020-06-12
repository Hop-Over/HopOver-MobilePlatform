import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';

export default class BottomNavBar extends Component {

  goToContactsScreen = () => {
    const { navigation } = this.props
    navigation.push('Contacts')
  }

  goToChatScreen = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Dialogs' })],
    });
    navigation.dispatch(resetAction);
  }

  goToPeopleScreen = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'People' })],
    });
    navigation.dispatch(resetAction);
  }

  render(){
    navigation = this.props.navigation
    return (
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => this.goToChatScreen()}>
          <View style={styles.footerElement}>
            <Text style={navigation.state.routeName === "Dialogs" ? styles.footerTextCurrent : styles.footerText}> Chats </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.goToPeopleScreen()}>
          <View style={styles.footerElement}>
            <Text style={navigation.state.routeName === "People" ? styles.footerTextCurrent : styles.footerText}> People </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Pressed')}>
          <View style={styles.footerElement}>
            <Text style={navigation.state.routeName === "Events" ? styles.footerTextCurrent : styles.footerText}> Events </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1',
  },
  footerElement:{
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 25,
  },
  footerText:{
    color: 'black',
    fontSize: 19,
  },
  footerTextCurrent:{
    color: 'black',
    fontSize: 19,
    fontWeight: "bold"
  }
})

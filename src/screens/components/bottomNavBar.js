import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
import { SIZE_SCREEN } from '../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'

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
            <Icon name="chat-bubble" size={35} color={navigation.state.routeName === "Dialogs" ? "black": "grey"}/>
            <Text style={navigation.state.routeName === "Dialogs" ? styles.footerTextCurrent : styles.footerText}> Chats </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.goToPeopleScreen()}>
          <View style={styles.footerElement}>
            <Icon name="group" size={35} color={navigation.state.routeName === "People" || navigation.state.routeName === "Search" || navigation.state.routeName === "Requests" ? "black" : "grey"}/>
            <Text style={navigation.state.routeName === "People" || navigation.state.routeName === "Search" || navigation.state.routeName === "Requests" ? styles.footerTextCurrent : styles.footerText}> People </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Pressed')}>
          <View style={styles.footerElement}>
            <Icon name="event-note" size={35} color={navigation.state.routeName === "Events" ? "black": "grey"}/>
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
    justifyContent: 'space-between',
    bottom: SIZE_SCREEN.height/40,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D1',
  },
  footerElement:{
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: 'center',
  },
  footerText:{
    color: 'grey',
    fontSize: 16,
  },
  footerTextCurrent:{
    color: 'black',
    fontSize: 16,
  }
})

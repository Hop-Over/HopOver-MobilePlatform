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

  goToEventsScreen = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Events' })],
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
      <View style={styles.container}>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => this.goToPeopleScreen()}>
            <View style={navigation.state.routeName === "People" || navigation.state.routeName === "Search" ? styles.footerChosen: styles.footerElement}>
              <Icon name="group" size={35} color={navigation.state.routeName === "People" || navigation.state.routeName === "Search" || navigation.state.routeName === "Requests" ? "#48A5E7" : "black"}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.goToChatScreen()}>
            <View style={navigation.state.routeName === "Dialogs" ? styles.footerChosen: styles.footerElement}>
              <Icon name="chat-bubble" size={35} color={navigation.state.routeName === "Dialogs" ? "#48A5E7": "black"}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.goToEventsScreen()}>
            <View style={navigation.state.routeName === "Events" ? styles.footerChosen: styles.footerElement}>
              <Icon name="event-note" size={35} color={navigation.state.routeName === "Events" ? "#48A5E7": "black"}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    width: SIZE_SCREEN.width * 0.8,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopColor: '#D1D1D1',
    borderLeftColor: '#D1D1D1',
    borderRightColor: '#D1D1D1',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 0,
    height: SIZE_SCREEN.height/10,
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
  },
  footerChosen: {
    height: SIZE_SCREEN.height/10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: ((SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.8))/3),
    paddingRight: ((SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.8))/3),
    paddingTop: 10,
    justifyContent: "center",
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopWidth: 5,
    borderTopColor: "#48A5E7",
    borderLeftColor: "lightgrey",
    borderRightColor: "lightgrey"
  }
})

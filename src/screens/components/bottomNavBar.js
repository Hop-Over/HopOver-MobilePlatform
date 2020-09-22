import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';
import { SIZE_SCREEN } from '../../helpers/constants'
import Icon from 'react-native-vector-icons/Feather'

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
            <View style={navigation.state.routeName === "People" || navigation.state.routeName === "Search" || navigation.state.routeName === "Requests" ? styles.footerChosenLeft: styles.footerElement}>
              <Icon name="users" size={35} color={navigation.state.routeName === "People" || navigation.state.routeName === "Search" || navigation.state.routeName === "Requests" ? "#2E86FB" : "black"}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.goToChatScreen()}>
            <View style={navigation.state.routeName === "Dialogs" ? styles.footerChosenCenter: styles.footerElement}>
              <Icon name="message-square" size={35} color={navigation.state.routeName === "Dialogs" ? "#2E86FB": "black"}/>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.goToEventsScreen()}>
            <View style={navigation.state.routeName === "Events" ? styles.footerChosenRight: styles.footerElement}>
              <Icon name="flag" size={35} color={navigation.state.routeName === "Events" ? "#2E86FB": "black"}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SIZE_SCREEN.height/10,
    marginLeft: (SIZE_SCREEN.width/2) - (SIZE_SCREEN.width * 0.9/2),
    backgroundColor: 'red'
  },
  footer: {
    flexDirection: 'row',
    width: SIZE_SCREEN.width * 0.9,
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: SIZE_SCREEN.height/10,
  },
  footerElement:{
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 0,
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
  footerChosenLeft: {
    height: SIZE_SCREEN.height/8,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 20,
    paddingLeft: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) - 10,
    paddingRight: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) - 10,
    paddingTop: 0,
    justifyContent: "center",
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#00000014',
    borderRightColor: '#00000014',
    borderTopWidth: 8,
    borderTopColor: "#2E86FB",
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerChosenRight: {
    height: SIZE_SCREEN.height/8,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 20,
    paddingLeft: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) -10,
    paddingRight: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) - 10,
    paddingTop: 0,
    justifyContent: "center",
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#00000014',
    borderRightColor: '#00000014',
    borderTopWidth: 8,
    borderTopColor: "#2E86FB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerChosenCenter: {
    height: SIZE_SCREEN.height/8,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingLeft: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) - 10,
    paddingRight: SIZE_SCREEN.width - (SIZE_SCREEN.width * 0.9) - 10,
    paddingTop: 0,
    justifyContent: "center",
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#00000014',
    borderRightColor: '#00000014',
    borderTopWidth: 8,
    borderTopColor: "#2E86FB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})

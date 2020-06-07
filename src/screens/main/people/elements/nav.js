import React, { Component } from 'react'
import { StyleSheet, View, FlatList, Text, StatusBar, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation';

export default class Nav extends Component {

  goToFriendsScreen = () => {
    const { navigation } = this.props
    navigation.push('People')
  }

  goToFriends= () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'People' })],
    });
    navigation.dispatch(resetAction);
  }

  goToRequests = () => {
    const navigation = this.props.navigation

    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Requests' })],
    });
    navigation.dispatch(resetAction);
  }

  render(){
    return (
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={() => this.goToFriends()}>
          <View style={styles.topMenuElement}>
            <Text style={styles.topMenuText}> Friends </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.space}>
        </View>
        <TouchableOpacity onPress={() => this.goToRequests()}>
          <View style={styles.topMenuElement}>
            <Text style={styles.topMenuText}> Requests </Text>
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
  space: {
    paddingRight: 50,
  },

  topMenu: {
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
  },
  topMenuElement:{
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#D1D1D1',
  },
  topMenuText:{
    color: 'black',
    fontSize: 14,
  }
})

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
    navigation = this.props.navigation
    return (
      <View style={styles.topMenu}>
        <View style={{flexDirection: 'row', backgroundColor: "#E9E9E9", borderRadius: 70}}>
          <TouchableOpacity onPress={() => this.goToFriends()}>
            <View style={navigation.state.routeName === 'People' ? styles.selected: styles.tab}>
              <Text style={navigation.state.routeName === 'People' ? styles.selectedText: styles.topMenuText}> Friends </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.goToRequests()}>
            <View style={navigation.state.routeName === 'Requests' ? styles.selected: styles.tab}>
              <Text style={navigation.state.routeName === 'Requests' ? styles.selectedText: styles.topMenuText}> Requests </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topMenu: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  tab:{
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 70
  },
  selected: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#2E86FB',
    borderRadius: 70,
    fontWeight: '700',
    color: 'white'
  },
  topMenuText:{
    fontSize: 14,
    paddingLeft: 30,
    paddingRight: 30,
  },
  selectedText:{
    fontSize: 14,
    paddingLeft: 30,
    paddingRight: 30,
    fontWeight: '700',
    color: 'white'

  }
})

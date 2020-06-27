import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator, createAppContainer, StackActions } from 'react-navigation'
import Auth from '../screens/auth'
import Dialogs from '../screens/main/dialogs'
import People from '../screens/main/people/index'
import Search from '../screens/main/people/search'
import Requests from '../screens/main/people/requests'
import AppWrap from '../screens/appWrap'
import Settings from '../screens/main/settings/index'
import Chat from '../screens/main/chat/index'
import Contacts from '../screens/main/contacts/index'
import CreateDialog from '../screens/main/contacts/createDialog'
import GroupDetails from '../screens/main/chat/groupDetails'
import PrivateDetails from '../screens/main/chat/privateDetails'
import ContactDetails from '../screens/main/chat/contactDetails'
import SharedMedia from '../screens/main/chat/sharedMedia'
import searchDialog from '../screens/main/chat/searchDialog'

export default createAppContainer(createSwitchNavigator(
  {
    AppWrap,
    Auth: createStackNavigator({
      Auth: {
        screen: Auth,
        navigationOptions: {
          headerShown: false
        }
      }
    }),
    Main: createStackNavigator({
      Dialogs: {
        screen: Dialogs
      },
      Settings: {
        screen: Settings,
        navigationOptions: {
          headerTitle: 'Settings',
        }
      },
      Chat: {
        screen: Chat,
      },
      People: {
        screen: People,
      },
      Search: {
        screen: Search,
      },
      Requests: {
        screen: Requests,
      },
      Contacts: {
        screen: Contacts,
        navigationOptions: {
          headerTitle: 'Contacts'
        }
      },
      SharedMedia: {
        screen: SharedMedia,
        navigationOptions: {
          headerTitle: 'Media'
        }
      },

      CreateDialog: {
        screen: CreateDialog,
        navigationOptions: {
          headerTitle: 'New Group'
        }
      },
      GroupDetails: {
        screen: GroupDetails,
        navigationOptions: {
          headerTitle: 'Group details'
        }
      },
      PrivateDetails:{
        screen: PrivateDetails,
        navigationOptions: {
          headerTitle: 'Private details'
        }
      },
      ContactDetails: {
        screen: ContactDetails,
        navigationOptions: {
          headerTitle: 'Contact details'
        }
      },
      searchDialog: {
        screen: searchDialog,
      }
    }),
  },
  {
    initialRouteName: 'AppWrap',
  }
))

export const popToTop = StackActions.popToTop()

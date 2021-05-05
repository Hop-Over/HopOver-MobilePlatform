import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createSwitchNavigator, createAppContainer, StackActions } from 'react-navigation'
import Auth from '../screens/auth'
import Dialogs from '../screens/main/dialogs'
import People from '../screens/main/people/index'
import Events from '../screens/main/events/index'
import Search from '../screens/main/people/search'
import Requests from '../screens/main/people/requests'
import AppWrap from '../screens/appWrap'
import Settings from '../screens/main/settings/index'
import Chat from '../screens/main/chat/index'
import Event from '../screens/main/event/index'
import Contacts from '../screens/main/contacts/index'
import EventContacts from '../screens/main/eventcontact/index'
import CreateDialog from '../screens/main/contacts/createDialog'
import CreateEvent from '../screens/main/eventcontact/createEvent'
import GroupDetails from '../screens/main/chat/groupDetails'
import EventDetails from '../screens/main/event/eventDetails'
import PrivateDetails from '../screens/main/chat/privateDetails'
import ContactDetails from '../screens/main/chat/contactDetails'
import SharedMedia from '../screens/main/chat/sharedMedia'
import ChatMap from '../screens/main/chat/chatMap'
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
      Event: {
        screen: Event,
      },
      People: {
        screen: People,
      },
      Events: {
        screen: Events,
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
      EventContacts: {
        screen: EventContacts,
        navigationOptions: {
          headerTitle: 'Event Contacts'
        }
      },
      CreateEvent: {
        screen: CreateEvent,
        navigationOptions: {
          headerTitle: 'New Group'
        }
      },
      SharedMedia: {
        screen: SharedMedia,
        navigationOptions: {
          headerTitle: 'Media'
        }
      },
      ChatMap: {
        screen: ChatMap,
        navigationOptions: {
          headerTitle: 'Map'
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
      EventDetails: {
        screen: EventDetails,
        navigationOptions: {
          headerTitle: 'Event details'
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

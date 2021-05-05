import React, { PureComponent } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import Avatar from '../../components/avatar'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { SIZE_SCREEN } from '../../../helpers/constants'


export default class User extends PureComponent {
  state = {
    isSelectedUser: false
  }

  toggleUserSelect() {
    const { selectUsers, user } = this.props
    selectUsers(user)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedUsers !== this.props.selectedUsers) {
      this.setState({ isSelectedUser: this.props.selectedUsers })
    }
  }

  render() {
    const { user, selectedUsers, dialogType } = this.props
    const { isSelectedUser } = this.state
    return (
      <View style={styles.listUsers}>
        <TouchableOpacity style={styles.card} onPress={() => this.toggleUserSelect()}>
          <View style={styles.renderContainer}>
            <View style={styles.renderAvatar}>
              <Avatar
                photo={user.avatar}
                name={user.full_name}
                iconSize="medium"
              />
              <Text style={styles.nameTitle}>{user.full_name}</Text>
            </View>
            <>
              {dialogType ? isSelectedUser || selectedUsers ? (
                <Icon name="radio-button-checked" size={24} color="#1897F8" />
              ) : (
                  <Icon name="radio-button-unchecked" size={24} color="black" />
                ) : <Icon name="arrow-forward" size={24} color="green" />
              }
            </>

          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  renderAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5
  },
  listUsers: {
    flex: 1,
    alignItems: 'center'
  },
  renderContainer: {
    width: SIZE_SCREEN.width - 25,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderWidth:2,
    borderColor: '#00000014',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 15,
    marginBottom: 10,
    marginTop: 5
  },
  nameTitle: {
    width: SIZE_SCREEN.width/1.5,
    fontSize: 17
  },

});

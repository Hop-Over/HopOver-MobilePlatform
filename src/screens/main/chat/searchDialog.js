import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import ChatService from "../../../services/chat-service";
import UsersService from "../../../services/users-service";
import Message from "./message";
import ImagePicker from "react-native-image-crop-picker";
import { DIALOG_TYPE } from "../../../helpers/constants";

export class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndicator: true,
      messageText: "",
    };
    this.currentSelection = 1
  }

  needToGetMoreMessage = null;

  static navigationOptions = ({ navigation }) => {
    let dialog = navigation.state.params.dialog;
    let searchResponse = navigation.state.params.searchResponse;
    let dialogPhoto = "";
    
    if (dialog.type === DIALOG_TYPE.PRIVATE) {
      dialogPhoto = UsersService.getUsersAvatar(dialog.occupants_ids);
    } else {
      dialogPhoto = dialog.photo;
    }
    var searchAmount = searchResponse.messages.length
    {console.log(searchResponse)}
    {console.log('SEARCH SHITTTT')}
    {console.log(searchAmount)}
    {console.log(currentSelection)}

    return {
      headerTitle: (
        <Text numberOfLines={3} style={{ fontSize: 22, color: "black" }}>
          {/* {navigation.state.params.dialog.name + " - Search Result"} */}
          {"Search Result"}
        </Text>
      ),
      headerRight: (
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={this.nextSearch}>
              <Icon name="keyboard-arrow-up" size={35} color='#48A6E3'/>
          </TouchableOpacity>
          <Text>{this.currentSelection+ " / " + searchAmount}</Text>
          <TouchableOpacity onPress={this.prevSearch}>
              <Icon name="keyboard-arrow-down" size={35} color='#48A6E3'/>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    const { dialog, searchResponse } = this.props.navigation.state.params;
    ChatService.getSearchMessages(dialog)
      .catch((e) => alert(`Error.\n\n${JSON.stringify(e)}`))
      .then((amountMessages) => {
        amountMessages === 100
          ? (this.needToGetMoreMessage = true)
          : (this.needToGetMoreMessage = false);
        this.setState({ activeIndicator: false });
      });
  }

  componentWillUnmount() {
    ChatService.resetSelectedDialogs();
  }

  nextSearch(){
    this.currentSelection++;
  }
  prevSearch(){
    this.currentSelection--;
  }

  getMoreMessages = () => {
    const { dialog } = this.props.navigation.state.params;
    if (this.needToGetMoreMessage) {
      this.setState({ activeIndicator: true });
      ChatService.getMoreMessages(dialog).then((amountMessages) => {
        amountMessages === 5
          ? (this.needToGetMoreMessage = true)
          : (this.needToGetMoreMessage = false);
        this.setState({ activeIndicator: false });
      });
    }
  };


  _keyExtractor = (item, index) => index.toString();

  _renderMessageItem(message) {
    const { user } = this.props.currentUser;
    const isOtherSender = message.sender_id !== user.id ? true : false;
    return (
      <Message otherSender={isOtherSender} message={message} key={message.id} />
    );
  }

  render() {
    const { history } = this.props;
    const { messageText, activeIndicator } = this.state;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
      >
        <StatusBar
          barStyle="dark-content"
          translucent={false}
          backgroundColor="white"
        />
        {activeIndicator && (
          <View style={styles.indicator}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        <FlatList
          inverted
          data={history}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this._renderMessageItem(item)}
          onEndReachedThreshold={5}
          onEndReached={this.getMoreMessages}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    paddingVertical: 12,
    paddingHorizontal: 35,
  },
  activityIndicator: {
    position: "absolute",
    alignSelf: "center",
    paddingTop: 25,
  },
  button: {
    width: 40,
    height: 50,
    marginBottom: Platform.OS === "ios" ? 15 : 0,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    marginBottom: Platform.OS === "ios" ? 15 : 0,
    flexDirection: "row",
  },
});

const mapStateToProps = (state, props) => ({
  history: state.messages[props.navigation.state.params.dialog.id],
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(Search);

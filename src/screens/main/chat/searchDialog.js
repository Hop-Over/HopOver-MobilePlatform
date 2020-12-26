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
	Button,
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import ChatService from "../../../services/chat-service";
import UsersService from "../../../services/users-service";
import Message from "./message";
import Avatar from '../../components/avatar'
import { DIALOG_TYPE } from "../../../helpers/constants";
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import LinearGradient from 'react-native-linear-gradient';

export class Search extends PureComponent {
	constructor(props) {
	super(props);
	this.state = {
		activeIndicator: true,
		messageText: "",
	};
	this.currentSelection = 0
	}

	needToGetMoreMessage = null;

	static navigationOptions = ({ navigation }) => {
	let dialog = navigation.state.params.dialog;
	let searchResponse = navigation.state.params.searchResponse;
	let dialogPhoto = '';
	if (dialog.type === DIALOG_TYPE.PRIVATE) {
		dialogPhoto = UsersService.getUsersAvatar(dialog.occupants_ids);
	} else {
		dialogPhoto = dialog.photo;
	}

	return {
		headerTitle: (
		<Text numberOfLines={3} style={{ fontSize: 22, color: "black" }}>
			{"Search Result"}
		</Text>
		),
		headerRight: (
		<View>
			<Avatar
			photo={dialogPhoto}
			name={navigation.state.params.dialog.name}
			iconSize="small"
			/>
		</View>
		),
	};
	};

	componentDidMount() {
	const { dialog, searchResponse } = this.props.navigation.state.params;
	ChatService.getSearchMessages(dialog, searchResponse[this.currentSelection])
		.catch((e) => alert(`Error.\n\n${JSON.stringify(e)}`))
		.then((amountMessages) => {
		amountMessages === 10
			? (this.needToGetMoreMessage = true)
			: (this.needToGetMoreMessage = false);
		this.setState({ activeIndicator: false });
		});
	}

	componentWillUnmount() {
        const { dialog } = this.props.navigation.state.params
        ChatService.resetSelectedDialogs();
        ChatService.getMessages(dialog)
	}

	nextSearch(searchAmount){
        const { dialog, searchResponse } = this.props.navigation.state.params
        if((this.currentSelection+1)<searchAmount){
            this.currentSelection++;
        }else{
            alert('No More Search Results Available')
        }
        ChatService.getSearchMessages(dialog, searchResponse[this.currentSelection])
        this.setState({ state: this.state }); //Updates state and page re-renders
	}

    prevSearch(){
        const { dialog, searchResponse } = this.props.navigation.state.params
        if(this.currentSelection > 0){
            this.currentSelection--;
        }else{
            alert('No More Search Results Available')
        }
        ChatService.getSearchMessages(dialog, searchResponse[this.currentSelection])
        this.setState({ state: this.state }); //Updates state and page re-renders
	}

	getMoreMessages = (highLow) => {
	const { dialog } = this.props.navigation.state.params;
	if (this.needToGetMoreMessage) {
		this.setState({ activeIndicator: true });
		ChatService.getMoreSearchMessages(dialog, highLow).then((amountMessages) => {
		amountMessages === 9
			? (this.needToGetMoreMessage = true)
			: (this.needToGetMoreMessage = false);
		this.setState({ activeIndicator: false });
	});
	}
	};

	loadMoreOld = () => {
		this.needToGetMoreMessage = true
		this.getMoreMessages(0)
		// this.setState({ state: this.state }); //Updates state and page re-renders
	}
	loadMoreNew = () => {
		this.needToGetMoreMessage = true
		this.getMoreMessages(1)
		this.scrollUp()
		// this.setState({ state: this.state }); //Updates state and page re-renders
	}

	scrollUp = () => {
		this.ListView_Ref.scrollToEnd({ animated: false });
	}

	goToDialog = () => {
		const { navigation } = this.props
		const dialog = navigation.getParam('dialog', false)
		navigation.push('searchDialog', { dialog, searchResponse })
	}


	_renderFlatListSearchHeader = () => {
	return(
		<View style={{flexDirection:"row"}}>
			<TouchableOpacity onPress={()=>{this.nextSearch()}}>
				<Icon name="keyboard-arrow-up" size={35} color='#48A6E3'/>
			</TouchableOpacity>
			{/* <Text>{this.currentSelection+ " / " + searchAmount}</Text> */}
			<TouchableOpacity onPress={()=>{this.prevSearch()}}>
				<Icon name="keyboard-arrow-down" size={35} color='#48A6E3'/>
			</TouchableOpacity>
		</View>
		)
	}


	_keyExtractor = (item, index) => index.toString();

	_renderMessageItem(message) {
    const { user } = this.props.currentUser;
    const { dialog } = this.props.navigation.state.params
	const isOtherSender = message.sender_id !== user.id ? true : false;
    
    return (
		<Message otherSender={isOtherSender} gradientColor={dialog.gradientColor} color={dialog.color} message={message} key={message.id} />
	);
	}

	render() {
	const { searchResponse } = this.props.navigation.state.params;
	const searchAmount = searchResponse.length
	const { history } = this.props;
	const { activeIndicator } = this.state;
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
		<View style={{flexDirection:"row", backgroundColor: "#eaeaea"}}>
			<TouchableOpacity onPress={()=>{this.nextSearch(searchAmount)}}>
				<Icon name="keyboard-arrow-up" size={35} color='#48A6E3'/>
			</TouchableOpacity>
			<Text>{this.currentSelection+1+ " / " + searchAmount}</Text>
			<TouchableOpacity onPress={()=>{this.prevSearch()}}>
				<Icon name="keyboard-arrow-down" size={35} color='#48A6E3'/>
			</TouchableOpacity>

		</View>
		<View style={styles.bottomButton}>
			<Button
				title="Load More Older..."
				onPress={this.loadMoreOld}
			/>
		</View>
		<FlatList
			ref={(ref) => {
				this.ListView_Ref = ref;
			}}
			data={history}
			keyExtractor={this._keyExtractor}
			renderItem={({ item }) => this._renderMessageItem(item)}
			inverted
			//  onEndReachedThreshold={5}
			//  onEndReached={this.loadMoreNew}
		/>
		<View style={styles.bottomButton}>
			<Button
				title="Load More Recent..."
				onPress={this.loadMoreNew}
			/>
		</View>
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
	bottomButton: {
	flexDirection: "row",
	alignItems: "flex-end",
	justifyContent: "center",
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

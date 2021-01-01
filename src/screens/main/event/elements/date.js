import React, { Component } from 'react';
import { StyleSheet, Button, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EventService from '../../../../services/event-service'


export default class DateSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalVisible: false,
            displayLabel: this.props.dialog.startDate,
        };
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    onDonePress = (date) => {
        var dateArray = date.toString().split(" ")
        var dateStr = dateArray.slice(0, 3).join(' ') + ', ' + dateArray[3]
        this.setState({ displayLabel: dateStr })
        EventService.updateDate(this.props.dialog.id, dateStr)
        this.props.dialog.startDate = dateStr 
        this.props.navigation.navigate('Events', { dialog: this.props.dialog })
        this.toggleModal()
    }

    _renderSuggestion = ({ item }) => {
        return (
            <View>
                <TouchableOpacity style={styles.suggestionContainer} onPress={() => {
                    this.selectSuggestion(item)
                }}>
                    <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString()

    render() {
        return (
            <View style={styles.modal}>
                <TouchableOpacity style={styles.renderHeaderContainer} onPress={this.toggleModal}>
                    <View style={styles.renderAvatar}>
                        <Icon name="event" size={35} color={"black"} style={{ marginRight: 15 }} />
                    </View>
                    <View>
                        <Text style={styles.nameTitle}>{this.state.displayLabel}</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <DateTimePickerModal
                        isVisible={this.state.isModalVisible}
                        mode="date"
                        onConfirm={this.onDonePress}
                        onCancel={this.toggleModal}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nameTitle: {
        fontSize: 17
    },
    renderAvatar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    renderHeaderContainer: {
        width: SIZE_SCREEN.width - 30,
        flexDirection: 'row',
        borderColor: 'grey',
        alignItems: 'center',
    },
    modal: {
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: SIZE_SCREEN.height / 3,
    },
    color: {
        alignSelf: 'center',
        width: 50,
        height: 50,
        paddingBottom: 50,
        borderRadius: 25,
    },
    contentTitle: {
        fontSize: 20,
        marginVertical: 20,
    },
    colorContainer: {
        padding: 10,
    },
    searchInput: {
        color: 'black',
        borderBottomWidth: 0.5,
        borderColor: 'black',
        fontSize: 18,
        fontWeight: "500",
        paddingVertical: 10
    },
    description: {
        width: SIZE_SCREEN.width - 110,
    },
    suggestion: {
        fontSize: 14
    },
    suggestionContainer: {
        paddingVertical: 10
    }
})

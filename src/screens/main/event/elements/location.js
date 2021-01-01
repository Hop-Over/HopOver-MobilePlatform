import React, { Component } from 'react';
import { StyleSheet, Button, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { SIZE_SCREEN } from '../../../../helpers/constants'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FirebaseService from '../../../../services/firebase-service'
import config from '../../../../../config'
import EventService from '../../../../services/event-service'

export default class AddressModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalVisible: false,
            keyword: '',
            placesData: [],
            displayLabel: this.props.dialog.location.split(',')[0]
        };
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    onDonePress = () => {
        this.setState({ displayLabel: this.state.keyword.split(',')[0] })
        EventService.updateLocation(this.props.dialog.id, this.state.keyword)
        this.props.dialog.location = this.state.keyword
        this.props.navigation.navigate('Events', { dialog: this.props.dialog })
        this.toggleModal()
    }

    selectSuggestion = (suggestion) => {
        this.setState({ keyword: suggestion })
    }

    updateSearch = async (keyword) => {
        this.setState({ keyword })
        const placesUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json?key=" + config.placesKey.key +
            "&input=" + keyword
        const result = await fetch(placesUrl)
        const placesJson = await result.json()
        var placesArray = []
        placesJson.predictions.forEach(pred => {
            placesArray.push(pred.description)
        })
        this.setState({ placesData: placesArray })
    }

    _renderSuggestion = ({ item }) => {
        return (
            <View style={styles.suggestionContainer}>
                <TouchableOpacity onPress={() => {
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
                        <Icon name="location-on" size={35} color={"black"} style={{ marginRight: 15 }} />
                    </View>
                    <View>
                        <Text style={styles.nameTitle}>{this.state.displayLabel}</Text>
                    </View>
                </TouchableOpacity>

                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.content}>
                        <View style={styles.description}>
                            <TextInput
                                style={styles.searchInput}
                                autoCapitalize="none"
                                placeholder=""
                                returnKeyType="search"
                                onChangeText={this.updateSearch}
                                placeholderTextColor="grey"
                                value={this.state.keyword}
                                maxLength={255}
                            />
                        </View>
                        <FlatList
                            data={this.state.placesData}
                            renderItem={this._renderSuggestion}
                            keyExtractor={this._keyExtractor}
                        />
                        <View>
                            {this.state.keyword.length > 0 ?
                                <TouchableOpacity onPress={this.onDonePress}>
                                    <Text style={styles.contentTitle}> Done </Text>
                                </TouchableOpacity> :
                                <TouchableOpacity onPress={this.toggleModal}>
                                    <Text style={styles.contentTitle}> Cancel </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </Modal>
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
        width: SIZE_SCREEN.width - 30,
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
})

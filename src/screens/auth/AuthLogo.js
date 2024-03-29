import React from 'react'
import { StyleSheet, View, Image } from 'react-native'

export default AuthLogo = () => {
	return (
		<View style={styles.container}>
			<Image style={styles.imageSize} source={require('../../../assets/image/full_logo_red_transparent_large.png')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	imageSize: {
		width: 200,
		height: 150
	},
})

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react';

const LoadingScreen = ({ loading }) => {
    return (

        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb8c00" />
        </View>

    )

}

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default LoadingScreen
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SuccessImg from '../../assets/SuccessImg.svg'
const SuccessPopup = ({ isVisible, setIsVisible }) => {


    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isVisible}
            // onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <SuccessImg />
                        <Text style={styles.popupText}>Spade Created Successfully!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 30,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    popup: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
        shadowRadius: 2, // For iOS shadow
        width: '80%',
        height: 300,
    },
    popupText: {
        color: '#2e2c43',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 30,
        marginHorizontal: 20,
        fontFamily: "Poppins-ExtraBold",
        textAlign: "center"
    },
});

export default SuccessPopup;

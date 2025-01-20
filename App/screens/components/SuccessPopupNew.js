import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import SuccessImg from '../../assets/SuccessPopup.svg'


const SuccessPopupNew = ({ isVisible, setIsVisible }) => {


    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            
            
        }}>
            <Modal
                transparent={true}
                animationType="fade"
                visible={isVisible}
            // onRequestClose={() => setIsVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                }}>
                    <View style={{
                        
                        alignItems: 'center',
                        justifyContent: 'center',
                        elevation: 5, // For Android shadow
                        shadowColor: '#000', // For iOS shadow
                        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
                        shadowOpacity: 0.8, // For iOS shadow
                        shadowRadius: 2, // For iOS shadow
                        width: '100%',
                    }}>
                        <View
                          style={{
                            backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width:"80%",
                        height: 400,

                          }}
                        >
                        <SuccessImg width={200} />


                        </View>
                        
                    </View>
                </View>
            </Modal>
        </View>
    );
};



export default SuccessPopupNew;

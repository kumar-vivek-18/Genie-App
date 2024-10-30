import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native'
import React from 'react';
import UserImg from '../../assets/User.svg';
import { useNavigation } from '@react-navigation/native';

const SignUpModal = ({ signUpModal, setSignUpModal }) => {
    const navigation = useNavigation();
    return (
        <Modal
            visible={signUpModal}
            transparent={true}
            animationType="fade"
            style={{ flex: 1 }}
        >
            <Pressable
                // onPress={() => { setSignUpModal(false) }}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
            >
                <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: 20, paddingVertical: 40 }}>
                    <UserImg />
                    <Text style={{ fontFamily: 'Poppins-Black', fontSize: 16, color: '#2e2c43', marginTop: 30 }}>Sign Up Now!</Text>
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#2e2c43', marginBottom: 30 }}>Enjoy seamless shopping experience</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 40 }}>
                        <TouchableOpacity onPress={() => { setSignUpModal(false) }}>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#fb8c00' }}>Not now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('mobileNumber'); }}>
                            <Text style={{ fontFamily: 'Poppins-Black', fontSize: 16, color: '#fb8c00' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

export default SignUpModal;
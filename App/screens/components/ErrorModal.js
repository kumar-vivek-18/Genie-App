import { View, Text, Modal } from 'react-native'
import React from 'react';
import SuccessImg from '../../assets/SuccessImg.svg';

const ErrorModal = ({ errorModal, setErrorModal }) => {
    console.log(errorModal);
    return (
        <Modal
            visible={errorModal}
            transparent={true}
            animationType="slide"
            onRequestClose={setErrorModal(!errorModal)}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                    <SuccessImg />
                    <Text style={{ fontFamily: "Poppins-SemiBold", color: "#2e2c43", fontSize: 16 }}>Document Size should be less than 2Mb</Text>
                </View>
            </View>
        </Modal>
    )
}

export default ErrorModal
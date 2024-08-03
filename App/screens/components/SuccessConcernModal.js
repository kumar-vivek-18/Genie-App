import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity } from 'react-native';
// import ModalImg from "../assets/Cancel.svg"
import { useNavigation } from '@react-navigation/native';
import Success from "../../assets/SuccessImg.svg"

const SuccessConcernModal = ({ modalVisible, setModalVisible, type }) => {

    console.log(modalVisible, type);
    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            // onRequestClose={() => {
            //   Alert.alert('Modal has been closed.');
            //   setModalVisible(!modalVisible);
            // }}
            className=" flex justify-center items-center  rounded-lg ">
            <View className="flex-1  justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl" style={{ padding: 50 }}>
                    <Success />

                    <View >
                        {
                            type === "help" &&
                            <Text className="text-[14.5px]   text-center text-[#001B33]" style={{ fontFamily: "Poppins-SemiBold" }}>Help request submitted {"\n"}
                                successfully</Text>

                        }
                        {
                            type === "report" &&
                            <Text className="text-[14.5px]   text-center text-[#001B33]" style={{ fontFamily: "Poppins-SemiBold" }}>Reported the vendor {"\n"}
                                successfully</Text>
                        }




                    </View>

                </View>
            </View>
        </Modal>


    );
};



export default SuccessConcernModal;
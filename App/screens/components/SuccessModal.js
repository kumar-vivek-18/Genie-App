import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import SuccessImg from "../../assets/success.svg"
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CloseSpadeModal = ({ successModal, setSuccessModal, successMessage }) => {
    const naivgation = useNavigation();
    const spade = useSelector(store => store.user.currentSpade);
    useEffect(() => {
        if (successModal) {
            setTimeout(() => {
                if (spade.requestActive === "completed")
                    naivgation.navigate('rating-feedback');
                setSuccessModal(false);
            }, 2000);
        }
    }, []);



    return (

        <Modal
            animationType="fade-in"
            transparent={true}
            visible={successModal}
            className=" flex justify-center items-center h-full ">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] py-[60px] gap-[24px] shadow-gray-600 shadow-2xl">
                    <SuccessImg classname="w-[117px] h-[75px]" />
                    <View className="">
                        <Text className="text-[15px] text-center" style={{ fontFamily: "Poppins-Regular" }}>{successMessage} </Text>
                        <Text className="text-[15px] text-center" style={{ fontFamily: "Poppins-Regular" }}>Successfully </Text>

                    </View>


                </View>
            </View>
        </Modal>


    );
};

const styles = StyleSheet.create({

    // modalView: {
    //   margin: 20,
    //   backgroundColor: 'white',
    //   borderRadius: 20,
    //   padding: 35,
    //   alignItems: 'center',
    //   shadowColor: '#000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.25,
    //   shadowRadius: 4,
    //   elevation: 5,
    // },

});

export default CloseSpadeModal;
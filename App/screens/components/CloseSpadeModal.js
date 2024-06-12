import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import ModalImg from "../../assets/Cancel.svg"
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSpades } from '../../redux/reducers/userDataSlice';

const CloseSpadeModal = ({ confirmModal, setConfirmModal, setSuccessModal }) => {
    const spade = useSelector(store => store.user.currentSpade);
    const spades = useSelector(store => store.user.spades);
    const dispatch = useDispatch();

    const closeSpade = async () => {
        try {
            const request = await axios.patch(`http://173.212.193.109:5000/user/closespade`, {
                id: spade._id
            });
            if (request.status === 200) {
                console.log('request closed');
                spades = spades.filter(curr => curr._id !== request._id);
                dispatch(setSpades(spades));
                setConfirmModal(false);
                setSuccessModal(true);
            }
            else {
                setConfirmModal(false);
                console.error('Error occuring while closing user request');
            }
        } catch (error) {
            setConfirmModal(false);
            console.error('Error occuring while closing user request');
        }

    }
    return (

        <Modal
            animationType="fade-in"
            transparent={true}
            visible={confirmModal}
            className=" flex justify-center items-center h-full ">
            <View className="flex-1  justify-center items-center ">
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                    <ModalImg classname="w-[117px] h-[75px]" />
                    <View className="">
                        <Text className="text-[15px] text-center" style={{fontFamily:"Poppins-ExtraBold"}}>Are you sure? </Text>
                        <Text className="text-[14px] text-center  pt-[8px]" style={{fontFamily:"Poppins-Regular"}}>We are closing this request, you can check status on history section. </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { setConfirmModal(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{fontFamily:"Poppins-Regular"}}>Close</Text>

                            </Pressable>
                        </View>
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { closeSpade(); }}>
                                <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{fontFamily:"Poppins-SemiBold"}}>Confirm</Text>

                            </Pressable>
                        </View>

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
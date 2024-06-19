import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import ModalImg from "../../assets/Cancel.svg"
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSpades } from '../../redux/reducers/userDataSlice';
import { sendCloseSpadeNotification } from '../../notification/notificationMessages';
import { ActivityIndicator } from 'react-native';

const CloseSpadeModal = ({ confirmModal, setConfirmModal, setSuccessModal }) => {
    const spade = useSelector(store => store.user.currentSpade);
    const spades = useSelector(store => store.user.spades);
    const userDetails = useSelector(store => store.user.userDetails);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const closeSpade = async () => {
        setLoading(true);
        const token = await axios.get('http://173.212.193.109:5000/retailer/unique-token', {
            params: {
                id: currentSpadeRetailers[0]?.retailerId._id,
            }
        });
        console.log("close notification", token)
        try {


            const request = await axios.patch(`http://173.212.193.109:5000/user/close-spade`, {
                id: spade._id
            });
            if (request.status === 200) {
                console.log('request closed');
                const updatedSpades = spades.filter(curr => curr._id !== spade._id);
                dispatch(setSpades(updatedSpades));
                setConfirmModal(false);
                setSuccessModal(true);
                setLoading(false);
                if (token.length > 0) {
                    const notification = {
                        token: token.data,
                        title: userDetails.userName,
                        close: spade._id,
                        image: spade.requestImages ? spade.requestImages[0] : ""
                    }
                    console.log("close notification", token)
                    await sendCloseSpadeNotification(notification);

                }
            }
            else {
                setLoading(false);
                setConfirmModal(false);
                console.error('Error occuring while closing user spade');
            }
        } catch (error) {
            setConfirmModal(false);
            setLoading(false)
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
                        <Text className="text-[15px] text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>Are you sure? </Text>
                        <Text className="text-[14px] text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>We are closing this request, you can check status on history section. </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { setConfirmModal(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{ fontFamily: "Poppins-Regular" }}>Close</Text>

                            </Pressable>
                        </View>
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { closeSpade(); }}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FB8C00" />
                                ) : (
                                    <Text className="text-[14.5px] text-[#FB8C00]  text-center" style={{ fontFamily: "Poppins-SemiBold" }}>Confirm</Text>
                                )}
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
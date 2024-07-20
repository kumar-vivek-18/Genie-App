import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import ModalImg from "../../assets/CloseSpadeIcon.svg"
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSpades } from '../../redux/reducers/userDataSlice';
import { sendCloseSpadeNotification } from '../../notification/notificationMessages';
import { ActivityIndicator } from 'react-native';
import { socket } from '../../utils/scoket.io/socket';
import navigationService from '../../navigation/navigationService';
import { baseUrl } from '../../utils/logics/constants';

const CloseSpadeModal = ({ confirmModal, setConfirmModal, setSuccessModal }) => {
    const spade = useSelector(store => store.user.currentSpade);
    const spades = useSelector(store => store.user.spades);
    const userDetails = useSelector(store => store.user.userDetails);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const accessToken = useSelector(store => store.user.accessToken);

    const closeCompleteSpade = async () => {
        setLoading(true);
        console.log('fello close', currentSpadeRetailers[0]?.retailerId._id);
        const configToken = {
            headers: { // Use "headers" instead of "header"
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                id: currentSpadeRetailers[0]?.retailerId._id,
            }
        };
        try {
            const token = await axios.get(`${baseUrl}/retailer/unique-token`, configToken);
            console.log("close notification", token.data, spade._id, spade.requestAcceptedChat);
            // console.log("token", token.data);
            const formData = new FormData();


            formData.append('sender', JSON.stringify({
                type: "UserRequest",
                refId: spade._id,
            }));
            formData.append('userRequest', spade._id);
            formData.append('message', "Customer close the chat");
            formData.append('bidType', "update");
            formData.append('chat', spade.requestAcceptedChat);
            formData.append('bidPrice', 0);
            formData.append('warranty', 0);
            formData.append('bidImages', []);

            const config = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
            await axios.post(
                `${baseUrl}/chat/send-message`,
                formData, config
            )
                .then(async (res) => {
                    console.log('spade closed mess send successfully', res.status);
                    socket.emit("new message", res.data);
                    const configg = {
                        headers: { // Use "headers" instead of "header"
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    };
                    const request = await axios.patch(`${baseUrl}/user/close-spade/`, {
                        id: spade._id
                    }, configg);
                    console.log('request', request);
                    if (request.status === 200) {
                        // console.log('request closed');
                        const updatedSpades = spades.filter(curr => curr._id !== spade._id);
                        dispatch(setSpades(updatedSpades));
                        setConfirmModal(false);
                        setSuccessModal(true);
                        setLoading(false);
                        // spades = spades.filter(curr => curr._id !== request._id);
                        console.log('Request closed successfully');
                        // dispatch(setSpades(spades));
                        // navigation.navigate('home');


                        if (token.data.length > 0) {
                            const notification = {
                                token: token.data,
                                title: userDetails?.userName,
                                // close: currentSpade._id,
                                image: request?.data?.requestImages[0],
                                body: "Customer close the chat",
                                requestInfo: {
                                    requestId: currentSpadeRetailers[0]?._id,
                                    userId: currentSpadeRetailers[0]?.users[0]._id
                                }
                            }
                            console.log("close notification", token)
                            sendCloseSpadeNotification(notification);

                        }
                        // Send Notification to reatiler 
                    }
                    else {
                        setLoading(false);
                        setConfirmModal(false);
                        console.error('Error occuring while closing user request');
                    }
                })


            //     const request = await axios.patch(`http://173.212.193.109:5000/user/close-spade`, {
            //         id: spade._id
            //     });
            //     if (request.status === 200) {
            //         console.log('request closed');
            //         const updatedSpades = spades.filter(curr => curr._id !== spade._id);
            //         dispatch(setSpades(updatedSpades));
            //         setConfirmModal(false);
            //         setSuccessModal(true);
            //         setLoading(false);
            //         if (token.length > 0) {
            //             const notification = {
            //                 token: token.data,
            //                 title: userDetails.userName,
            //                 close: spade._id,
            //                 image: spade.requestImages ? spade.requestImages[0] : ""
            //             }
            //             console.log("close notification", token)
            //             await sendCloseSpadeNotification(notification);

            //         }
            //     }
            //     else {
            //         setLoading(false);
            //         setConfirmModal(false);
            //         console.error('Error occuring while closing user spade');
            //     }
        } catch (error) {
            setConfirmModal(false);
            setLoading(false)
            console.error('Error occuring while closing user request', error.message);
        }

    }

    const closeActiveSpade = async () => {
        try {
            console.log('hii');


            await Promise.all(currentSpadeRetailers.map(async (retailer) => {
                const formData = new FormData();
                formData.append('sender', JSON.stringify({
                    type: "UserRequest",
                    refId: spade._id,
                }));
                formData.append('userRequest', spade._id);
                formData.append('message', "Customer close the chat");
                formData.append('bidType', "update");
                formData.append('chat', retailer._id);
                formData.append('bidPrice', 0);
                formData.append('warranty', 0);
                formData.append('bidImages', []);
                const config = {
                    headers: { // Use "headers" instead of "header"
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                };
                await axios.post(
                    `${baseUrl}/chat/send-message`,
                    formData,
                    config

                )
                    .then((res) => {
                        console.log('close mess send to retailer with id',)
                        socket.emit('new message', res.data);


                    })
            }));

            await axios.patch(`${baseUrl}/user/close-active-spade/`, {
                id: spade._id,
            }, config)
                .then((res) => {
                    console.log('res', res.data);
                    if (res.status === 200) {
                        const updatedSpades = spades.filter(curr => curr._id !== spade._id);
                        dispatch(setSpades(updatedSpades));
                        setConfirmModal(false);
                        setSuccessModal(true);

                        setTimeout(() => {
                            setSuccessModal(false);
                            navigation.navigate('home');
                        }, 2000);
                    }
                })
        } catch (error) {
            console.error('Error while closing spade');
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
                        <Text className="text-[14px] text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>You are closing this request, you can check the status in the history section. </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { setConfirmModal(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{ fontFamily: "Poppins-Regular" }}>Close</Text>

                            </Pressable>
                        </View>
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { spade.requestAcceptedChat ? closeCompleteSpade() : closeActiveSpade() }}>
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
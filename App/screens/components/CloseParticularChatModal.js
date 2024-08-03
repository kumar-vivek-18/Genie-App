import { View, Text, Modal, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native'
import React, { useState } from 'react';
import ModalImg from "../../assets/CloseSpadeIcon.svg"
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../utils/logics/axiosInstance.js';
import { baseUrl } from '../../utils/logics/constants.js';
import { setCurrentSpadeRetailer, setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { socket } from '../../utils/scoket.io/socket';

const CloseParticularChatModal = ({ closeParticularChatModal, setCloseParticularChatModal }) => {
    // console.log('modal opne');
    const disptach = useDispatch();
    const [loading, setLoading] = useState(false);
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpadeRetaiers = useSelector(store => store.user.currentSpadeRetailers);
    const currentSpade = useSelector(store => store.user.currentSpade);
    const accessToken = useSelector(store => store.user.accessToken);

    const closeChat = async () => {
        setLoading(true);
        try {
            const formData = new FormData();


            formData.append('sender', JSON.stringify({
                type: "UserRequest",
                refId: currentSpade._id,
            }));
            formData.append('userRequest', currentSpade._id);
            formData.append('message', "Customer close the chat");
            formData.append('bidType', "update");
            formData.append('chat', currentSpadeRetailer._id);
            formData.append('bidPrice', 0);
            formData.append('warranty', 0);
            formData.append('bidImages', []);

            const config = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
            await axiosInstance.post(
                `${baseUrl}/chat/send-message`,
                formData, config
            )
                .then(async (response) => {
                    if (response.status !== 201) return;

                    socket.emit("new message", response.data);

                    await axiosInstance.patch(`${baseUrl}/user/close-particular-chat`, {
                        chatId: currentSpadeRetailer._id
                    })
                        .then(res => {
                            console.log('chat closed successfully');
                            if (res.status !== 200) return;

                            const updatedChat = { ...currentSpadeRetailer, requestType: 'closed' };
                            const updatedChatList = currentSpadeRetaiers.filter(chat => chat._id !== currentSpadeRetailer._id);
                            const updatedAllChats = [...updatedChatList, updatedChat];
                            disptach(setCurrentSpadeRetailer(updatedChat));
                            disptach(setCurrentSpadeRetailers(updatedAllChats));


                        })
                })

        }
        catch (error) {
            console.error("Error while closing this chat", error);
        }
        finally {
            setLoading(false);
            setCloseParticularChatModal(false);
        }
    }

    return (
        <Modal
            animationType="fade-in"
            transparent={true}
            visible={closeParticularChatModal}
            className=" flex justify-center items-center h-full ">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="bg-white w-[90%] p-[30px] justify-center items-center mt-[10px] gap-[24px] shadow-gray-600 shadow-2xl">
                    <ModalImg classname="w-[117px] h-[75px]" />
                    <View className="">
                        <Text className="text-[15px] text-center" style={{ fontFamily: "Poppins-ExtraBold" }}>Are you sure? </Text>
                        <Text className="text-[14px] text-center  pt-[8px]" style={{ fontFamily: "Poppins-Regular" }}>You are closing this chat, you will not be able to chat with this vendor. </Text>

                    </View>

                    <View className="w-full flex flex-row  justify-center">
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { setCloseParticularChatModal(false) }} >
                                <Text className="text-[14.5px] text-[#FB8C00] text-center" style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>

                            </Pressable>
                        </View>
                        <View className="flex-1 mt-[5px]">
                            <Pressable onPress={() => { closeChat() }}>
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
    )
}

export default CloseParticularChatModal
import { View, Text, ScrollView, Pressable, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ThreeDots from '../../assets/3dots.svg';
import ArrowLeft from '../../assets/arrow-left.svg';
import Copy from '../../assets/copy.svg';
import Store from '../../assets/RandomImg.svg';
import Contact from '../../assets/Contact.svg';
import Location from '../../assets/Location.svg';
import Tick from '../../assets/Tick.svg';
import Document from '../../assets/Document.svg';
import Send from '../../assets/Send.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import UserMessage from '../components/UserMessage.js';
import RetailerMessage from '../components/RetailerMessage.js';
import UserBidMessage from '../components/UserBidMessage.js';
import RetailerBidMessage from '../components/RetailerBidMessage.js';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/scoket.io/socket.js';
import { setCurrentChatMessages, setCurrentSpadeRetailer, setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { newMessageSend } from '../../notification/notificationMessages';
import { formatDateTime } from '../../utils/logics/Logics';


const SendQueryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { messages, setMessages } = route.params;
    const details = useSelector(store => store.user.currentSpadeRetailer);
    const userDetails = useSelector(store => store.user.userDetails);
    const spade = useSelector(store => store.user.currentSpade);

    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);

    const dispatch = useDispatch();

    const [query, setQuery] = useState("");
    // console.log('spade details', details);
    // const currrentChatMessages = useSelector(store => store.user.currentChatMessages);
    // console.log('messages', currrentChatMessages);
    // const dispatch = useDispatch();

    const sendQuery = async () => {

        const token = await axios.get('http://173.212.193.109:5000/retailer/unique-token', {
            params: {
                id: details.retailerId._id,
            }
        });

        console.log('token', token.data);

        await axios.post('http://173.212.193.109:5000/chat/send-message', {
            sender: {
                type: 'UserRequest',
                refId: details.requestId,
            },
            message: query,
            bidType: "false",
            bidPrice: 0,
            bidImages: [],
            chat: details._id,
            warranty: 0
        })
            .then(async (res) => {
                // console.log("query", res.data);
                const data = formatDateTime(res.data.createdAt);
                res.data.createdAt = data.formattedTime;

                //updating latest message
                setMessages([...messages, res.data]);

                //updating chat latest message
                const updateChat = { ...currentSpadeRetailer, unreadMessages: 0, latestMessage: { _id: res.data._id, message: res.data.message } };
                const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
                dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
                dispatch(setCurrentSpadeRetailer(updateChat));

                socket.emit("new message", res.data);
                navigation.goBack();
                const notification = {
                    token: [token.data],
                    title: userDetails?.userName,
                    body: query,
                    requestInfo: details,
                }
                // console.log("query page", spade);
                await newMessageSend(notification);
            })
            .catch(err => {
                console.log("error while sending query", err);
            });

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View contentContainerStyle={{ flexGrow: 1 }} className="relative bg-[#ffe7c8] h-full">


                <View className="z-50 w-full flex flex-row px-[29px] absolute justify-between  top-[57px]">
                    <Pressable onPress={() => { navigation.goBack(); }}>
                        <ArrowLeft />
                    </Pressable>

                    <Pressable onPress={() => { }}>
                        <ThreeDots />
                    </Pressable>

                </View>

                <View className="bg-[#ffe7c8] px-[64px] py-[30px] relative">
                    <View className=" flex-row gap-[18px]">
                        <View>
                            <Store />
                        </View>

                        <View>
                            <Text className="text-[14px] text-[#2e2c43] capitalize">{details.users[0].populatedUser.storeName}</Text>
                            <Text className="text-[12px] text-[#c4c4c4]">Active 3 hr ago</Text>
                        </View>

                    </View>

                    <View className="flex-row gap-[6px] items-center mt-[16px]">
                        <View className="flex-row gap-[7px] items-center">
                            <Contact />
                            <Text>Contact Details</Text>
                        </View>
                        <View className="flex-row gap-[7px] items-center">
                            <Location />
                            <Text>Store Loction</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-[5px] mt-[15px]">
                        <Tick />
                        <Text>Home delivery available</Text>
                    </View>
                </View>





                <View className="px-[30px]">
                    <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[16px] mt-[30px] mb-[15px]">Send a query</Text>

                    <View className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
                        <TextInput
                            multiline
                            numberOfLines={6}
                            onChangeText={(val) => {
                                setQuery(val);
                            }}
                            value={query}
                            placeholder="Type here..."
                            placeholderTextColor="#dbcdbb"
                            className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "
                            style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top' }}
                        />
                    </View>
                </View>
            </View>



            <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                <TouchableOpacity onPress={() => { sendQuery() }}>
                    <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                        <Text className="text-white font-bold text-center text-[16px]">Send Query</Text>
                    </View>
                </TouchableOpacity>
            </View>




        </SafeAreaView>
    )
}

export default SendQueryScreen;
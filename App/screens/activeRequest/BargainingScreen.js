import { View, Text, ScrollView, Pressable, Image, TextInput, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ThreeDots from '../../assets/3dots.svg';
import ArrowLeft from '../../assets/arrow-left.svg';
import Copy from '../../assets/copy.svg';
import Store from '../../assets/RandomImg.svg';
import Contact from '../../assets/Contact.svg';
import LocationImg from '../../assets/Location.svg';
import Tick from '../../assets/Tick.svg';
import Document from '../../assets/Document.svg';
import Send from '../../assets/Send.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import UserMessage from '../components/UserMessage.js';
import RetailerMessage from '../components/RetailerMessage.js';
import UserBidMessage from '../components/UserBidMessage.js';
import RetailerBidMessage from '../components/RetailerBidMessage.js';
import Attachments from '../components/Attachments';
import CameraScreen from '../components/CameraScreen';
import { useDispatch, useSelector } from 'react-redux';
import RequestAcceptModal from '../components/RequestAcceptModal';
import { setCurrentSpade, setCurrentSpadeRetailer, setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import io from 'socket.io-client';
import { socket } from '../../utils/scoket.io/socket.js';
import * as Location from "expo-location";
import { setSpades } from '../../redux/reducers/userDataSlice';
// import { setmessages } from '../../redux/reducers/userDataSlice';
import { setUserDetails } from '../../redux/reducers/userDataSlice';
import { BidAccepted, BidRejected } from '../../notification/notificationMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDateTime } from '../../utils/logics/Logics';
import { emtpyRequestImages } from '../../redux/reducers/userRequestsSlice';

const BargainingScreen = () => {
    const navigation = useNavigation();
    const details = useSelector(store => store.user.currentSpadeRetailer);
    const [messages, setMessages] = useState([]);
    const [attachmentScreen, setAttachmentScreen] = useState(false);
    const [cameraScreen, setCameraScreen] = useState(false);
    // const [acceptModal, setAcceptModal] = useState(false);
    const [modalVisible, setModalVisibile] = useState(false);
    // console.log('spade details', details);
    const spade = useSelector(store => store.user.currentSpade);
    const spades = useSelector(store => store.user.spades);
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const [socketConnected, setSocketConnected] = useState(false);
    const [currentLocation, setCurrentLocation] = useState();
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);

    const dispatch = useDispatch();
    const userDetails = useSelector(store => store.user.userDetails || []);

    const route = useRoute();

    const fetchUserDetails = async () => {
        const userData = JSON.parse(await AsyncStorage.getItem('userDetails'));
        dispatch(setUserDetails(userData));
    }

    const setMessagesMarkAsRead = async () => {
        console.log('marks as read0', currentSpadeRetailer._id);
        try {
            if (currentSpadeRetailer.unreadCount > 0) {
                const response = await axios.patch('http://173.212.193.109:5000/chat/mark-as-read', {
                    id: currentSpadeRetailer._id
                });
                const updateChat = { ...currentSpadeRetailer, unreadMessages: 0 };
                const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
                dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
                dispatch(setCurrentSpadeRetailer(updateChat));
                console.log('markAsRead', response.data.unreadCount);
            }
        } catch (error) {
            console.error("error while marking as read", error.message);
        }
    }

    useEffect(() => {
        fetchUserDetails();
        if (route?.params?.data) {
            const data = JSON.parse(route?.params?.data?.requestInfo);
            // console.log('data', data);
            console.log('object', route.params);
            console.log('userDetails', data?.customerId);
            console.log('currendspade', data?.requestId);
            dispatch(setCurrentSpadeRetailer(data));
            dispatch(setCurrentSpade(data?.requestId));
            dispatch(setUserDetails(data?.customerId));

            fetchMessages(data?._id);
            connectSocket(data?.users[1]._id);
        }
    }, []);






    // console.log('curr spade retailer', currentSpadeRetailer.users);

    const connectSocket = async (id) => {
        // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
        // console.log('scoket', socket);
        socket.emit("setup", id);
        socket.on('connected', () => setSocketConnected(true));
        console.log('socekt connect with id', id);
    }

    useEffect(() => {

        if (currentSpadeRetailer?.users) {
            connectSocket(currentSpadeRetailer?.users[1]._id);
            setMessagesMarkAsRead();
            console.log('making unread message 0');
        }
        // console.log('spc', socket);
        // socket.on('typing', () => setIsTyping(true));
        // socket.on("stop typing", () => setIsTyping(false));
        return () => {
            if (socket) {
                // socket.disconnect();
                socket.emit('leave room', currentSpadeRetailer?.users[1]._id);
            }
        }
    }, []);

    // useEffect(() => {
    //     messages.map((mess, index) => {
    //         console.log('mess', index, mess._id, mess.message);
    //     })
    // }, [messages]);


    const fetchMessages = (id) => {


        axios.get('http://173.212.193.109:5000/chat/get-spade-messages', {
            params: {
                id: id
            }
        })
            .then(res => {
                res.data.map(mess => {
                    const data = formatDateTime(mess.createdAt);
                    mess.createdAt = data.formattedTime;
                    // console.log(mess.createdAt);
                })
                // console.log('mess', messages);
                setMessages(res.data);
                // console.log('mess res', res.data);
                socket.emit("join chat", res.data[0]?.chat?._id);

                // console.log("messages", res.data);
            })
            .catch(err => {
                console.error("error", err);
            })
    }

    useEffect(() => {
        if (details?._id) {
            fetchMessages(details._id);
        }

    }, []);


    const acceptBid = async () => {
        try {
            await axios.patch('http://173.212.193.109:5000/chat/accept-bid', {
                messageId: messages[messages.length - 1]._id,
                userRequestId: spade._id
            })
                .then(async (res) => {
                    // console.log('response of bid accept', res);
                    // console.log('res accepted bid', res.status, res.data.message);
                    const data = formatDateTime(res.data.message.createdAt);
                    res.data.message.createdAt = data.formattedTime;

                    // updating messages
                    let mess = [...messages];
                    mess[mess.length - 1] = res.data.message;
                    setMessages(mess);

                    // updating spade
                    const tmp = { ...spade, requestActive: "completed", requestAcceptedChat: currentSpadeRetailer._id };
                    dispatch(setCurrentSpade(tmp));
                    let allSpades = [...spades];
                    allSpades.map((curr, index) => {
                        if (curr._id === tmp._id) {
                            allSpades[index] = tmp;
                        }
                    })
                    dispatch(setSpades(allSpades));

                    const updateChat = { ...currentSpadeRetailer, unreadMessages: 0, latestMessage: { _id: res.data.message._id, message: res.data.message.message } };
                    const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
                    dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
                    dispatch(setCurrentSpadeRetailer(updateChat));

                    socket.emit('new message', res.data.message);
                    const notification = {
                        token: res.data.uniqueTokens,
                        body: spade?.requestDetail,
                        image: "",
                        requestInfo: currentSpadeRetailer,
                    }
                    await BidAccepted(notification);
                    console.log('bid accepted');

                })
                .catch(err => {
                    console.error('error while accepting bid mess', err.message);
                })
        } catch (error) {
            console.error('error while accepting bid', error.message);
        }
    }

    const rejectBid = async () => {
        try {
            const res = await axios.patch('http://173.212.193.109:5000/chat/reject-bid', {
                messageId: messages[messages.length - 1]._id,
            });

            console.log("bid res", res.data);
            const data = formatDateTime(res.data.createdAt);
            res.data.createdAt = data.formattedTime;

            //updating messages
            let mess = [...messages];
            mess[mess.length - 1] = res.data;
            console.log('mess', mess);
            setMessages(mess);

            //updating retailers latest message
            const updateChat = { ...currentSpadeRetailer, unreadMessages: 0, latestMessage: { _id: res.data.message._id, message: res.data.message.message } };
            const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
            dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
            dispatch(setCurrentSpadeRetailer(updateChat));

            console.log('bid rejected');
            socket.emit('new message', res.data);
            const notification = {
                token: [currentSpadeRetailer.retailerId.uniqueToken],
                title: userDetails?.userName,
                body: spade?.requestDetail,
                image: "",
                requestInfo: currentSpadeRetailer,
            }
            await BidRejected(notification);

        } catch (error) {
            console.error('error while rejecting bid', error.message);
        }
    };

    // Recieveing new messages from socket

    useEffect(() => {
        const handleMessageReceived = (newMessageReceived) => {
            console.log('socket received', newMessageReceived);
            setMessages((prevMessages) => {
                const data = formatDateTime(newMessageReceived.createdAt);
                newMessageReceived.createdAt = data.formattedTime;

                if (prevMessages[prevMessages.length - 1]?.chat?._id === newMessageReceived?.chat?._id) {
                    //updating retailers latest message
                    const updateChat = { ...currentSpadeRetailer, unreadMessages: 0, latestMessage: { _id: newMessageReceived._id, message: newMessageReceived.message } };
                    const retailers = currentSpadeRetailers.filter(c => c._id !== updateChat._id);
                    dispatch(setCurrentSpadeRetailers([updateChat, ...retailers]));
                    dispatch(setCurrentSpadeRetailer(updateChat));
                    if (prevMessages[prevMessages.length - 1]?._id === newMessageReceived?._id) {
                        // Update the last message if it's the same as the new one
                        if (newMessageReceived.bidAccepted === "accepted") {
                            const tmp = { ...spade, requestActive: "completed" };
                            dispatch(setCurrentSpade(tmp));
                            let allSpades = [...spades];
                            allSpades.map((curr, index) => {
                                if (curr._id === tmp._id) {
                                    allSpades[index] = tmp;
                                }
                            })
                            dispatch(setSpades(allSpades));
                        }
                        return prevMessages.map(message =>
                            message._id === newMessageReceived._id ? newMessageReceived : message
                        );
                    } else {
                        // Add the new message to the list
                        return [...prevMessages, newMessageReceived];
                    }
                }
                // If the chat ID does not match, return the previous messages unchanged
                return prevMessages;
            });



        };

        socket.on("message received", handleMessageReceived);

        // Cleanup the effect
        return () => {
            socket.off("message received", handleMessageReceived);
        };
    }, []);



    const handleOpenGoogleMaps = async () => {
        // Request permission to access location
        console.log("location");
        const storeLocation = {
            latitude: details.users[0].populatedUser.lattitude,
            longitude: details.users[0].populatedUser.longitude
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied.');
            return;
        }

        // Get current location
        console.log("storelocation", storeLocation);
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });

        console.log("current", currentLocation);

        if (!currentLocation || !storeLocation) {
            Alert.alert('Error', 'Current location or friend location is not available.');
            return;
        }

        const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${storeLocation.latitude},${storeLocation.longitude}&travelmode=driving`;

        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };





    return (
        <>
            {!cameraScreen && <SafeAreaView style={{ flex: 1 }} className="relative">
                <View contentContainerStyle={{ flexGrow: 1 }} className="relative">
                    {attachmentScreen &&
                        <View style={styles.overlay}>
                            <Attachments setAttachmentScreen={setAttachmentScreen} setCameraScreen={setCameraScreen} messages={messages} setMessages={setMessages} />
                        </View>
                    }
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
                            <TouchableOpacity onPress={() => { navigation.navigate('retailer-profile') }}>
                                <View>
                                    <Image
                                        source={{ uri: details.users[0].populatedUser.storeImages[0] ? details.users[0].populatedUser.storeImages[0] : 'https://res.cloudinary.com/kumarvivek/image/upload/v1718021385/fddizqqnbuj9xft9pbl6.jpg' }}
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text className="text-[14px] text-[#2e2c43] capitalize">{details.users ? details?.users[0].populatedUser.storeName : ""}</Text>
                                <Text className="text-[12px] text-[#c4c4c4]">Active 3 hr ago</Text>
                            </View>

                        </View>

                        <View className="flex-row gap-[6px] items-center mt-[16px]">
                            <View className="flex-row gap-[7px] items-center">
                                <Contact />
                                <Text>Contact Details</Text>
                            </View>
                            <TouchableOpacity onPress={() => { handleOpenGoogleMaps() }}>
                                <View className="flex-row gap-[7px] items-center">
                                    <LocationImg />
                                    <Text>Store Location</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-[5px] mt-[15px]">
                            <Tick />
                            <Text>Home delivery available</Text>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View className="flex gap-[10px] px-[10px] pt-[40px] pb-[300px]">
                            {
                                messages && messages?.map((message, index) => (

                                    <View key={index} className="flex-col gap-[5px]  overflow-y-scroll">

                                        {message?.bidType === "false" && message?.sender?.type === 'UserRequest' && <View className="flex flex-row justify-end">
                                            <UserMessage bidDetails={message} />
                                        </View>}
                                        {(message?.bidType === "false" && message?.sender?.type === 'Retailer') && <View className="flex flex-row justify-start">
                                            <RetailerMessage bidDetails={message} pic={details?.users[0]?.populatedUser?.storeImages[0]} />
                                        </View>}
                                        {message?.bidType === "true" && message?.sender?.type === 'UserRequest' && <View className="flex flex-row justify-end">
                                            <UserBidMessage bidDetails={message} />
                                        </View>}
                                        {message?.bidType === "true" && message?.sender?.type === 'Retailer' && <View className="flex flex-row justify-start">
                                            <RetailerBidMessage bidDetails={message} pic={details?.users[0]?.populatedUser?.storeImages[0]} />
                                        </View>}


                                    </View>
                                ))
                            }</View>
                    </ScrollView>


                </View >
                {spade?.requestActive !== "closed" && <View className={`absolute bottom-0 left-0 right-0 w-screen ${attachmentScreen ? "-z-50" : "z-50"}`}>
                    <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px] bg-white w-screen">
                        {

                        }
                        {(((spade?.requestActive === "completed" && spade?.requestAcceptedChat === currentSpadeRetailer?._id) || currentSpadeRetailer?.requestType === "ongoing") && ((messages[messages?.length - 1]?.bidType === "true" && messages[messages?.length - 1]?.bidAccepted === "accepted") || (messages[messages?.length - 1]?.bidType === "true" && messages[messages?.length - 1]?.bidAccepted === "rejected") || messages[messages?.length - 1]?.bidType === "false")) && <View className="w-full flex-row justify-between pl-[20px] pr-[20px]">

                            <TouchableOpacity onPress={() => { navigation.navigate('send-query', { messages, setMessages }) }}>
                                <View className="border-2 border-[#fb8c00]  px-[30px] py-[11.5px] w-[max-content] rounded-2xl">
                                    <Text className="text-[14px] text-[#fb8c00] font-bold ">Send message </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setAttachmentScreen(true) }}>
                                <View className="border-2 border-[#fb8c00] flex-row w-[max-content] px-[10px] py-[10px] rounded-2xl gap-[5px]">
                                    <Document />
                                    <Text className="text-[14px] text-[#fb8c00] font-bold ">Send attachment</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}

                        {((messages[messages?.length - 1]?.bidType === "true" && messages[messages?.length - 1]?.bidAccepted === 'rejected' && spade?.requestActive === "active") || (spade?.requestActive === "active" && messages[messages?.length - 1]?.bidType === "false")) && <TouchableOpacity onPress={() => { navigation.navigate('send-bid', { messages, setMessages }); dispatch(emtpyRequestImages([])); }}>
                            <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                                <Text className="text-white font-bold text-center text-[16px]">Send a new bid</Text>
                            </View>
                        </TouchableOpacity>}

                        {((messages[messages?.length - 1]?.bidType === "true" && messages[messages?.length - 1]?.bidAccepted === "new" && messages[messages?.length - 1]?.sender?.type === "Retailer")) && <View className="w-screen flex-col  ">
                            <View>
                                <Text className="text-center text-[14px] font-semibold">Are you accepting the sellers bid ?</Text>
                                <Text className="text-center text-[14px]">If you don’t understand the sellers response, </Text>
                                <Text className="text-center text-[14px] mb-[8px]">select no and send query for clarification</Text>
                            </View>
                            <View className="flex-row">
                                <View className="w-1/2 flex-row justify-center bg-[#fb8c00]">


                                    <TouchableOpacity onPress={() => { setModalVisibile(true) }} >
                                        <View className=" py-[10px]  ">
                                            <Text className="text-[14px] text-white font-bold ">Yes</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View className="w-1/2 border-2 border-[#fb8c00] flex-row justify-center">
                                    <TouchableOpacity onPress={() => { rejectBid() }} >
                                        <View className=" flex-row  py-[10px]  gap-[5px]">

                                            <Text className="text-[14px] text-[#fb8c00] font-bold ">No</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>}
                    </View>
                </View>}
            </SafeAreaView>}

            {
                modalVisible && <RequestAcceptModal modalVisible={modalVisible} setModalVisible={setModalVisibile} acceptBid={acceptBid} />
            }
        </>
    )
}

const styles = {
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100, // Ensure the overlay is on top
    },

    attachments: {

        zIndex: -20, // Ensure the overlay is on top
    },

};

export default BargainingScreen;
import { View, Text, ScrollView, Pressable, Image, TouchableOpacity, BackHandler, ActivityIndicator, AppState, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import RandomImg from '../../assets/RandomImg.svg';
import Gallery from '../../assets/grayGallery.svg';
import GreenClock from '../../assets/greenClock.svg';
import ThreeDots from '../../assets/3dots.svg';
import ArrowLeft from '../../assets/arrow-left.svg';
import axios from 'axios';
import Tick from '../../assets/Tick.svg';
import * as Clipboard from 'expo-clipboard';
import { setBargainingScreens, setCurrentSpade, setCurrentSpadeChatId, setCurrentSpadeRetailer, setIsHome, setUserDetails } from '../../redux/reducers/userDataSlice';
import { connect, useDispatch, useSelector } from 'react-redux';
import CloseSpadeModal from '../components/CloseSpadeModal';
import SuccessModal from '../components/SuccessModal';
import { setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { setSpades } from '../../redux/reducers/userDataSlice';
import useRequestSocket from './useRequestSocket';
import { socket } from '../../utils/scoket.io/socket';
import Star from '../../assets/Star.svg';
import HomeIcon from '../../assets/homeIcon.svg';
import { getGeoCoordinates } from '../../utils/logics/Logics';
import { formatDateTime } from '../../utils/logics/Logics';
import Copy from "../../assets/copy.svg";
import GalleryImg from "../../assets/gallery.svg";
import TextGalleryIcon from '../../assets/grayGallery.svg';

import { sendCloseSpadeNotification } from '../../notification/notificationMessages';
import { FullWindowOverlay } from 'react-native-screens';
import { baseUrl } from '../../utils/logics/constants';
import { MaterialIcons } from '@expo/vector-icons';
import axiosInstance from '../../utils/logics/axiosInstance';
import NetworkError from '../components/NetworkError';
import StoreIcon from '../../assets/StoreIcon.svg';

const RequestDetail = () => {
    const navigation = useNavigation();

    const spade = useSelector(store => store.user.currentSpade);
    const spades = useSelector(store => store.user.spades);
    const [modal, setModal] = useState(false);
    const [retailers, setRetailers] = useState([]);
    const dispatch = useDispatch();
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);
    const userDetails = useSelector(store => store.user.userDetails);
    // console.log('RequestDetail screen  currentSpadeRetailers', currentSpadeRetailers.length);
    const currentSpade = useSelector(store => store.user.currentSpade);
    const [socketConnected, setSocketConnected] = useState(false);
    // const [userLongitude, setUserLongitude] = useState(0);
    // const [userLatitude, setUserLatitude] = useState(0);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const navigationState = useNavigationState((state) => state);
    const isRequestDetailScreen = navigationState.routes[navigationState.index].name === 'activerequest';
    const accessToken = useSelector(store => store.user.accessToken);
    const [viewMore, setViewMore] = useState(false);
    const isHome = useSelector(store => store.user.isHome);
    const [retailersLoading, setRetailersLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);


    ////////////////////////////////////////////////////////////////////////Connecting the socket when app comes to foreground from background////////////////////////////////////////////////////////////////////////////////

    // useEffect(() => {
    //     const subcription = AppState.addEventListener('change', nextAppState => {
    //         if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
    //             const spadeId = currentSpade?._id;
    //             if (spadeId)
    //                 connectSocket(spadeId);
    //             else
    //                 navigation.navigate('home');
    //             console.log('App has come to the RequestId foreground!');
    //         }
    //         appState.current = nextAppState;
    //         setAppStateVisible(appState.current);
    //         console.log('AppState', appState.current);
    //     });
    //     return () => subcription.remove();
    // }, []);


    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        const backAction = () => {
            if (isRequestDetailScreen) {
                console.log('isHome', isHome);
                if (isHome)
                    navigation.navigate('home');
                else {
                    navigation.navigate('history');
                    dispatch(setIsHome(true));
                }
                return true;
            } else {
                return false;
            }
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [isRequestDetailScreen]);


    const connectSocket = async () => {
        // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
        const id = currentSpade._id;
        const userId = id;
        const senderId = id;
        socket.emit("setup", { userId, senderId });
        //  console.log('Request connected with socket with id', spadeId);
        socket.on('connected', () => setSocketConnected(true));
        console.log('RequestDetail screen socekt connect with id', id);
    }

    const handleSpadeNaviagtion = async () => {
        if (currentSpade.unread === true) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                };
                await axiosInstance.patch(`${baseUrl}/user/set-spade-mark-as-read`, {
                    id: currentSpade._id
                }, config)
                    .then((res) => {
                        console.log('Mark as read successfully at request Detail screen');
                        let spadesData = [...spades];
                        const updatedSpadesData = spadesData.map(spade => {
                            if (spade._id === currentSpade._id) {
                                return { ...spade, unread: false }; // Update unread property
                            }
                            return spade;
                        });

                        // Dispatch the updated spades data
                        dispatch(setSpades(updatedSpadesData));
                    })
            } catch (error) {
                console.error('Error while updating', error.message);
            }
        }
    }

    const fetchRetailers = () => {
        setRetailersLoading(true);
        const spadeId = currentSpade._id;
        // connectSocket(spadeId);
        const config = {
            headers: { // Use "headers" instead of "header"
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                id: currentSpade._id,
            }
        };
        axiosInstance.get(`${baseUrl}/chat/spade-chats`, config)
            .then((response) => {
                setRetailersLoading(false);

                if (response.status === 200) {
                    // setRetailers(response.data);
                    const chats = response.data;
                    let acceptedChat = null;
                    chats.map(chat => {
                        const data = formatDateTime(chat.updatedAt);
                        chat.updatedAt = data.formattedTime;
                        chat.createdAt = data.formattedDate;
                        if (chat?.requestType === "win" || chat.requestType === "completed") {
                            acceptedChat = chat;
                        }
                    })

                    if (acceptedChat) {
                        const extraChats = chats.filter(chat => chat._id !== acceptedChat._id);
                        const allChats = [acceptedChat, ...extraChats];
                        console.log('allChats', allChats.length);

                        dispatch(setCurrentSpadeRetailers(allChats));
                    }
                    else {
                        const extraChats = chats.filter(chat => chat.requestType !== "closed" && chat.requestType !== "closedHistory");
                        const closedChats = chats.filter(chat => chat.requestType === "closed" || chat.requestType === "closedHistory");
                        const allChats = [...extraChats, ...closedChats];
                        console.log('allChats', allChats.length, extraChats.length, closedChats.length);

                        dispatch(setCurrentSpadeRetailers(allChats));
                        // dispatch(setCurrentSpadeRetailers(chats));
                    }
                    if (!isHome && !currentSpade?.rated && currentSpade?.requestAcceptedChat)
                        navigation.navigate('rating-feedback');
                }
            })
            .catch((error) => {
                setRetailersLoading(false);
                if (!error?.response?.status) {
                    setNetworkError(true);
                }
                console.error('Error while fetching chats', error);
            });
    }

    useEffect(() => {
        // const socket = io('http://your-server-address:3000');
        const spadeId = currentSpade._id;
        if (spadeId)
            connectSocket();

        handleSpadeNaviagtion();

        dispatch(setCurrentSpadeRetailers([]));

        fetchRetailers();



        return () => {
            // socket.disconnect();
            const userId = spadeId;
            const senderId = spadeId;
            socket.emit('leave room', { userId, senderId });
            console.log('Reailer disconnected');
        };
    }, []);

    useEffect(() => {
        const handleMessageReceived = (updatedUser) => {
            if (currentSpade._id === updatedUser.requestId._id) {


                console.log('Updated user data received at socket', updatedUser._id, updatedUser.latestMessage.message, updatedUser.unreadCount);
                const data = formatDateTime(updatedUser.updatedAt);
                updatedUser.createdAt = data.formattedDate;
                updatedUser.updatedAt = data.formattedTime;
                // console.log('updated user', updatedUser.latestMessage);
                if (updatedUser.latestMessage.bidType === "true" && updatedUser.latestMessage.bidAccepted === "accepted") {
                    const tmp = { ...currentSpade, requestActive: "completed", requestAcceptedChat: updatedUser._id };
                    dispatch(setCurrentSpade(tmp));
                    const allSpades = spades.filter(spade => spade._id !== tmp._id);
                    const updatedSpades = [tmp, ...allSpades];
                    // console.log('allSpades', updatedSpades);
                    dispatch(setSpades(updatedSpades));
                }


                const updatedRetailers = [updatedUser, ...currentSpadeRetailers.filter(c => c._id !== updatedUser._id)];

                dispatch(setCurrentSpadeRetailers(updatedRetailers));

                let spadesData = [...spades];
                const idx = spadesData.findIndex(spade => spade._id === updatedUser.requestId._id);

                console.log("Spdes updated ", idx);
                if (idx !== -1 && updatedUser.latestMessage.bidAccepted !== "accepted") {

                    let data = spadesData.filter(spade => spade._id === updatedUser.requestId._id);
                    // let spadeToUpdate = { ...spadesData[idx] };
                    let data2 = spadesData.filter(spade => spade._id !== updatedUser.requestId._id);

                    data[0] = { ...data[0], unread: false };
                    // console.log('data', data);
                    spadesData = [...data, ...data2]

                    console.log("Spdes updated Successfully", data.length, data2.length);
                    dispatch(setSpades(spadesData));
                }
            }
        };

        socket.on("updated retailer", handleMessageReceived);

        // Cleanup the effect
        return () => {
            socket.off("updated retailer", handleMessageReceived);
        };
    }, [currentSpadeRetailers, currentSpade, spades, dispatch]);





    const haversineDistance = useCallback((lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lat2 || !lon1 || !lon2) return;
        console.log('deg', lat1, lon1, lat2, lon2);
        const toRadians = (degree) => degree * (Math.PI / 180);

        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in kilometers
        // console.log(R, dLat, dLon, a, c, distance);
        return distance;
    }, []);

    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await Clipboard.setStringAsync('hello world');
            console.log('Text copied to clipboard');
            setCopied(true);

            // Hide the notification after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text to clipboard', error);
        }
    };



    return (
        <>
            {<View style={{ flex: 1, position: 'relative' }} >

                <ScrollView style={{ flex: 1 }} className="relative bg-white">
                    <View style={{ flex: 1, position: 'relative' }} className="relative ">

                        <View className="z-50 w-full flex flex-row px-[9px] absolute justify-between items-center top-[20px]">


                            <TouchableOpacity onPress={() => {
                                if (isHome)
                                    navigation.navigate('home');
                                else {
                                    navigation.navigate('history');
                                    dispatch(setIsHome(true));
                                }
                            }} style={{ padding: 4 }}>
                                <View className="px-[10px] py-[15px] ">
                                    <ArrowLeft />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { setModal(!modal) }} >
                                <View className="px-[20px] py-[10px] ">
                                    <ThreeDots />
                                </View>
                            </TouchableOpacity>
                        </View>



                        <View className="bg-[#ffe7c8] text-[#2e2c43]  py-[30px] pt-[30px]">
                            <View className="px-[50px]">


                                <Text className="text-[16px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Bold" }}>Request for</Text>
                                <View className=" flex-row">
                                    <Text className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px] capitalize" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestCategory.indexOf('-') > 0 ? spade?.requestCategory.slice(0, spade?.requestCategory.indexOf('-')) : spade?.requestCategory}</Text>
                                </View>
                                <View className="flex-col relative  ">
                                    <Text className=" text-[12px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Bold" }}>Request ID:</Text>
                                    <View className="flex-row items-center gap-[15px]">
                                        <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-SemiBold" }}>{spade._id}</Text>
                                        <TouchableOpacity onPress={() => { copyToClipboard() }} style={{ padding: 4 }}>
                                            <Copy />
                                        </TouchableOpacity>
                                        {copied && <Text className="bg-[#ebebeb] p-2 rounded-lg absolute -top-10 right-0">Copied!</Text>}
                                    </View>



                                </View>
                            </View>
                            <View className="pl-[50px] pr-[32px]">
                                {spade?.requestDescription.length < 50 && <Text className="mt-[5px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>}
                                {spade?.requestDescription.length >= 50 && <View>
                                    {!viewMore && <Text className="mt-[5px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription.slice(0, 50)}...</Text>}
                                    {viewMore && <Text className="mt-[5px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>}

                                    <Pressable onPress={() => setViewMore(!viewMore)}>
                                        <View className="flex-row items-center">
                                            <Text className={`text-[14px]  ${viewMore ? 'text-[#fb8c00]' : 'text-[#fb8c00]'}`} style={{ fontFamily: 'Poppins-Regular' }}>{viewMore ? 'View Less' : 'View More'}</Text>
                                            {!viewMore && <MaterialIcons name="keyboard-arrow-down" size={20} color="#fb8c00" />}
                                            {viewMore && <MaterialIcons name="keyboard-arrow-up" size={20} color="#fb8c00" />}
                                        </View>
                                    </Pressable>
                                </View>}
                                <Pressable onPress={() => navigation.navigate('image-refrences')}>
                                    <View className="flex-row gap-[15px] mt-[15px] items-center">
                                        <GalleryImg />
                                        <Text className="text-[14px]  text-[#fb8c00]" style={{ fontFamily: "Poppins-Regular" }}>Image References</Text>
                                    </View>
                                </Pressable>

                                <View>{
                                    (spade?.requestActive === "completed" || spade?.requestActive === "closed") && spade?.requestAcceptedChat && <View className="flex-row gap-[5px] mt-[15px]">
                                        <Tick />
                                        <Text className="text-[##79B649]" style={{ fontFamily: "Poppins-Bold" }}>Offer Accepted</Text>


                                    </View>
                                }</View>
                            </View>
                        </View>

                        <View>
                            {
                                currentSpadeRetailers && currentSpadeRetailers?.length > 0 && currentSpadeRetailers?.map((details, index) => {
                                    let distance = null;
                                    if (userLongitude !== 0 && userLatitude !== 0 && details?.retailerId?.longitude !== 0 && details?.retailerId?.lattitude !== 0) {
                                        distance = haversineDistance(userLatitude, userLongitude, details?.retailerId?.lattitude, details?.retailerId?.longitude);
                                        // console.log('dis', distance);
                                    }
                                    // console.log(details?.requestType);
                                    // else if (details && details?.customerId?.longitude !== 0 && details?.customerId.latitude !== 0 && details.retailerId.longitude !== 0 && details.retailerId.lattitude !== 0) {
                                    //     distance = haversineDistance(details.customerId.latitude, details.customerId.longitude, details.retailerId.lattitude, details.retailerId.longitude);
                                    // }
                                    // console.log(details.customerId.latitude, details.customerId.longitude);

                                    // Calculate distance if coordinates are valid
                                    // distance = validCoordinates ? haversineDistance(details.customerId.latitude, details.customerId.longitude, details.retailerId.lattitude, details.retailerId.longitude) : null;
                                    return (
                                        <TouchableOpacity key={index} onPress={() => {
                                            dispatch(setCurrentSpadeRetailer(details)); dispatch(setCurrentSpadeChatId({ chatId: details?._id, socketId: details?.users[1]._id, retailerSocketId: details?.users[0]._id })); dispatch(setBargainingScreens(details?._id))
                                            setTimeout(() => {
                                                navigation.navigate(`${details?._id}`);
                                            }, 200);
                                        }}>
                                            {(((spade?.requestActive === "completed" || spade?.requestActive === "closed") && spade?.requestAcceptedChat !== details._id) || (details?.requestType === "closed" || details?.requestType === "closedHistory")) && <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', width: FullWindowOverlay, height: 98, zIndex: 200, position: 'absolute', top: 0, left: 0, right: 0 }}>

                                            </View>}
                                            {details && <View className="flex-row px-[34px] gap-[20px] h-[96px] w-screen items-center border-b-[1px] border-[#f1f1f7] ">
                                                {details?.retailerId?.storeImages?.length > 0 ? (<Image
                                                    source={{ uri: details?.retailerId?.storeImages[0] }}
                                                    style={styles.image}
                                                />) : (<StoreIcon />)}
                                                <View className="gap-[5px] w-4/5">
                                                    <View className="flex-row justify-between pt-[10px]">
                                                        <Text className="text-[14px] text-[#2e2c43] capitalize " style={{ fontFamily: "Poppins-Regular" }}>{details?.retailerId?.storeName?.length > 20 ? `${details?.retailerId?.storeName.slice(0, 20)}...` : details?.retailerId?.storeName}</Text>
                                                        <View className="flex-row items-center gap-[5px]">
                                                            <GreenClock />
                                                            <Text className="text-[12px] text-[#558b2f]" style={{ fontFamily: "Poppins-Regular" }}>{details?.updatedAt}</Text>
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center gap-[15px] ">
                                                        {details?.retailerId?.totalReview > 0 && (
                                                            <View className="flex-row items-center gap-[5px]">

                                                                <Star />
                                                                <Text><Text>{parseFloat(details?.retailerId?.totalRating / details?.retailerId?.totalReview).toFixed(1)}</Text>/5</Text>
                                                            </View>
                                                        )}
                                                        {details?.retailerId?.homeDelivery && <View>
                                                            <HomeIcon />
                                                        </View>}
                                                        {
                                                            distance && <View>
                                                                <Text className="bg-[#ffe7c8] text-text  px-[5px]  rounded-md" style={{ fontFamily: "Poppins-Regular" }}><Text>{parseFloat(distance).toFixed(1)}</Text> km</Text>
                                                            </View>
                                                        }
                                                    </View>

                                                    <View className="flex-row justify-between items-center ">
                                                        <View className="flex-row gap-[5px] ">
                                                            {
                                                                details?.latestMessage?.bidType === "true" && (
                                                                    <View >
                                                                        {details?.latestMessage?.bidAccepted === "new" && (
                                                                            <View>
                                                                                <Text style={{ color: 'white', paddingHorizontal: 8, backgroundColor: '#dbcdbb', borderRadius: 10 }}>Offer</Text>
                                                                            </View>
                                                                        )}
                                                                        {details?.latestMessage?.bidAccepted === "accepted" && (
                                                                            <View>
                                                                                <Text style={{ color: 'white', paddingHorizontal: 8, backgroundColor: '#558b2f', borderRadius: 10 }}>Offer</Text>
                                                                            </View>
                                                                        )}
                                                                        {details?.latestMessage?.bidAccepted === "rejected" && (
                                                                            <View>
                                                                                <Text style={{ color: 'white', paddingHorizontal: 8, backgroundColor: '#e76063', borderRadius: 10 }}>Offer</Text>
                                                                            </View>
                                                                        )}
                                                                    </View>
                                                                )
                                                            }
                                                            {details?.latestMessage?.bidType !== "true" && details?.latestMessage?.bidImages?.length > 0 && <TextGalleryIcon />}
                                                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-Regular", color: '#7c7c7c' }}>{details?.latestMessage?.message?.length > 25 ? `${details?.latestMessage?.message.slice(0, 22)}...` : details?.latestMessage?.message || 'No message available'}</Text>

                                                        </View>
                                                        {details?.unreadCount > 0 && details?.latestMessage?.sender?.type === 'Retailer' && <View className="w-[18px] h-[18px] rounded-full bg-[#55cd00] flex-row justify-center items-center">
                                                            <Text className=" text-white text-[12px] " style={{ fontFamily: "Poppins-Bold" }}>{details?.unreadCount}</Text>
                                                        </View>}
                                                    </View>


                                                </View>
                                            </View>}
                                        </TouchableOpacity>
                                    )
                                })
                            }


                        </View>
                        {retailersLoading && <View className="mt-[100px]"><ActivityIndicator color="#fb8c00" size={35} /></View>}
                        {networkError && <View className="mt-[100px]"><NetworkError callFunction={fetchRetailers} connectSocket={connectSocket} setNetworkError={setNetworkError} /></View>}
                    </View>
                </ScrollView>

                {spade?.requestActive === "completed" && <View className="w-screen h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                    <TouchableOpacity onPress={() => { setConfirmModal(true); }}>
                        <Text className="text-white text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Close Request</Text>
                    </TouchableOpacity>
                </View>}
                {spade?.requestActive === "active" && currentSpadeRetailers?.length === 0 && !networkError && <View className="w-screen h-[68px]  justify-center absolute bottom-[20px] left-0 right-0">

                    <View className="bg-[#ffe7c8] mx-[16px] h-[68px] flex-row items-center justify-center rounded-full">


                        <Text className="text-[#fb8c00] text-center text-[14px]" style={{ fontFamily: "Poppins-Regular" }}>Waiting for vendors response..... </Text>
                    </View>
                </View>}
            </View>}
            {modal &&
                <>
                    <Pressable style={{ flex: 1, zIndex: 10, ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0)', position: 'absolute' }}
                        onPress={() => { setModal(false) }}
                    />

                    <View className="absolute top-[30px] right-[50px] z-50 bg-white rounded-md">
                        <TouchableOpacity onPress={() => { navigation.navigate('view-request', { data: spade }); setModal(!modal) }}>
                            <Text className="mx-5  py-5 px-5" style={{ fontFamily: "Poppins-Regular", borderBottomColor: 'rgba(0,0,0,0.05)', borderBottomWidth: 1 }}>View Request</Text>
                        </TouchableOpacity>
                        {spade.requestActive !== "closed" && <View>
                            <TouchableOpacity onPress={() => { setConfirmModal(true); setModal(false); }}>
                                <Text className="mx-5 py-5  px-5" style={{ fontFamily: "Poppins-Regular", borderBottomColor: 'rgba(0,0,0,0.05)', borderBottomWidth: 1 }}>Close Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { navigation.navigate("help"); setModal(!modal) }}>
                                <Text className="mx-5 py-5 px-5" style={{ fontFamily: "Poppins-Regular" }}>Report Concern</Text>
                            </TouchableOpacity>
                        </View>}

                    </View>
                </>
            }
            {confirmModal && <CloseSpadeModal confirmModal={confirmModal} setConfirmModal={setConfirmModal} setSuccessModal={setSuccessModal} />}
            {successModal && <SuccessModal successModal={successModal} setSuccessModal={setSuccessModal} successMessage={"Request Closed"} />}
        </>
    )
}


const styles = {

    image: {
        width: 50,
        height: 50,
        borderRadius: 100
    },

};



export default RequestDetail;
import { View, Text, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import RandomImg from '../../assets/RandomImg.svg';
import Gallery from '../../assets/grayGallery.svg';
import GreenClock from '../../assets/greenClock.svg';
import ThreeDots from '../../assets/3dots.svg';
import ArrowLeft from '../../assets/arrow-left.svg';
import axios from 'axios';
import Tick from '../../assets/Tick.svg';
import * as Clipboard from 'expo-clipboard';
import { setCurrentSpade, setCurrentSpadeChatId, setCurrentSpadeRetailer, setUserDetails } from '../../redux/reducers/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
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
import { sendCloseSpadeNotification } from '../../notification/notificationMessages';



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

    const connectSocket = async (id) => {
        // socket.emit("setup", currentSpadeRetailer?.users[1]._id);
        socket.emit("setup", id);
        //  console.log('Request connected with socket with id', spadeId);
        socket.on('connected', () => setSocketConnected(true));
        console.log('Particular spade socekt connect with id', id);
    }

    const handleSpadeNaviagtion = async () => {
        if (currentSpade.unread === true) {
            try {
                await axios.patch('http://173.212.193.109:5000/user/set-spade-mark-as-read', {
                    id: currentSpade._id
                })
                    .then((res) => {
                        console.log('Mars as read successfully');
                        let spadesData = [...spades];

                        // Find and update the specific spade
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

    useEffect(() => {
        // const socket = io('http://your-server-address:3000');
        const spadeId = currentSpade._id;
        connectSocket(spadeId);

        handleSpadeNaviagtion();

        dispatch(setCurrentSpadeRetailers([]));

        // socket.on('updated retailer', (updatedUser) => {
        //     console.log('Message receiver for chat for unread chat', updatedUser);
        //     // setCurrentSpadeRetailers((prevUsers) => {
        //     //     return prevUsers.map((user) =>
        //     //         user._id === updatedUser._id ? updatedUser : user
        //     //     );
        //     // });
        // });

        const fetchRetailers = () => {
            axios.get(`http://173.212.193.109:5000/chat/spade-chats`, {
                params: {
                    id: currentSpade._id,
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        // setRetailers(response.data);
                        const chats = response.data;
                        chats.map(chat => {
                            const data = formatDateTime(chat.updatedAt);
                            chat.updatedAt = data.formattedTime;
                            chat.createdAt = data.formattedDate;
                            // console.log(mess.createdAt);
                            console.log(chat._id, chat.updatedAt);
                        })

                        console.log('all reatailers fetched while setting up socket');
                        dispatch(setCurrentSpadeRetailers(chats));
                    }
                })
                .catch((error) => {
                    console.error('Error while fetching chats', error);
                });
        }
        fetchRetailers();

        // getGeoCoordinates().then(coordinates => {
        //     console.log('coordinates', coordinates);
        //     if (coordinates) {
        //         setUserLongitude(coordinates.coords.longitude);
        //         setUserLatitude(coordinates.coords.latitude);
        //     }
        // })


        return () => {
            // socket.disconnect();
            socket.emit('leave room', spadeId);
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
                // dispatch(setCurrentSpadeRetailers((prevUsers) => {
                //     return prevUsers.map((user) =>
                //         user._id === updatedUser._id ? updatedUser : user
                //     );
                // }));
                if (updatedUser.latestMessage.bidType === "true" && updatedUser.latestMessage.bidAccepted === "accepted") {
                    const tmp = { ...currentSpade, requestActive: "completed", requestAcceptedChat: updatedUser._id };
                    dispatch(setCurrentSpade(tmp));
                    let allSpades = [...spades];
                    allSpades.map((curr, index) => {
                        if (curr._id === tmp._id) {
                            allSpades[index] = tmp;
                        }
                    })
                    dispatch(setSpades(allSpades));
                }

                // let retailers = [currentSpadeRetailers];
                // retailers = currentSpadeRetailers.filter(c => c._id !== updatedUser._id);
                // retailers = [updatedUser, ...retailers];
                // dispatch(setCurrentSpadeRetailers(retailers));
                // console.log('updatedRe', currentSpadeRetailers);
                // console.log('updatedUser', updatedUser);

                console.log('currentSpadeRetailers', updatedUser.retailerId);

                // const updatedRetailers = [updatedUser, ...currentSpadeRetailers];
                const updatedRetailers = [updatedUser, ...currentSpadeRetailers.filter(c => c._id !== updatedUser._id)];

                dispatch(setCurrentSpadeRetailers(updatedRetailers));
                setTimeout(() => {
                    console.log('updatedTime', currentSpadeRetailers.length);
                }, 2000);

            }
        };

        socket.on("updated retailer", handleMessageReceived);

        // Cleanup the effect
        return () => {
            socket.off("updated retailer", handleMessageReceived);
        };
    }, [currentSpadeRetailers, currentSpade, spades, dispatch]); // No dependencies


    // console.log('spade details', spade);

    // useEffect(() => {
    //     // console.log('object', spade._id);
    //     const fetchRetailers = () => {
    //         axios.get(`https://culturtap.com/api/chat/spade-chats`, {
    //             params: {
    //                 id: spade._id,
    //             }
    //         })
    //             .then((response) => {
    //                 if (response.status === 200) {
    //                     setRetailers(response.data);
    //                     // console.log('all reatailers', response.data);
    //                     dispatch(setCurrentSpadeRetailers(response.data));
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('Error while fetching chats', error);
    //             });
    //     }
    //     fetchRetailers();
    // }, []);

    const closeRequest = async () => {

        const token = await axios.get('http://173.212.193.109:5000/retailer/unique-token', {
            params: {
                id: currentSpadeRetailers[0]?.retailerId._id,
            }
        });

        await axios
            .post("http://173.212.193.109:5000/chat/send-message", {
                sender: {
                    type: "UserRequest",
                    refId: currentSpade._id,
                },
                message: "Customer close the chat",
                userRequest: currentSpade._id,
                bidType: "update",
                bidPrice: 0,
                bidImages: [],
                chat: currentSpade.requestAcceptedChat,
                warranty: 0,
            })
            .then(async (res) => {
                socket.emit("new message", res.data);
                const request = await axios.patch(`http://173.212.193.109:5000/user/closespade/`, {
                    id: currentSpade._id
                });
                console.log('request', request);
                if (request.status === 200) {
                    console.log('request closed');
                    spades = spades.filter(curr => curr._id !== request._id);
                    console.log('Request closed successfully');
                    dispatch(setSpades(spades));
                    navigation.navigate('home');


                    if (token.length > 0) {
                        const notification = {
                            token: token,
                            title: userDetails.userName,
                            close: currentSpade._id,
                            image: currentSpade.requestImages ? currentSpade.requestImages[0] : ""
                        }
                        console.log("close notification", token)
                        await sendCloseSpadeNotification(notification);

                    }
                    // Send Notification to reatiler 
                }
                else {
                    console.error('Error occuring while closing user request');
                }
            })






    }



    const haversineDistance = useCallback((lat1, lon1, lat2, lon2) => {
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
    });
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
            {<Pressable style={{ flex: 1, position: 'relative' }} onPress={() => { setModal(false) }}>

                <ScrollView style={{ flex: 1 }} className="relative">
                    <View style={{ flex: 1, position: 'relative' }} className="relative">

                        <View className="z-50 w-full flex flex-row px-[9px] absolute justify-between items-center top-[20px]">


                            <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ padding: 4 }}>
                                <View className="px-[20px] py-[10px] ">
                                    <ArrowLeft />
                                </View>
                            </TouchableOpacity>

                            {spade.requestActive !== "closed" && <TouchableOpacity onPress={() => { setModal(!modal) }} >
                                <View className="px-[20px] py-[10px] ">
                                    <ThreeDots />
                                </View>
                            </TouchableOpacity>}



                        </View>

                        {modal && <View className="absolute top-[30px] right-[50px] z-50 bg-white rounded-md">
                            <TouchableOpacity onPress={() => { navigation.navigate('view-request', { data: spade }); setModal(!modal) }}>
                                <Text className="mx-5 border-1 border-b-[1px] py-3" style={{ fontFamily: "Poppins-Regular" }}>View Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => closeRequest()}>
                                <Text className="mx-5 py-3 border-1 border-b-[1px]" style={{ fontFamily: "Poppins-Regular" }}>Close Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { navigation.navigate("help"); setModal(!modal) }}>
                                <Text className="mx-5 py-3" style={{ fontFamily: "Poppins-Regular" }}>Report Shopkeeper</Text>
                            </TouchableOpacity>
                        </View>}

                        <View className="bg-[#ffe7c8] px-[64px] py-[30px] pt-[20px]">
                            <Text className="text-[16px] " style={{ fontFamily: "Poppins-Bold" }}>Request for</Text>
                            <View className=" flex-row">
                                <Text className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestCategory}</Text>
                            </View>
                            <View className="flex-row gap-[10px] relative items-center ">
                                <Text className=" text-[12px]" style={{ fontFamily: "Poppins-Bold" }}>Request ID:</Text>
                                <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{spade._id}</Text>
                                <TouchableOpacity onPress={() => { copyToClipboard() }} style={{ padding: 4 }}>
                                    <Copy />
                                </TouchableOpacity>
                                {copied && <Text className="bg-[#ebebeb] p-2 rounded-lg absolute -top-10 right-0">Copied!</Text>}


                            </View>
                            <Text className="mt-[5px]" style={{ fontFamily: "Poppins-Regular" }}>{spade.requestDescription}</Text>
                            <Pressable onPress={() => navigation.navigate('image-refrences')}>
                                <View className="flex-row gap-[15px] mt-[15px] items-center">
                                    <GalleryImg />
                                    <Text className="text-[14px]  text-[#fb8c00]" style={{ fontFamily: "Poppins-Black" }}>Image References</Text>
                                </View>
                            </Pressable>

                            <View>{
                                (spade.requestActive === "completed" || spade.requestActive === "closed") && <View className="flex-row gap-[5px] mt-[15px]">
                                    <Tick />
                                    <Text className="text-[##79B649]" style={{ fontFamily: "Poppins-Bold" }}>Offer Accepted</Text>


                                </View>
                            }</View>
                        </View>

                        <View>
                            {
                                currentSpadeRetailers && currentSpadeRetailers.length > 0 && currentSpadeRetailers.map((details, index) => {
                                    let distance = null;
                                    if (userLongitude !== 0 && userLatitude !== 0 && details.retailerId.longitude !== 0 && details.retailerId.lattitude !== 0) {
                                        distance = haversineDistance(userLatitude, userLongitude, details.retailerId.lattitude, details.retailerId.longitude);
                                        // console.log('dis', distance);
                                    }
                                    // else if (details && details?.customerId?.longitude !== 0 && details?.customerId.latitude !== 0 && details.retailerId.longitude !== 0 && details.retailerId.lattitude !== 0) {
                                    //     distance = haversineDistance(details.customerId.latitude, details.customerId.longitude, details.retailerId.lattitude, details.retailerId.longitude);
                                    // }
                                    // console.log(details.customerId.latitude, details.customerId.longitude);

                                    // Calculate distance if coordinates are valid
                                    // distance = validCoordinates ? haversineDistance(details.customerId.latitude, details.customerId.longitude, details.retailerId.lattitude, details.retailerId.longitude) : null;
                                    return (
                                        <TouchableOpacity key={index} onPress={() => { dispatch(setCurrentSpadeRetailer(details)); dispatch(setCurrentSpadeChatId({ chatId: details?._id, socketId: details?.users[1]._id })); navigation.navigate('bargain') }}>
                                            <View className={`flex-row px-[34px] gap-[20px] h-[96px] w-screen items-center border-b-[1px] border-[#3f3d56] ${((spade.requestActive === "completed" || spade.requestActive === "closed") && spade.requestAcceptedChat !== details._id) ? "bg-[#001b33] opacity-50" : ""}`}>
                                                {/* {console.log('chat details after bid accept', spade.requestActive, spade.requestAcceptedChat, details._id)} */}
                                                {details?.users.length > 0 && <Image
                                                    source={{ uri: details?.users[0].populatedUser.storeImages[0] ? details?.users[0].populatedUser.storeImages[0] : 'https://res.cloudinary.com/kumarvivek/image/upload/v1718021385/fddizqqnbuj9xft9pbl6.jpg' }}
                                                    style={styles.image}
                                                />}
                                                <View className="gap-[10px] w-4/5">
                                                    <View className="flex-row justify-between">
                                                        <Text className="text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>{details?.users[0].populatedUser.storeName.length > 20 ? `${details?.users[0].populatedUser.storeName.slice(0, 20)}...` : details?.users[0].populatedUser.storeName}</Text>
                                                        <View className="flex-row items-center gap-[5px]">
                                                            <GreenClock />
                                                            <Text className="text-[12px] text-[#558b2f]" style={{ fontFamily: "Poppins-Regular" }}>{details?.updatedAt}</Text>
                                                        </View>
                                                    </View>
                                                    <View className="flex-row items-center gap-[15px]">
                                                        {details?.retailerId?.totalReview > 0 && (
                                                            <View className="flex-row items-center gap-[5px]">
                                                                <Star />
                                                                <Text><Text>{parseFloat(details.retailerId.totalRating / details.retailerId.totalReview).toFixed(1)}</Text>/5</Text>
                                                            </View>
                                                        )}

                                                        {details?.retailerId?.homeDelivery && <View>
                                                            <HomeIcon />
                                                        </View>}
                                                        {
                                                            distance && <View>
                                                                <Text className="bg-[#ffe7c8] text-text  px-[5px] py-[2px] rounded-md"><Text>{parseFloat(distance).toFixed(1)}</Text> km</Text>
                                                            </View>
                                                        }
                                                    </View>

                                                    <View className="flex-row justify-between">
                                                        <View className="flex-row gap-[5px]">
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
                                                            <Text className="text-[14px] text-[#c4c4c4]" style={{ fontFamily: "Poppins-Regular" }}>{details?.latestMessage?.message || 'No message available'}</Text>

                                                        </View>
                                                        {details?.unreadCount > 0 && details?.latestMessage?.sender?.type === 'Retailer' && <View className="w-[18px] h-[18px] rounded-full bg-[#55cd00] flex-row justify-center items-center">
                                                            <Text className=" text-white text-[12px] " style={{ fontFamily: "Poppins-Bold" }}>{details.unreadCount}</Text>
                                                        </View>}
                                                    </View>


                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }


                        </View>
                    </View>
                </ScrollView>

                {spade.requestActive === "completed" && <View className="w-screen h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                    <TouchableOpacity onPress={() => { setConfirmModal(true); }}>
                        <Text className="text-white text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Close Request</Text>
                    </TouchableOpacity>
                </View>}
                {spade.requestActive === "active" && currentSpadeRetailers.length === 0 && <View className="w-screen h-[68px]  justify-center absolute bottom-[20px] left-0 right-0">

                    <View className="bg-[#ffe7c8] mx-[16px] h-[68px] flex-row items-center justify-center rounded-full">


                        <Text className="text-[#fb8c00] text-center text-[14px]" style={{ fontFamily: "Poppins-Black" }}>Waiting for retailers response..... </Text>
                    </View>
                </View>}
            </Pressable>}
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
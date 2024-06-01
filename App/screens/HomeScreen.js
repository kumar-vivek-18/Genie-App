import { View, Text, ScrollView, Image, Pressable, BackHandler, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSpades, setCurrentSpade, setUserDetails } from '../redux/reducers/userDataSlice';
import io from 'socket.io-client';
import { socket } from '../utils/scoket.io/socket';
import { theme } from '../theme/theme.js';
import '../../tailwind.config.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { notificationListeners } from '../notification/notificationServices.js';
import HomeImage from '../assets/homeImg.svg';
import GenieCulturTapLogo from '../assets/genie-homescreen-logo.svg';
import GenieLogo from '../assets/Genie-Icon.svg';
import HomeScreenBg from '../assets/homeScreenBg.svg';
import { formatDateTime, getGeoCoordinates, getLocationName } from '../utils/logics/Logics';

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.user.userDetails);
    const spades = useSelector(state => state.user.spades);


    const navigationState = useNavigationState(state => state);
    const isHomeScreen = navigationState.routes[navigationState.index].name === 'home';




    useEffect(() => {
        const backAction = () => {
            if (isHomeScreen) {
                BackHandler.exitApp();
                return true;
            } else {
                return false;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Clean up the event listener
    }, [isHomeScreen]);


    const fetchData = async () => {
        const userData = JSON.parse(await AsyncStorage.getItem("userDetails"));
        dispatch(setUserDetails(userData));
        try {
            // console.log('userHomeScreem', userDetails._id);
            const response = await axios.get('https://genie-backend-meg1.onrender.com/user/getspades', {
                params: {
                    id: userData?._id,
                }
            });

            // console.log('HomeScreen', response.data);

            // Check the status from the response object
            if (response.status === 200) {
                // Dispatch the action with the spades data
                const spadesData = response.data;
                spadesData.map((spade, index) => {
                    const dateTime = formatDateTime(spade.updatedAt);
                    spadesData[index].createdAt = dateTime.formattedTime;
                    spadesData[index].updatedAt = dateTime.formattedDate;
                });
                dispatch(setSpades(spadesData));

                // console.log('spades', response.data);

            } else {
                console.error('No Spades Found');
            }

        } catch (error) {
            console.error('Error while finding spades', error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleRefreshLocation = async () => {
        try {
            const res = await getGeoCoordinates();
            const location = await getLocationName(res.coords.latitude, res.coords.longitude);

            let updatedUserData = {
                ...userDetails,
                latitude: res.coords.latitude,
                longitude: res.coords.longitude,
                location: location
            };

            console.log('user updated with location', updatedUserData.latitude, updatedUserData.longitude, updatedUserData.location);

            await axios.patch('https://genie-backend-meg1.onrender.com/user/edit-profile', {
                _id: userDetails._id,
                updateData: { longitude: updatedUserData.longitude, latitude: updatedUserData.latitude, location: updatedUserData.location }
            })
                .then(res => {
                    console.log('result updated of user', res.data);
                })
            dispatch(setUserDetails(updatedUserData));
            await AsyncStorage.setItem("userDetails", JSON.stringify(updatedUserData));

        } catch (error) {
            console.error('Error updating location:', error);
        }
    };




    // console.log('userData', userDetails);
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} className="relative">
                {/* <Image source={require('../assets/HomImg.png')} className="w-full object-cover " /> */}
                {/* <HomeImage /> */}
                <HomeScreenBg />
                <View className="w-full flex flex-row px-[29px] justify-between items-center absolute top-[37px]">
                    <Pressable onPress={() => navigation.navigate("menu")}>
                        <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
                            <Image source={require('../assets/ProfileIcon.png')} className="w-[26px] h-[26px]" />
                        </View>
                    </Pressable>

                    <GenieCulturTapLogo />

                    <Pressable onPress={() => navigation.navigate("history")}>
                        <View className="bg-[#fb8c00] w-[42px] h-[42px] rounded-full flex justify-center items-center mx-auto">
                            <Image source={require('../assets/SettingIcon.png')} className="w-[26px] h-[26px]" />
                        </View>
                    </Pressable>
                </View>

                <View className="w-full bg-white absolute top-[120px] flex-row px-[30px] justify-between h-[55px] items-center">
                    <View>
                        <Text className="text-[14px] font-extrabold pb-[15px[">Location</Text>

                        <Text className="font-light text-[14px]">{userDetails?.location ? `${userDetails.location.substring(0, 70)}....` : "Refresh to fetch location..."}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { handleRefreshLocation() }}>
                        <View>
                            <Text className="text-[14px] font-extrabold text-[#fb8c00]">Refresh</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <View className=" absolute top-[200px] w-full flex-row justify-center">
                    <GenieLogo />
                </View>

                <View className=" -translate-y-28 ">
                    <Text className="text-center text-[14px] text-[#3f3d56] font-bold ">Ask genie for any product or</Text>
                    <Text className="text-center text-[14px] text-[#3f3d56] font-bold">service to start real time bargain</Text>

                    <Pressable onPress={() => { navigation.navigate('requestentry') }} className="mx-[16px] mt-[16px]">
                        <View className="h-[60px] w-full">
                            <Text className="text-[#fb8c00] text-[14px] border-[1px] border-[#fb8c00] w-full bg-white text-center py-[19px] rounded-3xl">Type your spades my master...</Text>
                        </View>

                    </Pressable>

                    {/* How it works when user have no ongoing requests */}

                    {spades.length === 0 && <View>
                        <Text className="text-[#dbcdbb] font-extrabold text-[16px] text-center mt-[50px]">How it works?</Text>
                        <View className="px-[38px] flex flex-col gap-[38px] mt-[47px]">
                            <Text className="text-[#3f3d56] text-[14px] ">
                                Genie will connect you with the retailers, shop owners , business owners and warehouses of almost for all type of needs
                            </Text>
                            <Text className="text-[#3f3d56] text-[14px] ">
                                You can create your request for almost any kind of product or service. You will received multiple bid for single request from multiple suppliers.
                            </Text>
                            <Text className="text-[#3f3d56] text-[14px] ">
                                Bargain with the suppliers & get the best price
                            </Text>
                        </View>

                        <Text className="text-[#dbcdbb] font-extrabold text-[16px] text-center mt-[50px]">How to raise request?</Text>
                        <View className="px-[38px] flex flex-col gap-[38px] mt-[47px]">
                            <Text className="text-[#3f3d56] text-[14px] ">
                                Genie will connect you with the retailers, shop owners , business owners and warehouses of almost for all type of needs
                            </Text>
                            <Text className="text-[#3f3d56] text-[14px] ">
                                You can create your request for almost any kind of product or service. You will received multiple bid for single request from multiple suppliers.
                            </Text>
                            <Text className="text-[#3f3d56] text-[14px] ">
                                Bargain with the suppliers & get the best price
                            </Text>
                        </View>
                    </View>}

                    {/* User ongoing requests  */}


                    {spades.length > 0 && <View>
                        <Text className={`text-center font-extrabold text-text my-[33px]`}>Your ongoing requests</Text>
                        {
                            spades.map((spade, index) => (

                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        dispatch(setCurrentSpade(spade));
                                        navigation.navigate('activerequest');
                                    }}
                                >
                                    <View style={styles.container}>
                                        <View style={styles.imageContainer}>

                                            <Image
                                                source={{ uri: spade.requestImages[0] }}
                                                style={styles.image}
                                            />
                                        </View>

                                        <View>
                                            <View>
                                                <Text style={styles.description}>{spade.requestDescription}</Text>
                                            </View>

                                            <View style={styles.priceRow}>
                                                <Text style={styles.priceText}>Expected Price:</Text>
                                                <Text style={styles.priceValue}>{spade.expectedPrice} Rs</Text>
                                            </View>

                                            <View style={styles.infoRow}>
                                                <View style={styles.infoItem}>
                                                    <Image source={require('../assets/time.png')} />
                                                    <Text style={styles.infoText}>{spade.createdAt}</Text>
                                                </View>
                                                <View style={styles.infoItem}>
                                                    <Image source={require('../assets/calender.png')} />
                                                    <Text style={styles.infoText}>{spade.updatedAt}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))
                        }

                    </View>}



                </View>


            </ScrollView >
        </View>

    )
}


const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 9,
        marginBottom: 10,
        backgroundColor: 'white',
        gap: 15,
        height: 130,
        borderRadius: 15,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
    },
    imageContainer: {
        paddingHorizontal: 18,
    },
    image: {
        width: 95,
        height: 95,
        borderRadius: 15
    },
    description: {
        fontSize: 14,
        width: '83.33%', // 10/12 in tailwind is 83.33%
    },
    priceRow: {
        flexDirection: 'row',
        paddingVertical: 0,
        paddingBottom: 10
    },
    priceText: {
        fontSize: 12,
    },
    priceValue: {
        fontSize: 12,
        color: '#70B241',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 8,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 12,
    },
};



export default HomeScreen
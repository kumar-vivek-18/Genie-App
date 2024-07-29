import { View, Text, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSpade, setHistory, setIsHome } from '../../redux/reducers/userDataSlice';
import BackArrow from "../../assets/arrow-left.svg"
import { baseUrl } from '../../utils/logics/constants';
import axiosInstance from '../../utils/logics/axiosInstance';
import NetworkError from '../components/NetworkError';
import SpadeIcon from '../../assets/SpadeIcon.svg';
import Calender from '../../assets/calender.svg';
import Time from '../../assets/time.svg';

const HistoryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.user.userDetails);
    const history = useSelector(state => state.user.history);
    const accessToken = useSelector(state => state.user.accessToken);
    const [networkError, setNetworkError] = useState(false);
    const [loading, setLoading] = useState(false);
    // console.log('HistoryScreen', history);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const timeOptions = { hour: 'numeric', minute: 'numeric' };
        const dateFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

        // Format time
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        // Format date
        const formattedDate = date.toLocaleDateString('en-US', dateFormatOptions);
        // console.log(formattedDate, formattedTime)

        return { formattedTime, formattedDate };
    };


    const fetchData = async () => {

        try {
            // console.log('userHomeScreem', userDetails);
            setLoading(true);
            console.log('hii');
            console.log(accessToken)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    id: userDetails._id,
                }
            };
            const response = await axiosInstance.get(`${baseUrl}/user/history`, config);

            // console.log(response);

            setLoading(false);
            if (response.status === 200) {
                // Dispatch the action with the spades data
                const spadesData = response.data;

                spadesData.map((spade, index) => {
                    const dateTime = formatDateTime(spade.updatedAt);
                    spadesData[index].createdAt = dateTime.formattedTime;
                    spadesData[index].updatedAt = dateTime.formattedDate;
                });
                // console.log(object)
                dispatch(setHistory(spadesData));

                // console.log('spades', response.data);

            }


        } catch (error) {
            setLoading(false);
            console.log(error);
            if (!error?.response?.status) {
                setNetworkError(true);
            }
            console.error('Error while finding spades', error);
        }
    };


    useEffect(() => {
        setLoading(true);
        fetchData();

    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1 }} className="relative">


                    <View className="z-50 absolute top-[40px] left-[40px]  ">
                        <Pressable onPress={() => { navigation.goBack(); dispatch(setIsHome(true)); }} style={{ padding: 8 }}>
                            <BackArrow width={14} height={10} />

                        </Pressable>
                    </View>



                    <Text className="text-center pt-[40px] text-[16px]  " style={{ fontFamily: "Poppins-Bold" }}>History</Text>
                    <Text className="text-center text-[14px] mb-[28px]" style={{ fontFamily: "Poppins-Regular" }}>Closed Requests</Text>

                    {history?.length > 0 && <View>
                        {
                            history.map((spade, index) => (

                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        dispatch(setCurrentSpade(spade));
                                        navigation.navigate('activerequest');
                                    }}
                                >
                                    <View style={styles.container}>
                                        <View style={styles.imageContainer}>

                                            {spade.requestImages.length > 0 ? (<Image
                                                source={{ uri: spade.requestImages[0] }}
                                                style={styles.image}
                                            />) : (<SpadeIcon width={95} height={95} />)}
                                        </View>

                                        <View className="w-10/12 px-[10px]">
                                            <View className="flex flex-wrap w-[70%] pb-1 ">
                                                <Text className="text-[14px] w-full flex flex-wrap " style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>
                                            </View>

                                            <View style={styles.priceRow}>
                                                <Text style={styles.priceText}>Expected Price:</Text>
                                                <Text style={styles.priceValue}>{spade.expectedPrice} Rs</Text>
                                            </View>

                                            <View style={styles.infoRow}>
                                                <View style={styles.infoItem}>
                                                    <Time />
                                                    <Text style={styles.infoText}>{spade.createdAt}</Text>
                                                </View>
                                                <View style={styles.infoItem}>
                                                    <Calender />
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
                {networkError && <NetworkError callFunction={fetchData} setNetworkError={setNetworkError} />}
                {loading && <View className="flex-row mt-[100px] justify-center items-center "><ActivityIndicator color={'#fb8c00'} /></View>}
            </ScrollView>
        </SafeAreaView>
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
        // height: 130,
        paddingVertical: 15,
        borderRadius: 15,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 6,
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    image: {
        width: 95,
        height: 95,
        borderRadius: 15
    },
    description: {
        fontSize: 14,// 10/12 in tailwind is 83.33%
        width: '70%',
        fontFamily: "Poppins-Regular"
        // 10/12 in tailwind is 83.33%
    },
    priceRow: {
        flexDirection: 'row',
        paddingVertical: 0,
        paddingBottom: 10,
        width: '70%',
    },
    priceText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium"
    },
    priceValue: {
        fontSize: 12,
        color: '#70B241',
        fontFamily: "Poppins-Bold",

    },
    infoRow: {
        flexDirection: 'row',
        gap: 8,
        width: '70%',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 12,
        fontFamily: "Poppins-Regular"
    },
};

export default HistoryScreen;
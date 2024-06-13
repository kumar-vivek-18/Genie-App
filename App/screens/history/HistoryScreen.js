import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { setHistory } from '../../redux/reducers/userRequestsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSpade } from '../../redux/reducers/userDataSlice';
import BackArrow from "../../assets/arrow-left.svg"


const HistoryScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.user.userDetails);
    const history = useSelector(state => state.userRequest.history);
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

    // useEffect(() => {
    //     const fetchHistory = async () => {
    //         try {
    //             console.log('historyId', userDetails._id);
    //             const historys = await axios.get('https://culturtap.com/api/user/history', {
    //                 params: {
    //                     id: userDetails._id,
    //                 }
    //             });

    //             // console.log('historyDaata', historys.data);
    //             if (historys.status === 200) {
    //                 const historyData = historys.data;

    //                 historyData.map((history, index) => {
    //                     const dateTime = formatDateTime(history.updatedAt);
    //                     historyData[index].createdAt = dateTime.formattedTime;
    //                     historyData[index].updatedAt = dateTime.formattedDate;
    //                 });
    //                 dispatch(setHistory(historyData));
    //                 console.log("historyScreenData", historyData);
    //             }
    //         } catch (error) {
    //             console.error("Error occurred while fetching history");
    //         }
    //     }
    //     fetchHistory();
    // }, []);

    const fetchData = async () => {

        try {
            // console.log('userHomeScreem', userDetails);
            const response = await axios.get('https://culturtap.com/api/user/history', {
                params: {
                    id: userDetails._id,
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
                dispatch(setHistory(spadesData));

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


    return (
        <SafeAreaView style={{ flex: 1 ,backgroundColor: "white" }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1 }} className="relative">


                    <View className="z-50 absolute top-[20px] left-[40px]  ">
                        <Pressable onPress={() => { navigation.goBack(); }} style={{padding:8}}>
                        <BackArrow width={14} height={10} />

                        </Pressable>
                    </View>



                    <Text className="text-center pt-[20px] text-[16px]  " style={{ fontFamily: "Poppins-Bold" }}>History</Text>
                    <Text className="text-center text-[14px] mb-[28px]" style={{ fontFamily: "Poppins-Regular" }}>Closed Requests</Text>
                    {/* {
                        history.map((data, index) => (
                            <View key={index} className="flex-row items-center mx-[9px] bg-white gap-[15px] h-[153px] rounded-3xl shadow-3xl">
                                <View className="px-[18px]">
                                    <Image source={require('../../assets/Item.png')} />
                                </View>

                                <View >
                                    <View>
                                        <Text className="text-[14px] w-10/12">{data.requestDescription}</Text>
                                    </View>

                                    <View className="flex-row py-1">
                                        <Text className="text-[12px]">Expected Price:</Text>
                                        <Text className="text-[12px] text-[#70B241]">{data.expectedPrice} Rs</Text>
                                    </View>
                                    <View className="flex-row gap-[8px]">
                                        <View className="flex-row items-center gap-[8px]">
                                            <Image source={require('../../assets/time.png')} />
                                            <Text className="text-[12px]">{data.createdAt}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-[8px]">
                                            <Image source={require('../../assets/calender.png')} />
                                            <Text className="text-[12px]">{data.updatedAt}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        ))
                    } */}
                    {history.length > 0 && <View>
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
                                                    <Image source={require('../../assets/time.png')} />
                                                    <Text style={styles.infoText}>{spade.createdAt}</Text>
                                                </View>
                                                <View style={styles.infoItem}>
                                                    <Image source={require('../../assets/calender.png')} />
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
        width: '83.33%',
        fontFamily: "Poppins-Regular" // 10/12 in tailwind is 83.33%
    },
    priceRow: {
        flexDirection: 'row',
        paddingVertical: 0,
        paddingBottom: 10
    },
    priceText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium"
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
        fontFamily: "Poppins-Regular"
    },
};

export default HistoryScreen;
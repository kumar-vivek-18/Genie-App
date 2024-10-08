
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, RefreshControl, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from 'react-redux';
import { emtpyRequestImages, setNearByStoresCategory, setRequestCategory } from '../../redux/reducers/userRequestsSlice';
import axiosInstance from '../../utils/logics/axiosInstance';
import { baseUrl } from '../../utils/logics/constants';
import Danger from '../../assets/danger.svg';


// const searchData = [
//     { id: 1, name: 'Miscelleneous' },
//     { id: 2, name: 'Spare Parts' },
//     { id: 3, name: 'Mobile Repair' },
//     { id: 4, name: 'Electronics & Electrical Items' },
//     { id: 5, name: 'Home Appliances' },
//     { id: 6, name: 'Furniture' },
//     { id: 7, name: 'Clothing' },
//     { id: 8, name: 'Footwear' },
//     { id: 9, name: 'Health & Beauty' },
//     { id: 10, name: 'Books & Stationery' },
//     { id: 11, name: 'Sports & Outdoors' },
//     { id: 12, name: 'Groceries & Food' },
//     { id: 13, name: 'Paint & Supplies' },
//     { id: 14, name: 'Music & Instruments' },
//     { id: 15, name: 'Jewelry & Accessories' },
//     { id: 16, name: 'Others' },
// ];

const RequestCategory = () => {
    const dispatch = useDispatch();
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);

    // console.log('userRequest', requestDetail);

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const searchData = useSelector(store => store.userRequest.nearByStoresCategory);
    const [searchResults, setSearchResults] = useState(searchData);
    const insets = useSafeAreaInsets();
    const userDetails = useSelector(store => store.user.userDetails);
    const [selectedOption, setSelectedOption] = useState(null);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchNearByStores = useCallback(async () => {
        try {
            // console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
            // console.log(longitude, latitude);
            if (!longitude || !latitude) return;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: {
                    longitude: longitude,
                    latitude: latitude,
                }
            };
            await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config)
                .then(res => {
                    const categories = res.data.map((category, index) => {
                        return { id: index + 1, name: category };
                    });

                    // Log the categories array to verify
                    console.log(categories);
                    dispatch(setNearByStoresCategory(categories));
                })
        } catch (error) {
            console.error("error while fetching nearby stores", error);
        }
    })

    useEffect(() => {
        if (searchData.length == 0) {
            // console.log('fetching nearby stores');
            fetchNearByStores();
        }
    }, []);
    // console.log('searchData', searchData);
    const handleSelectResult = (id) => {
        setSelectedOption(id === selectedOption ? "" : id);
    };

    const search = (text) => {

        const filteredResults = searchData.filter(
            (item) => item.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    const handleTextChange = (text) => {
        setSearchQuery(text);
        search(text);
    };

    const handleSubmit = () => {

        try {
            if (selectedOption !== null) {
                dispatch(setRequestCategory(searchData[selectedOption - 1].name));
                // console.log(selectedOption);
                // console.log(searchData[selectedOption - 1].name);
                // console.log(requestCategory);

                navigation.navigate('addimg');
                dispatch(emtpyRequestImages([]));
            }
        } catch (error) {
            console.error("Error while selecting category");
        }

    }

    const handleRefresh = async () => {
        try {
            fetchNearByStores();

        } catch (error) {
            console.error("Error while fetching nearby stores");
        }
        finally {
            setRefreshing(false);
        }
    }

    return (
        <>
            <View style={styles.container} >
                <View className=" flex z-40 flex-row items-center  mb-[10px] mr-[60px]">
                    <Pressable onPress={() => navigation.goBack()} className="px-[30px] py-[15px]">
                        <BackArrow width={14} height={10} />

                    </Pressable>
                    <Text className="flex flex-1 justify-center items-center text-[#2e2c43] text-center text-[16px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Select Category</Text>

                </View>
                <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
                    <ScrollView className="px-0 mb-[3px] " showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={["#9Bd35A", "#FB8C00"]}
                    />}>


                        <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[15px] " style={{ fontFamily: "Poppins-Medium" }}>
                            Step 2/4
                        </Text>
                        <View className="flex flex-row h-[60px] border-[1px] items-center border-[#000000] border-opacity-25 rounded-[24px] mb-[40px] bg-white" style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)' }}>
                            <Octicons name="search" size={19} style={{ paddingLeft: 20, position: 'absolute', left: 0 }} />
                            <TextInput
                                placeholder="Search here...."
                                placeholderTextColor="#DBCDBB"
                                value={searchQuery}
                                onChangeText={handleTextChange}
                                className="flex text-center text-[14px] text-[#2E2C43] justify-center items-center flex-1 px-[40px]" // Adjusted padding to center the text
                                style={{ fontFamily: "Poppins-Italic", textAlign: 'center' }} // Added textAlign for centering text
                            />
                        </View>

                        {searchResults.length > 0 && <View className="mb-[80px]"  >
                            {searchResults?.map((result) => (
                                <TouchableOpacity
                                    key={result.id}
                                    onPress={() => handleSelectResult(result.id)}
                                >
                                    <View className="flex flex-row  my-[10px] gap-[20px] items-center">
                                        {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && <View className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${result.id === selectedOption ? 'bg-[#fb8c00]' : ''}`}>
                                            {result.id === selectedOption && <Octicons name="check" size={12} color="white" />}
                                        </View>}
                                        {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize text-[#2e2c43] w-[87%]"><Text style={{ fontFamily: 'Poppins-Bold' }}>{result?.name.slice(0, result.name.indexOf('-'))}</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>}
                                        {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize text-[#2e2e43] w-[87%]">{result?.name}</Text>}
                                        {result?.name === "Z-Internal test culturtap ( not for commercial use )" && <View className="flex-row items-center gap-[20px]  w-[70%]">
                                            <View className={`w-[16px] h-[16px] border-[1px] border-[#e04122] items-center `} style={{ backgroundColor: result.id === selectedOption ? '#e04122' : '#ffffff' }}>
                                                {result.id === selectedOption && <Octicons name="check" size={12} color="white" />}
                                            </View>
                                            <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize text-[#e04122] "><Text style={{ fontFamily: 'Poppins-Bold' }}>{result?.name.slice(0, result.name.indexOf('-'))}</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>
                                            <TouchableOpacity onPress={() => setModalVisible(true)} ><Danger /></TouchableOpacity>
                                        </View>}

                                    </View>
                                </TouchableOpacity>

                            ))}
                            {/* <TouchableOpacity
                            key={result.id}
                            onPress={() => handleSelectResult(result.id)}
                        >
                            <View className="flex flex-row  my-[10px] gap-[20px] items-center">
                                <View className={`w-[16px] h-[16px] border-[1px] border-[#fd8c00] items-center ${result.id === selectedOption ? 'bg-[#fd8c00]' : ''}`}>
                                    {result.id === selectedOption && <Octicons name="check" size={12} color="white" />}
                                </View>
                                {<Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize text-[#2e2c43] w-[87%]"><Text style={{ fontFamily: 'Poppins-Bold' }}>Z-</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>}
                            </View>
                        </TouchableOpacity> */}
                        </View>}
                        {searchResults?.length === 0 && <View>
                            <Text style={{ textAlign: 'center', fontFamily: 'Poppins-Regular', marginTop: 50 }}>No available stores in your area.</Text>
                        </View>}
                    </ScrollView>



                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: !selectedOption ? "#e6e6e6" : "#FB8C00",
                            height: 63,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        disabled={!selectedOption}
                        onPress={handleSubmit}
                    >
                        <View style={styles.nextButtonInner}>
                            <Text
                                style={{
                                    color: !selectedOption ? "#888888" : "white",
                                    fontSize: 18,
                                    fontFamily: "Poppins-Black"
                                }}
                            >
                                Next
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {modalVisible && <Modal visible={modalVisible} transparent={true}>
                <TouchableOpacity onPress={() => { setModalVisible(false) }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', marginHorizontal: 30, alignItems: 'center', borderRadius: 10 }} >
                        <Danger width={120} height={120} marginTop={30} />
                        <Text style={{ textAlign: 'center', marginHorizontal: 30, marginVertical: 30, fontFamily: 'Poppins-Regular', color: '#2e2c43' }}>This is an internal test category to make this app seamless for you & other customers.</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: '#e04122' }}>*This category is not for shopping </Text>

                        <TouchableOpacity onPress={() => { setModalVisible(false) }}><Text style={{ fontFamily: 'Poppins-Black', fontSize: 18, color: '#fb8c00', marginVertical: 30 }}>Yes, I understand</Text></TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>}
        </>
    );
};

const styles = {
    container: {
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? 44 : 0, 
        backgroundColor: 'white',
        paddingTop: 40
    },

    nextButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fb8c00',
        height: 63,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonInner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
};

export default RequestCategory;

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from 'react-redux';
import { emtpyRequestImages, setRequestCategory } from '../../redux/reducers/userRequestsSlice';
import axios from 'axios';
import { baseUrl } from '../../utils/logics/constants';
import axiosInstance from '../../utils/logics/axiosInstance';
import NetworkError from './NetworkError';


const AvailableCategories = () => {
    const dispatch = useDispatch();
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const requestCategory = useSelector(store => store.userRequest.requestCategory);

    // console.log('userRequest', requestDetail);

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const userDetails = useSelector(store => store.user.userDetails);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    const [networkError, setNetworkError] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // console.log(accessToken);
    const fetchNearByStores = useCallback(async () => {
        setCategoriesLoading(true);
        try {
            console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
            console.log(longitude, latitude);

            const config = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                params: { // Move "params" inside the config object
                    longitude: longitude,
                    latitude: latitude,
                }
            };
            console.log(config)
            await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config)
                .then(res => {
                    setCategoriesLoading(false);
                    const categories = res.data.map((category, index) => {
                        return { id: index + 1, name: category };
                    });

                    // Log the categories array to verify
                    console.log(categories);
                    // dispatch(setNearByStoresCategory(categories));
                    setSearchData(categories);
                    setSearchResults(categories);
                })
        } catch (error) {
            setCategoriesLoading(false);
            if (!error?.response?.status)
                setNetworkError(true);
            console.error("error while fetching nearby stores", error);
        }
    })

    useEffect(() => {
        fetchNearByStores();

    }, []);

    const handleSelectResult = (id) => {
        setSelectedOption(id === selectedOption ? "" : id);
    };

    const search = (text) => {
        const filteredResults = searchData.filter(
            (item) => item?.name?.toLowerCase().includes(text?.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    const handleTextChange = (text) => {
        setSearchQuery(text);
        search(text);
    };



    return (
        <View style={styles.container} >

            <View className="flex-1 w-full bg-white flex-col  gap-[40px] ">

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', paddingHorizontal: 30, paddingVertical: 50, zIndex: 100 }}>
                        <BackArrow width={14} height={10} />

                    </TouchableOpacity>
                    <View className="px-[32px] flex z-40 flex-row items-center mt-[40px] mb-[10px]">

                        <Text className="flex flex-1 justify-center items-center text-center text-[16px] text-[#2e2c43]" style={{ fontFamily: "Poppins-ExtraBold" }}>Available Categories</Text>

                    </View>
                    <View className="  flex flex-row mt-[20px] h-[60px] border-[1px] mx-[32px] items-center border-[#000000] border-opacity-25 rounded-[24px] bg-white" style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)' }}>
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
                    {!categoriesLoading && <View className=" mt-[30px] px-[42px]">
                        {searchResults?.map((result) => (
                            <View key={result.id} className="flex flex-row  py-[10px] gap-[30px] items-center">
                                {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') > 0 && <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize"><Text style={{ fontFamily: 'Poppins-Bold' }}>{result?.name.slice(0, result.name.indexOf('-'))}</Text>{result.name.indexOf('-') >= 0 ? result.name.slice(result.name.indexOf('-')) : ""}</Text>}
                                {result?.name !== "Z-Internal test culturtap ( not for commercial use )" && result?.name.indexOf('-') == -1 && <Text style={{ fontFamily: "Poppins-Bold" }} className="capitalize">{result?.name}</Text>}
                            </View>
                        ))}
                    </View>}
                    {!categoriesLoading && searchResults.length === 0 && <View>
                        <Text style={{ fontFamily: "Poppins-Regular" }} className="text-[14px] text-[#2E2C43] mt-[20px] text-center">No available stores in your area.</Text>
                    </View>}
                    {networkError && <View ><NetworkError callFunction={fetchNearByStores} setNetworkError={setNetworkError} /></View>}

                    {categoriesLoading && <View className="my-[150px]"><ActivityIndicator color={'#fb8c00'} size={35} /></View>}
                </ScrollView>




                {/* <View className=" absolute bottom-0 left-0 right-0">
                    <TouchableOpacity onPress={() => { handleSubmit() }}>
                        <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                            <Text className="text-white text-[18px] font-extrabold">NEXT</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
                {/* <TouchableOpacity
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
                            NEXT
                        </Text>
                    </View>
                </TouchableOpacity> */}
            </View >

        </View >
    );
};

const styles = {
    container: {
        flex: 1,
        //  marginTop: Platform.OS === 'android' ? 44 : 0, 
        backgroundColor: 'white',
        // paddingTop: 20
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

export default AvailableCategories;
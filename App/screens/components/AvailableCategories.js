
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ArrowLeft from '../../assets/arrow-left.svg';
import BackArrow from "../../assets/BackArrowImg.svg";

import { useDispatch, useSelector } from 'react-redux';
import { emtpyRequestImages, setRequestCategory } from '../../redux/reducers/userRequestsSlice';
import axios from 'axios';


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

    const fetchNearByStores = useCallback(async () => {
        try {
            console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
            console.log(longitude, latitude);
            await axios.get('http://173.212.193.109:5000/retailer/stores-near-me', {
                params: {
                    longitude: longitude,
                    latitude: latitude,
                }
            })
                .then(res => {
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

            <View className="flex-1 w-full bg-white flex-col  gap-[40px] px-[32px] ">
                <ScrollView className="flex-1 px-0 mb-[63px] " showsVerticalScrollIndicator={false} >

                    <View className=" flex z-40 flex-row items-center mt-[24px] mb-[10px]">
                        <Pressable onPress={() => navigation.goBack()} className="px-[10px] py-[15px]">
                            <BackArrow width={14} height={10} />

                        </Pressable>
                        <Text className="flex flex-1 justify-center items-center text-center text-[16px] text-[#2e2c43]" style={{ fontFamily: "Poppins-ExtraBold" }}>Available Categories</Text>

                    </View>
                    <View className="flex flex-row gap-2 h-[60px]  border-[1px] items-center border-[#000000] rounded-[24px] mb-[20px]">
                        <Octicons name="search" size={19} className="pl-[20px]" />
                        <TextInput
                            placeholder="Search here......."
                            placeholderTextColor="#DBCDBB"
                            value={searchQuery}
                            onChangeText={(val) => handleTextChange(val)}
                            className="flex text-[14px] flex-1"
                            style={{ fontFamily: "Poppins-Italic", marginLeft: searchQuery?.length == 0 ? 64 : 20 }}
                        />
                    </View>
                    <View className="px-[10px]">
                        {searchResults?.map((result) => (

                            <View key={result.id} className="flex flex-row  py-[10px] gap-[30px] items-center">
                                <Text style={{ fontFamily: "Poppins-Regular" }} className="capitalize">{result.name}</Text>
                            </View>
                        ))}
                    </View>
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
            </View>

        </View>
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
import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import ArrowLeft from '../../assets/arrow-left.svg';
import Genie from '../../assets/Genie.svg';
import { useNavigation } from '@react-navigation/native';
import { setNearByStoresCategory, setRequestDetail } from '../../redux/reducers/userRequestsSlice';
import { useSelector, useDispatch } from 'react-redux';
import BackArrow from "../../assets/BackArrowImg.svg";
import axios from 'axios';
import { setUserDetails } from '../../redux/reducers/userDataSlice';
import { baseUrl } from '../../utils/logics/constants';
import axiosInstance from '../../utils/logics/axiosInstance';


const RequestEntry = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const requestDetail = useSelector(store => store.userRequest.requestDetail);
    const userDetails = useSelector(store => store.user.userDetails);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    // console.log('hii')
    const fetchNearByStores = useCallback(async () => {
        try {
            console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
            const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
            const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
            console.log(longitude, latitude);
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
        fetchNearByStores();

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ zIndex: 100, position: 'absolute', marginTop: 40 }}>
                    <View className="  px-[32px] py-[15px] ">
                        <BackArrow width={14} height={10} />
                    </View>
                </TouchableOpacity>
                <View className="flex-row justify-center mt-[40px] mb-[10px] ">
                    <Genie width={35} height={52} />
                </View>
                <Text className="text-[14.5px]  text-[#FB8C00] text-center mb-[10px] " style={{ fontFamily: "Poppins-Medium" }}>
                    Step 1/4
                </Text>

                <View className="px-[32px] mb-[20px]">
                    <Text className="text-[16px]  text-[#2e2c43] text-center mb-[18px] " style={{ fontFamily: "Poppins-Black" }}>Type your spade</Text>

                    <Text className="text-[14px] mx-[14px] mt-[15px] text-center text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>like: My phone charger get damaged / I want a 55 inch screen tv / I need a plumber to repair my water supply. </Text>

                </View>

                <View className="mx-[32px]  h-[127px] bg-[#f9f9f9] rounded-xl ">
                    <TextInput
                        multiline
                        numberOfLines={6}
                        onChangeText={(val) => {
                            setQuery(val);
                        }}
                        value={query}
                        placeholder="Type here..."
                        placeholderTextColor="#dbcdbb"
                        className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#d3d3d7] rounded-xl"
                        style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: "Poppins-Regular" }}
                    />
                </View>





                <TouchableOpacity
                    disabled={!query}
                    onPress={() => { dispatch(setRequestDetail(query)); console.log(requestDetail); navigation.navigate('requestcategory'); }}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 68,
                        width: "100%",
                        backgroundColor: !query ? "#e6e6e6" : "#FB8C00",
                        justifyContent: "center", // Center content vertically
                        alignItems: "center", // Center content horizontally
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: "Poppins-Black",
                            color: !query ? "#888888" : "white",
                        }}
                    >
                        NEXT
                    </Text>
                </TouchableOpacity>


            </View>
        </View>
    )
}

export default RequestEntry;
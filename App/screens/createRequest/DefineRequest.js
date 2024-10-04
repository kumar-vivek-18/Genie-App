import { View, Text, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
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


const DefineRequest = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const requestCategory = useSelector(store => store.userRequest.requestCategory);
    const userDetails = useSelector(store => store.user.userDetails);
    const userLongitude = useSelector(store => store.user.userLongitude);
    const userLatitude = useSelector(store => store.user.userLatitude);
    const accessToken = useSelector(store => store.user.accessToken);
    const suggestedImages = useSelector(store => store.userRequest.suggestedImages);

    useEffect(() => {
        if (suggestedImages.length > 0) setQuery("Looking for this product");

    }, []);
    // console.log('hii')
    // const fetchNearByStores = useCallback(async () => {
    //     try {
    //         // console.log('User coors', userLongitude, userLatitude, userDetails.longitude, userDetails.latitude);
    //         const longitude = userLongitude !== 0 ? userLongitude : userDetails.longitude;
    //         const latitude = userLatitude !== 0 ? userLatitude : userDetails.latitude;
    //         // console.log(longitude, latitude);
    //         if (!longitude || !latitude) return;

    //         const config = {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${accessToken}`,
    //             },
    //             params: {
    //                 longitude: longitude,
    //                 latitude: latitude,
    //             }
    //         };
    //         await axiosInstance.get(`${baseUrl}/retailer/stores-near-me`, config)
    //             .then(res => {
    //                 const categories = res.data.map((category, index) => {
    //                     return { id: index + 1, name: category };
    //                 });

    //                 // Log the categories array to verify
    //                 console.log(categories);
    //                 dispatch(setNearByStoresCategory(categories));
    //             })
    //     } catch (error) {
    //         console.error("error while fetching nearby stores", error);
    //     }
    // })

    // useEffect(() => {
    //     fetchNearByStores();

    // }, []);

    console.log('req', requestCategory);

    const suggestions = {
        "Consumer Electronics & Accessories - Home appliances and equipment etc": [
            "Smart Tv 55 inch, Ultra HD", "12 Ltr Oven Toaster Griller with Heating Mode", "Double Door Refrigerator", "1600 Watts Induction Cooktop with Automatic Voltage Regulator"
        ],
        "Fashion/Clothings - Top, bottom, dresses": ["Boiler suits", "Jeans: Denim jackets", "Trench coats", "Wrap dress", "Plain white shirt"],
        "Fashion Accessories - Jewellery, Gold & Diamond": ["vintage jewelry", "wedding jewelry", "Gold earrings", "Diamond Rings", "mett finish jewellery set"],
        "Fashion accessories - Shoes, Bag": [
            "Liberty boys Gola-schv School Uniform Shoe", "EXTRA SOFT Men's Classic Casual Clogs/ Sandals with Adjustable Back Strap", "Black Nike Shoes", "Red Puma Shoes"
        ],
        "Fashion accessories - Sharee, suits, kurti & dress materials etc": [
            "A-Line Kurta with Pant and Dupatta Suit Set", "Floor Length Suits", "Banarsi Sari", "Elegant Draped Styles"
        ],
        "Kids Games,Toys & Accessories": ["Monopoly", "Chess", "Jenga", "Game of States", "Audi Tt Rs Plus Electric Motor Car", "Vintage Electric Motor Car"],
        "Luxury Watches": ["Digital Watch", "Apple Watch", "Android Digital Watch", "Tissot T classic man’s watch"],

    }
    console.log("hii", suggestions[requestCategory]);

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ zIndex: 100, position: 'absolute', marginTop: 40 }}>
                    <View className="  px-[32px] py-[15px] ">
                        <BackArrow width={14} height={10} />
                    </View>
                </TouchableOpacity>
                <View className="flex-row justify-center mt-[40px] mb-[10px] ">
                    <Genie width={35} height={52} />
                </View>
                <Text className="text-[14.5px]  text-[#FB8C00] text-center mb-[10px] " style={{ fontFamily: "Poppins-Medium" }}>
                    Step 2/4
                </Text>

                <View className="px-[32px] mb-[20px]">
                    <Text className="text-[16px]  text-[#2e2c43] text-center  " style={{ fontFamily: "Poppins-Black" }}>Type your spades</Text>


                </View>

                <View className="mx-[32px]  h-[127px] bg-[#ffe5c4] rounded-xl " style={{ marginBottom: 20, borderWidth: 0.5, borderRadius: 16, borderColor: '#fb8c00' }}>
                    <TextInput
                        multiline
                        numberOfLines={6}
                        onChangeText={(val) => {
                            setQuery(val);
                        }}
                        value={query}
                        placeholder="Type here..."
                        placeholderTextColor="#dbcdbb"
                        className="w-full h-[127px] overflow-y-scroll px-[20px]  rounded-xl"
                        style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: "Poppins-Regular" }}
                    />
                </View>


                {requestCategory && suggestions[requestCategory] && <View style={{ paddingHorizontal: 30, marginBottom: 100 }}>
                    <Text style={{ fontFamily: 'Poppins-Regular', paddingLeft: 10, fontSize: 16 }}>Suggestions</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        {suggestions[requestCategory].map((categ, index) => (
                            <TouchableOpacity onPress={() => { setQuery(categ) }} key={index} style={{ borderWidth: 1, borderRadius: 16, borderColor: '#fb8c00', backgroundColor: '#ffe5c4' }}>
                                <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, paddingHorizontal: 5, paddingVertical: 5 }}>{categ}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>}





            </ScrollView>
            <TouchableOpacity
                disabled={!query}
                onPress={() => { dispatch(setRequestDetail(query)); navigation.navigate('addexpectedprice'); }}
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
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default DefineRequest;
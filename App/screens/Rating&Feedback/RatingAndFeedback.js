import { View, Text, Pressable, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Cancel from '../../assets/cross.svg'
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '../../utils/logics/constants';
import axiosInstance from '../../utils/logics/axiosInstance';
import { setHistory } from '../../redux/reducers/userDataSlice';

const RatingAndFeedback = () => {
    const spade = useSelector(store => store.user.currentSpade);
    const retailers = useSelector(store => store.user.currentSpadeRetailers);
    const userDetails = useSelector(store => store.user.userDetails);
    const [retailer, setRetailer] = useState();
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    const [spadeRating, setSpadeRating] = useState(0);
    const navigation = useNavigation();
    const accessToken = useSelector(store => store.user.accessToken);
    const isHome = useSelector(store => store.user.isHome);
    const history = useSelector(store => store.user.history);
    const dispatch = useDispatch();

    useEffect(() => {
        const foundRetailer = retailers.find(retailer => retailer._id === spade.requestAcceptedChat);
        // console.log('foundRetailer', foundRetailer);
        setRetailer(foundRetailer || {});
        console.log("data at feedback scrn", spade.customer)
    }, []);


    const SubmitFeedback = async () => {
        try {
            if (rating === 0) return;
            console.log(spade.customer, retailer.users[0].refId, rating, userDetails.userName, spadeRating, spade._id);
            const config = {
                headers: { // Use "headers" instead of "header"
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
            await axiosInstance.post(`${baseUrl}/rating/create-ratings`, {
                senderId: spade.customer,
                userId: retailer.users[0].refId,
                senderName: userDetails.userName,
                retailerRating: rating,
                spadeRating: spadeRating,
                spadeId: spade._id,
            }, config)
                .then(res => {
                    if (!isHome) {
                        dispatch(setHistory(history.map(data => {
                            if (data._id === spade._id) {
                                return { ...data, rated: true };
                            }
                            return data;
                        })));
                    }
                    console.log("Feedback posted successfully");
                    if (isHome)
                        navigation.navigate('home');
                    else
                        navigation.goBack();
                })
                .catch(err => {
                    console.error(err);
                })
        } catch (error) {
            console.error(error);
        }
    }




    const handlePress = (star) => {
        setRating(star);

    };
    const handleSpadeRating = (star) => {
        setSpadeRating(star);
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, direction: 'inherit' }} >
                <View className="flex-row justify-between px-[30px] mt-[20px] items-center">
                    <Text className="text-[18px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>Vendor Rate & Feedback</Text>
                    <Pressable onPress={() => {
                        if (isHome)
                            navigation.navigate('home')
                        else navigation.goBack();
                    }} >
                        <View>
                            <Cancel />
                        </View>

                    </Pressable>

                </View>

                <View className="px-[34px] mt-[16px] bg-[#ffe7cb] py-[15px]">
                    <Text className="text-[16px] text-[#2e2c43] " style={{ fontFamily: "Poppins-ExtraBold" }}>Request for</Text>
                    <View className=" flex-row">
                        {spade?.requestCategory?.indexOf('-') > 0 && <Text className="text-[14px] bg-[#fb8c00] capitalize text-white px-1 py-1 my-[7px]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestCategory.slice(0, spade?.requestCategory.indexOf('-'))}</Text>}
                    </View>

                    <View className=" ">
                        <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-ExtraBold" }}>Request ID:</Text>
                        <View className="flex-row gap-2">


                            <Text className="text-[14px]" style={{ fontFamily: "Poppins-SemiBold" }}>{spade._id}</Text>
                            <Pressable onPress={() => { Clipboard.setString(spade._id) }}>
                                <Image source={require('../../assets/copy.png')} />
                            </Pressable>
                        </View>
                    </View>

                    <Text className="mt-[10px]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>

                </View>

                <View>
                    {retailer && <Text className="text-[18px] mx-[34px] capitalize text-[#2e2c43] mt-[22px]" style={{ fontFamily: "Poppins-Regular" }}>{retailer?.users[0]?.populatedUser?.storeName}</Text>}
                </View>

                <View className="px-[30px] mt-[19px] ">
                    <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Rate your experience with vendor</Text>
                    <View className="flex-row gap-[5px] mt-[10px]">
                        {[...Array(5)].map((_, index) => {
                            const star = index + 1;
                            return (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => handlePress(star)}
                                >
                                    <FontAwesome
                                        name={star <= rating ? 'star' : 'star-o'}
                                        size={32}
                                        color="#fb8c00"
                                        className="mx-[5px]"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View className="px-[30px] mt-[19px] ">
                    <Text className="text-[14px] text-[#2e2c43]" style={{ fontFamily: "Poppins-Regular" }}>Rate your overall experience</Text>
                    <View className="flex-row gap-[5px] mt-[10px]">
                        {[...Array(5)].map((_, index) => {
                            const star = index + 1;
                            return (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => handleSpadeRating(star)}
                                >
                                    <FontAwesome
                                        name={star <= spadeRating ? 'star' : 'star-o'}
                                        size={32}
                                        color="#fb8c00"
                                        className="mx-[5px]"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View className="px-[30px] " style={{ paddingBottom: 200 }}>
                    <Text className="text-[14px] text-[#2e2c43]  mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-Regular" }}>Feedback for vendor</Text>

                    <KeyboardAvoidingView className="  h-[127px] bg-[#f9f9f9] rounded-xl ">
                        <TextInput
                            multiline
                            numberOfLines={6}
                            onChangeText={(val) => {
                                setFeedback(val);
                            }}
                            value={feedback}
                            placeholder="Type here..."
                            placeholderTextColor="#dbcdbb"
                            className="w-full h-[127px] overflow-y-scroll px-[20px] border-[0.3px] border-[#2e2c43] rounded-xl "

                            style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.15)', padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: 'Poppins-Regular' }}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
            <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                {rating > 0 && spadeRating > 0 && <TouchableOpacity onPress={() => { SubmitFeedback() }}>
                    <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                        <Text className="text-white  text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Submit</Text>
                    </View>
                </TouchableOpacity>}
                {(rating == 0 || spadeRating == 0) && <TouchableOpacity >
                    <View className="w-full h-[68px]  justify-center  bottom-0 left-0 right-0" style={{ backgroundColor: "#e6e6e6" }}>
                        <Text className=" text-center text-[16px]" style={{ fontFamily: "Poppins-Black", color: "#888888" }}>Submit</Text>
                    </View>
                </TouchableOpacity>}
            </View>

        </SafeAreaView>

    )
}


export default RatingAndFeedback
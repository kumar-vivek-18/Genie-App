import { View, Text, Pressable, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Cancel from '../../assets/cross.svg'
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RatingAndFeedback = () => {
    const spade = useSelector(store => store.user.currentSpade);
    const retailers = useSelector(store => store.user.currentSpadeRetailers);
    const userDetails = useSelector(store => store.user.userDetails);
    const [retailer, setRetailer] = useState();
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(0);
    // console.log('retailers', retailer);
    // console.log(retailer.users[0]._id)
    const navigation = useNavigation();

    useEffect(() => {
        const foundRetailer = retailers.find(retailer => retailer._id === spade.requestAcceptedChat);
        // console.log('foundRetailer', foundRetailer);
        setRetailer(foundRetailer || {});
        console.log("data", spade.customer)
    }, []);


    const SubmitFeedback = async () => {
        try {
            if (rating === 0) return;
            console.log(spade.customer, retailer.users[0].refId, rating, feedback);
            await axios.post('http://173.212.193.109:5000/rating/rating-feedback', {
                sender: { type: "User", refId: spade.customer },
                user: { type: "Retailer", refId: retailer.users[0].refId },
                senderName: userDetails.userName,
                rating: rating,
                feedback: feedback,
                chatId: spade.requestAcceptedChat
            })
                .then(res => {
                    console.log("Feedback posted successfully");
                    navigation.navigate('home');
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

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View className="flex-row justify-between px-[30px] mt-[20px] items-center">
                    <Text className="text-[18px] " style={{ fontFamily: "Poppins-Bold" }}>Seller Rate & Feedback</Text>
                    <Pressable onPress={() => { navigation.navigate('home') }} >
                        <View>
                            <Cancel />
                        </View>

                    </Pressable>

                </View>

                <View className="px-[34px] mt-[16px] bg-[#ffe7cb] py-[15px]">
                    <Text className="text-[16px]  " style={{ fontFamily: "Poppins-ExtraBold" }}>Request for</Text>
                    <View className=" flex-row">
                        <Text className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestCategory}</Text>
                    </View>

                    <View className="flex-row gap-[10px] items-center ">
                        <Text className="text-[12px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Request ID:</Text>
                        <Text className="text-[12px]" style={{ fontFamily: "Poppins-Regular" }}>{spade._id}</Text>
                        <Pressable onPress={() => { Clipboard.setString(spade._id) }}>
                            <Image source={require('../../assets/copy.png')} />
                        </Pressable>
                    </View>

                    <Text className="mt-[10px]" style={{ fontFamily: "Poppins-Regular" }}>{spade?.requestDescription}</Text>

                </View>

                <View>
                    {retailer && <Text className="text-[18px] mx-[34px] capitalize text-[2e2c43] mt-[22px]" style={{ fontFamily: "Poppins-Regular" }}>{retailer?.users[0]?.populatedUser?.storeName}</Text>}
                </View>

                <View className="px-[30px] mt-[19px] ">
                    <Text className="text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Rate your experience with seller</Text>
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

                <View className="px-[30px]">
                    <Text className="text-[14px] text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]" style={{ fontFamily: "Poppins-ExtraBold" }}>Feedback for seller</Text>

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
                            style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top', fontFamily: 'Poppins-Regular' }}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
            <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                <TouchableOpacity onPress={() => { SubmitFeedback() }}>
                    <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                        <Text className="text-white  text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    )
}


export default RatingAndFeedback
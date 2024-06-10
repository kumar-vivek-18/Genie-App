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
    const [retailer, setRetailer] = useState();
    const [feedback, setFeedback] = useState("");

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

            await axios.post('http://173.212.193.109:5000/retailer/rating-feedback', {
                user: spade.customer,
                retailer: retailer.users[0]._id,
                rating: rating,
                feedback: feedback,
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


    const [rating, setRating] = useState(0);

    const handlePress = (star) => {
        setRating(star);

    };

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View className="flex-row justify-between px-[30px] mt-[20px] items-center">
                    <Text className="text-[18px] font-bold">Seller Rate & Feedback</Text>
                    <Pressable onPress={() => { navigation.navigate('home') }} >
                        <View>
                            <Cancel />
                        </View>

                    </Pressable>

                </View>

                <View className="px-[34px] mt-[16px] bg-[#ffe7cb] py-[15px]">
                    <Text className="text-[16px] font-extrabold ">Request for</Text>
                    <View className=" flex-row">
                        <Text className="text-[14px] bg-[#fb8c00]  text-white px-1 py-1 my-[7px]">{spade?.requestCategory}</Text>
                    </View>

                    <View className="flex-row gap-[10px] items-center ">
                        <Text className="font-extrabold text-[12px]">Request ID:</Text>
                        <Text className="text-[12px]">{spade._id}</Text>
                        <Pressable onPress={() => { Clipboard.setString(spade._id) }}>
                            <Image source={require('../../assets/copy.png')} />
                        </Pressable>
                    </View>

                    <Text className="mt-[10px]">{spade?.requestDescription}</Text>

                </View>

                <View>
                    {retailer && <Text className="text-[18px] mx-[34px] capitalize text-[2e2c43] mt-[22px]">{retailer?.users[0]?.populatedUser?.storeName}</Text>}
                </View>

                <View className="px-[30px] mt-[19px] ">
                    <Text className="font-bold text-[14px]">Rate your experience with seller</Text>
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
                    <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px] mt-[30px] mb-[15px]">Feedback for seller</Text>

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
                            style={{ padding: 20, height: 300, flex: 1, textAlignVertical: 'top' }}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
            <View className="absolute bottom-[0px] left-[0px] right-[0px] gap-[10px]">

                <TouchableOpacity onPress={() => { SubmitFeedback() }}>
                    <View className="w-full h-[68px]  bg-[#fb8c00] justify-center  bottom-0 left-0 right-0">
                        <Text className="text-white font-bold text-center text-[16px]">Submit</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </SafeAreaView>

    )
}


export default RatingAndFeedback
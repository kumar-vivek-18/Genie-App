import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setExpectedPrice } from '../../redux/reducers/userRequestsSlice';
import BackArrow from "../../assets/BackArrowImg.svg";
import axios from 'axios';


const ExpectedPriceScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute()
    // const { imagesLocal } = route.params

    const requestImages = useSelector(store => store.userRequest.requestImages);
    console.log('images', requestImages);
    const [price, setPrice] = useState("");
    const navigation = useNavigation();
    const expectedPrice = useSelector(store => store.userRequest.expectedPrice);
    const spadePrice = useSelector(store => store.userRequest.spadePrice);
    const [couponCode, setCouponCode] = useState("");

    const VerifyCoupon = async () => {
        try {
            axios.get('https://genie-backend-meg1.onrender.com/coupon/verify-coupon', {
                params: {
                    couponCode: couponCode
                }
            })

        } catch (error) {

        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[50px]  mx-[36px]">
                <Pressable onPress={() => navigation.goBack()} >

                    <BackArrow width={14} height={10} />

                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-center font-extrabold text-[16px] ">Your Expected Price</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]">Skip</Text>
                </Pressable>
            </View>

            <View className="mt-[10px] mx-[28px]">
                <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[10px] ">
                    Step 4/4
                </Text>
                <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px] mt-[20px]">Your Expected Price</Text>
                <TextInput
                    placeholder='Ex:1,200 Rs'
                    value={price}
                    onChangeText={(val) => {
                        setPrice(val);
                        dispatch(setExpectedPrice(parseInt(price)));
                        console.log(expectedPrice);
                    }}
                    keyboardType="numeric"
                    placeholderTextColor={"#558b2f"}
                    className="text-[14px] text-center bg-[#F9F9F9] font-extrabold text-[#2e2c43]  mt-[10px]  rounded-3xl h-[54px] py-[10px] "

                />
                <Text className="text-[14px] text-[#2e2c43] mt-[20px]">Please tell sellers about what you feel the right price for your request. You can skip this
                    if you don't research about pricing.</Text>

                <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px] mt-[40px]">Apply Coupon </Text>
                <TextInput
                    placeholder='Type here...'
                    // value={price}
                    // onChangeText={(val) => {
                    //     // setPrice(val);
                    //     // dispatch(setExpectedPrice(parseInt(price)));
                    //     console.log(expectedPrice);
                    // }}
                    keyboardType="numeric"
                    placeholderTextColor={"#558b2f"}
                    className="text-[14px] text-center bg-[#F9F9F9] font-extrabold text-[#2e2c43]  mt-[10px]  rounded-3xl h-[54px] py-[10px] "

                />
                <TouchableOpacity>
                    <View className="w-full flex items-center justify-center border-2 border-[#fb8c00] py-[16px] mt-[40px]">
                        <Text className="text-[14px] font-bold text-[#fb8c00] ">Apply Coupon </Text>
                    </View>
                </TouchableOpacity>
                <Text className="text-[14px] text-[#2e2c43] mt-[20px]">If you have any coupon code available, you can type the code here to avail the offer</Text>
            </View>


            <View className=" absolute bottom-0 left-0 right-0">
                <TouchableOpacity onPress={() => { dispatch(setExpectedPrice(parseInt(price))); navigation.navigate('requestpreview'); }}>
                    <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                        <Text className="text-white text-[18px] font-bold">Continue</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default ExpectedPriceScreen
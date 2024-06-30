import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setExpectedPrice, setSpadeCouponCode, setSpadePrice } from '../../redux/reducers/userRequestsSlice';
import BackArrow from "../../assets/BackArrowImg.svg";
import axios from 'axios';
import { setUserDetails } from '../../redux/reducers/userDataSlice';


const ExpectedPriceScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute()
    // const { imagesLocal } = route.params

    const requestImages = useSelector(store => store.userRequest.requestImages);
    const userDetails = useSelector(store => store.user.userDetails);
    console.log('images', requestImages);
    const [price, setPrice] = useState("");
    const navigation = useNavigation();
    const expectedPrice = useSelector(store => store.userRequest.expectedPrice);
    const spadePrice = useSelector(store => store.userRequest.spadePrice);
    const [couponCode, setCouponCode] = useState("");
    const [verifiedCouponCode, setVerifiedCouponCode] = useState(false);
    const [couponFailed, setCouponFailed] = useState(false);

    console.log('expected price at exp', expectedPrice);
    const VerifyCoupon = async () => {
        console.log("Adding coupon");
        try {
            await axios.get('http://173.212.193.109:5000/coupon/verify-coupon', {
                params: {
                    couponCode: couponCode
                }
            })
                .then(res => {
                    console.log('res', res.data);
                    if (res.data.message === "Coupon code is valid") {
                        setVerifiedCouponCode(true);
                        dispatch(setSpadePrice(10));
                        dispatch(setSpadeCouponCode(couponCode));
                    }
                    else {
                        setCouponFailed(true);
                    }
                })

        } catch (error) {
            setCouponFailed(true);
            console.log("Error while updating coupon code", error);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[50px]  mx-[20px]">
                <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16, paddingVertical: 16 }} >

                    <BackArrow width={14} height={10} />

                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-center  text-[16px]  " style={{ fontFamily: "Poppins-Bold" }}>Your Expected Price</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px] mx-[16px]" style={{ fontFamily: "Poppins-Medium" }}>Skip</Text>
                </Pressable>
            </View>

            <View className="mt-[10px] mx-[28px]" style={{ fontFamily: "Poppins-Medium" }}>
                <Text className="text-[14.5px] text-[#FB8C00] text-center mb-[10px] ">
                    Step 4/4
                </Text>
                <Text className="text-[14px] text-[#2e2c43] mx-[6px] mt-[20px]" style={{ fontFamily: "Poppins-SemiBold" }}>Your Expected Price</Text>
                <TextInput
                    placeholder='Ex:1,200 Rs'
                    value={price}
                    onChangeText={(val) => {
                        console.log(expectedPrice);
                        setPrice(val);
                        if (val.length > 0) {
                            dispatch(setExpectedPrice(parseInt(val)));
                        }
                        else {
                            dispatch(setExpectedPrice(0));
                        }

                        console.log(expectedPrice, val, val.length);
                    }}
                    keyboardType="numeric"
                    placeholderTextColor={"#558b2f"}
                    className="text-[14px] text-center bg-[#F9F9F9]  text-[#2e2c43]  mt-[10px]  rounded-3xl h-[54px] py-[10px] "
                    style={{ fontFamily: "Poppins-SemiBold" }}

                />
                <Text className="text-[14px] text-[#2e2c43] mt-[20px]" style={{ fontFamily: "Poppins-Regular" }}>Please inform shopkeepers about the price that you believe is appropriate for this request. If you haven't researched pricing, you can skip this.</Text>
                {userDetails.freeSpades === 0 && <View>
                    <Text className="text-[14px]  text-[#2e2c43] mx-[6px] mt-[40px]" style={{ fontFamily: "Poppins-SemiBold" }}>Apply Coupon </Text>
                    <TextInput
                        placeholder='Type here...'
                        value={couponCode}
                        onChangeText={(val) => {
                            // setPrice(val);
                            // dispatch(setExpectedPrice(parseInt(price)));
                            setCouponCode(val);
                            console.log(couponCode);
                            setCouponFailed(false);
                            // console.log(expectedPrice);
                        }}
                        // keyboardType="numeric"
                        placeholderTextColor={"#558b2f"}
                        className="text-[14px] text-center bg-[#F9F9F9]  text-[#2e2c43]  mt-[10px]  rounded-3xl h-[54px] py-[10px] "
                        style={{ fontFamily: "Poppins-SemiBold" }}

                    />
                    {!verifiedCouponCode && !couponFailed && <TouchableOpacity onPress={() => { VerifyCoupon() }}>
                        <View className="w-full flex items-center justify-center border-2 border-[#fb8c00] py-[16px] mt-[40px]">
                            <Text className="text-[14px]  text-[#fb8c00] " style={{ fontFamily: "Poppins-SemiBold" }}>Apply Coupon </Text>
                        </View>
                    </TouchableOpacity>}
                    {verifiedCouponCode && <View className="w-full flex items-center justify-center  py-[16px] mt-[40px]" style={{ border: 2, borderColor: '#558b2f', borderWidth: 2 }}>
                        <Text className="text-[14px]  text-[#558b2f] " style={{ fontFamily: "Poppins-SemiBold" }}>Coupon Added Successfully </Text>
                    </View>}
                    {couponFailed && <View className="w-full flex items-center justify-center  py-[16px] mt-[40px]" style={{ border: 2, borderColor: '#e76063', borderWidth: 2 }}>
                        <Text className="text-[14px]  text-[#E76063] " style={{ fontFamily: "Poppins-SemiBold" }}>Invalid Coupon Code </Text>
                    </View>}
                    <Text className="text-[14px] text-[#2e2c43] mt-[20px] pb-[100px]" style={{ fontFamily: "Poppins-Regular" }}>If you have a coupon code available, you can enter the code here to redeem the offer.</Text>
                </View>}

            </View>
            <View className="absolute bottom-0 left-0 right-0">
                <TouchableOpacity onPress={() => { navigation.navigate('requestpreview'); }}>
                    <View className="w-full h-[63px] bg-[#fb8c00]  flex items-center justify-center  ">
                        <Text className="text-white text-[18px] " style={{ fontFamily: "Poppins-Black" }}>Continue</Text>
                    </View>
                </TouchableOpacity>
            </View>




        </View>
    )
}

export default ExpectedPriceScreen
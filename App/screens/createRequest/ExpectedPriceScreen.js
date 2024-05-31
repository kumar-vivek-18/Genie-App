import { View, Text, Pressable, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setExpectedPrice } from '../../redux/reducers/userRequestsSlice';

const ExpectedPriceScreen = () => {
    const dispatch = useDispatch();

    const requestImages = useSelector(store => store.userRequest.requestImages);
    // console.log('images', requestImages);
    const [price, setPrice] = useState("");
    const navigation = useNavigation();
    const expectedPrice = useSelector(store => store.userRequest.expectedPrice);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[24px] mb-[24px] mx-[36px]">
                <Pressable onPress={() => navigation.goBack()} >
                    <ArrowLeft />
                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]">Your Expected Price</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]">Skip</Text>
                </Pressable>
            </View>

            <View className="mt-[35px] mx-[28px]">
                <Text className="text-[14px] font-extrabold text-[#2e2c43] mx-[6px]">Your Expected Price</Text>
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
                    className="text-[14px] text-center bg-[#ffc882] font-extrabold text-[#2e2c43]  mt-[10px]  rounded-3xl px-[20px] py-[10px] "

                />
                <Text className="text-[14px] text-[#2e2c43] mt-[20px]">Please tell sellers about what you feel the right price for your request. You can skip this
                    if you don't research about pricing.</Text>
            </View>


            <View className="w-screen h-[68px]  bg-[#fb8c00] justify-center absolute bottom-0 left-0 right-0">
                <Pressable onPress={() => { dispatch(setExpectedPrice(parseInt(price))); navigation.navigate('requestpreview'); }}>
                    <Text className="text-white font-bold text-center text-[16px]">Continue</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}

export default ExpectedPriceScreen
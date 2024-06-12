import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';


const ViewRequestScreen = () => {
    const navigation = useNavigation();
    const spade = useSelector(store => store.user.currentSpade);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[24px] mb-[24px] mx-[36px]">
                <Pressable onPress={() => navigation.goBack()} >
                    <ArrowLeft />
                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{fontFamily:"Poppins-SemiBold"}}>View Request</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]"></Text>
                </Pressable>

            </View>

            <View className="mx-[34px] mt-[10px]">
                <Text className=" text-[#2e2c43] text-[14px]" style={{fontFamily:"Poppins-Bold"}}>Spades of master</Text>
                <Text className=" mt-2" style={{fontFamily:"Poppins-Light"}}>{spade.requestDescription}</Text>

                <Text className=" text-[#2e2c43] text-[14px] mt-[36px] mb-[15px]" style={{fontFamily:"Poppins-Bold"}}>Reference image for sellers</Text>

                <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 5, }}>
                    {
                        spade.requestImages?.map((image, index) => (
                            <View key={index}>
                                <Image source={{ uri: image }} style={{ height: 150, width: 120, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                            </View>
                        ))
                    }
                </ScrollView>

                <Text className="font-bold text-[#2e2c43] text-[14px] mt-[60px]" style={{fontFamily:"Poppins-Bold"}}>Your expected price</Text>
                <Text className="text-[#558b2f] " style={{fontFamily:"Poppins-SemiBold"}}>{spade.expectedPrice} Rs</Text>
            </View>





        </SafeAreaView>
    )
}

export default ViewRequestScreen
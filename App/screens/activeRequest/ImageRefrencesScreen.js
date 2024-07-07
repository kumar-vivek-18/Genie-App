import { View, Text, Pressable, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const ImageRefrencesScreen = () => {
    const navigation = useNavigation();

    const spade = useSelector(store => store.user.currentSpade);


    return (
        <View style={{ flex: 1 }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[20px] mb-[24px] mx-[16px] mr-[36px]">
                <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => navigation.goBack()} >
                    <ArrowLeft />
                </TouchableOpacity>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{ fontFamily: "Poppins-Black" }}>Image References</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]"></Text>
                </Pressable>

            </View>

            <View>
                <Text className="text-[#2e2c43] mx-[50px] text-[14px] text-center mt-[24px] mb-[24px] " style={{ fontFamily: "Poppins-Regular" }}>You provided image references for the seller.</Text>
            </View>
            <ScrollView horizontal style={{ paddingHorizontal: 20, marginRight: 10 }}>
                {
                    spade.requestImages?.map((image, index) => (
                        <View key={index} style={{ paddingHorizontal: 3, borderRadius: 24 }}>
                            <Image source={{ uri: image }} style={{ height: 250, width: 170, borderRadius: 24, backgroundColor: '#EBEBEB', borderColor: 'black', borderWidth: 2 }} />
                        </View>
                    ))
                }
            </ScrollView>


        </View>
    )
}

export default ImageRefrencesScreen
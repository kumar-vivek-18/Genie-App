import { View, Text, Pressable, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const ImageRefrencesScreen = () => {
    const navigation = useNavigation();

    const spade = useSelector(store => store.user.currentSpade);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[24px] mb-[24px] mx-[36px]">
                <Pressable onPress={() => navigation.goBack()} >
                    <ArrowLeft />
                </Pressable>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{fontFamily:"Poppins-Black"}}>Image References</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]"></Text>
                </Pressable>

            </View>

            <View>
                <Text className="text-[#2e2c43] mx-[50px] text-[14px] text-center mt-[24px] mb-[24px] " style={{fontFamily:"Poppins-Regular"}}>You provided image references for the seller.</Text>
            </View>
            <View className="flex-row flex-wrap justify-evenly">
                {
                    spade.requestImages?.map((image, index) => (
                        <View key={index}>
                            <Image source={{ uri: image }} style={{ height: 250, width: 170, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                        </View>
                    ))
                }
            </View>


        </SafeAreaView>
    )
}

export default ImageRefrencesScreen
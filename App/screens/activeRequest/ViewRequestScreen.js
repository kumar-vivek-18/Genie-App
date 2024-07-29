import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ArrowLeft from '../../assets/arrow-left.svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';


const ViewRequestScreen = () => {
    const navigation = useNavigation();
    const spade = useSelector(store => store.user.currentSpade);
    const [selectedImage, setSelectedImage] = useState(null);
    const [scaleAnimation] = useState(new Animated.Value(0));

    const handleClose = () => {
        Animated.timing(scaleAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setSelectedImage(null));

    };
    const handleImagePress = (image) => {
        setSelectedImage(image);
        Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View className=" flex z-40 flex-row items-center justify-center mt-[20px] mb-[24px] mx-[16px] mr-[36px]">
                <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => navigation.goBack()} >
                    <ArrowLeft />
                </TouchableOpacity>
                <Text className="flex flex-1 justify-center items-center text-center text-[16px]" style={{ fontFamily: "Poppins-SemiBold" }}>View Request</Text>
                <Pressable onPress={() => { navigation.navigate('requestpreview'); }}>
                    <Text className="text-[14px]"></Text>
                </Pressable>

            </View>

            <View className="mx-[34px] mt-[10px]">
                <Text className=" text-[#2e2c43] text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Spades of master</Text>
                <Text className=" mt-2" style={{ fontFamily: "Poppins-Light" }}>{spade.requestDescription}</Text>

                <Text className=" text-[#2e2c43] text-[14px] mt-[36px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>Reference image for sellers</Text>

                <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 5, }}>
                    {
                        spade.requestImages?.map((image, index) => (
                            <View key={index}>
                                <Pressable onPress={() => { handleImagePress(image) }}>
                                    <Image source={{ uri: image }} style={{ height: 150, width: 120, borderRadius: 24, backgroundColor: '#EBEBEB' }} />
                                </Pressable>
                            </View>
                        ))
                    }
                </ScrollView>

                <Text className="font-bold text-[#2e2c43] text-[14px] mt-[60px]" style={{ fontFamily: "Poppins-Bold" }}>Your expected price</Text>
                <Text className="text-[#558b2f] " style={{ fontFamily: "Poppins-SemiBold" }}>{spade.expectedPrice} Rs</Text>
            </View>


            <Modal
                transparent
                visible={!!selectedImage}
                onRequestClose={handleClose}


            >
                <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.7)", }} onPress={handleClose}>
                    <Animated.Image
                        source={{ uri: selectedImage }}
                        style={
                            {
                                width: 300,
                                height: 400,
                                borderRadius: 10,
                                transform: [{ scale: scaleAnimation }],
                            }
                        }
                    />


                </Pressable>
            </Modal>


        </View>
    )
}

export default ViewRequestScreen
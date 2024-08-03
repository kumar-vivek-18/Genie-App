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
            <TouchableOpacity style={{ position: 'absolute', top: 25, left: 20, paddingHorizontal: 20, paddingVertical: 20, zIndex: 100 }} onPress={() => navigation.goBack()} >
                <ArrowLeft />
            </TouchableOpacity>
            <View className="mt-[40px]">


                <Text className=" text-center text-[16px]" style={{ fontFamily: "Poppins-SemiBold" }}>View Request</Text>

            </View>


            <View className="mx-[34px] mt-[40px]">
                <Text className=" text-[#2e2c43] text-[14px]" style={{ fontFamily: "Poppins-Bold" }}>Spades of master</Text>
                <Text className=" mt-2" style={{ fontFamily: "Poppins-Light" }}>{spade.requestDescription}</Text>

                <Text className=" text-[#2e2c43] text-[14px] mt-[36px] mb-[15px]" style={{ fontFamily: "Poppins-Bold" }}>Reference image for sellers</Text>

                <ScrollView horizontal={true} style={{ alignSelf: 'flex-start' }} contentContainerStyle={{ flexDirection: 'row', gap: 4, paddingHorizontal: 5, }}>
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

                <Text className=" text-[#2e2c43] text-[14px] mt-[60px]" style={{ fontFamily: "Poppins-Bold" }}>Your expected price</Text>
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
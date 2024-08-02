import { View, Text, Image, Pressable, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AboutImg from "../../assets/AboutImg.svg"
import Time from "../../assets/aboutClock.svg"
import Wealth from "../../assets/aboutWealth.svg"
import Health from "../../assets/aboutHealth.svg"
import BackArrow from "../../assets/BackArrowImg.svg"

import SmartImg from "../../assets/smart.svg"


import { SafeAreaView } from 'react-native-safe-area-context';
const AboutScreen = () => {
    const navigation = useNavigation();
    const { width } = Dimensions.get("window");

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView style={{ flex: 1 }} className="relative">


                <View className="z-50 absolute top-[40px] left-[30px] ">
                    <TouchableOpacity onPress={() => { navigation.goBack(); }} style={{ padding: 8 }}>
                        <BackArrow width={14} height={10} />

                    </TouchableOpacity>
                </View>



                <Text className="text-center pt-[40px] text-[#2e2c43] text-[16px]  mb-[60px]" style={{ fontFamily: "Poppins-Bold" }}>About CulturTap {"\n"} Genie</Text>



                <View className="flex flex-col justify-center items-center gap-[40px] px-[30px] mb-[100px]">
                    <View>
                        <AboutImg width={width} className="" />
                    </View>
                    <View className="gap-[20px]">
                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>
                            Bargaining is the consumer's right, money doesn't grow on trees.
                        </Text>
                        <Text className="text-center text-[14px]text-[#2e2c43]  " style={{ fontFamily: "Poppins-Regular" }}>

                            Now bargaining is possible from your couch. Want anything new or to repair the old one, Connect with your nearby vendors and bargaining for the best prices of shopping items and maintenance services available in your city.
                        </Text>
                    </View>
                    <View className="gap-[15px] items-center">
                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>
                            Do Smart Shopping
                        </Text>
                        <SmartImg />

                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>
                            First, check if the shopping item and maintenance service you need are available in your city. You no longer need to wander in the market for shopping items and maintenance services.
                        </Text>
                    </View>
                    <View className="gap-[15px] items-center">
                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>
                            Save Time
                        </Text>
                        <Time />

                        <Text className="text-center text-[14px] text-[#2e2c43]  " style={{ fontFamily: "Poppins-Regular" }}>
                            Save your valuable time to search and explore best prices for your shopping items and maintenance services.
                        </Text>
                    </View>
                    <View className="gap-[15px] items-center">
                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Bold" }}>
                            Save Wealth
                        </Text>
                        <Wealth />

                        <Text className="text-center text-[14px] text-[#2e2c43] " style={{ fontFamily: "Poppins-Regular" }}>
                            Why rush around town searching for the best deals when you can have them come to you? By gathering offers from multiple stores, you'll save on fuel costs and get products at the lowest prices available.
                        </Text>
                    </View>


                </View>
            </ScrollView>
        </View>
    )
}

export default AboutScreen;
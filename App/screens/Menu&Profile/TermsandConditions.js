import { View, Text,  Image, Pressable, ScrollView } from 'react-native'
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import GenieIcon from "../../assets/Genie.svg"
import InputBox from "../../assets/InputBox.svg"
import Sample1 from "../../assets/SampleItem1.svg"
import Sample2 from "../../assets/SampleItem2.svg"


import { SafeAreaView } from 'react-native-safe-area-context';
const TermsandConditons = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} className="relative">


                <View className="z-50 absolute top-[40px] left-[40px] py-[8px] px-[4px]">
                    <Pressable onPress={() => { navigation.goBack(); }}>
                        <Image source={require('../../assets/arrow-left.png')} />
                    </Pressable>
                </View>



                <Text className="text-center pt-[42px] text-[16px] font-bold mb-[60px]">Terms and Conditions</Text>

                

                <View className="flex flex-col justify-center items-center gap-[50px] px-[30px] mb-[100px]">
                   <View className="gap-[30px] ">
                        <Text className="text-[16px] font-bold text-center">Raise your request precisely</Text>
                        <Text className="text-[14px] text-center">Provide proper information about product or service to the sellers</Text>
                        <Text className="text-[16px] font-extrabold text-center">Type your message clearly first</Text>

                   </View>
                   
                    <View className="gap-[30px] items-center">
                        
                        <GenieIcon/>
                        <Text className="text-center text-[16px] font-bold">
                           Raise your request 
                        </Text>
                     
                        <Text className="text-center text-[14px] ">
                           Ex: My phone charger get damage or I want a 55 inch screen tv !
                        </Text>
                        <InputBox/>
                    </View>
                    <View className="gap-[20px] items-center">
        
                        <Text className="text-center text-[16px] font-bold ">
                        Provide exact image reference to the 
                         sellers for better understanding of your need
                        </Text>
                        <Sample1/>
                        <Sample2/>
                    </View>
                    <View className="gap-[20px] items-center">
                        <Text className="text-center text-[16px] font-bold">
                        Tell sellers about your price expectation 
                        </Text>
                     
                        <Text className="text-center text-[14px] ">
                        Finish your research about your price before raising the request
                        </Text>
                        <View className="h-[54px] w-[300px] bg-[#FFC882] flex justify-center items-center rounded-[16px]"> 
                        <Text className="text-[#558B2F] text-[14px] font-bold ">Ex: 1,200 Rs</Text>
                        </View>
                      
                    </View>
                    <View className="gap-[20px] items-center">
                        <Text className="text-center text-[16px] font-bold">
                        Terms for requests 

                        </Text>
                     
                        <Text className="text-center text-[14px] ">
                        If your request start getting bids, there is no refund in this case
                        </Text>
                        <Text className="text-center text-[14px] ">
                        If there is only one seller or no seller for the bid, there will be no charges for the request
                        </Text>
                        <Text className="text-center text-[14px] ">
                        Raise your concern or ask for help to resolve your issues. 
                        </Text>
                        <Text className="text-center text-[14px] ">
                        We are customer focused organization so dont hesitate to share your views.
                        </Text>
                       
                      
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TermsandConditons;